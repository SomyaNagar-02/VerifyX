import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Field,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { toaster } from '../components/ui/toaster';
import {
  validateEmail,
  validatePasswordBasic,
  validateLoginForm,
  mapApiErrors,
} from '../utils/validators';

// ─── Error Banner ──────────────────────────────────────────────────────────────
const ErrorBanner = ({ message }) => (
  <Box
    display="flex"
    alignItems="flex-start"
    gap={2}
    p={4}
    bg="rgba(239,68,68,0.08)"
    color="red.400"
    borderRadius="xl"
    fontSize="sm"
    borderWidth={1}
    borderColor="rgba(239,68,68,0.25)"
    role="alert"
  >
    <Box flexShrink={0} mt="1px"><AlertCircle size={15} /></Box>
    <Text>{message}</Text>
  </Box>
);

// ─── Auth Input with optional right-side action (e.g. eye toggle) ──────────────
const AuthInput = ({ icon: Icon, rightElement, isInvalid, ...props }) => (
  <Box position="relative">
    {/* Left icon */}
    <Box
      position="absolute"
      left={4}
      top="50%"
      transform="translateY(-50%)"
      color={isInvalid ? 'red.400' : 'whiteAlpha.400'}
      zIndex={1}
      pointerEvents="none"
      transition="color 0.2s"
    >
      <Icon size={15} />
    </Box>

    <Input
      pl={10}
      pr={rightElement ? 12 : 4}
      variant="outline"
      size="lg"
      bg="whiteAlpha.50"
      borderColor={isInvalid ? 'red.500' : 'whiteAlpha.150'}
      color="white"
      _placeholder={{ color: 'whiteAlpha.300' }}
      _hover={{ borderColor: isInvalid ? 'red.400' : 'whiteAlpha.300' }}
      _focus={{
        borderColor: isInvalid ? 'red.500' : 'green.500',
        bg: 'rgba(255,255,255,0.05)',
        boxShadow: isInvalid
          ? '0 0 0 1px var(--chakra-colors-red-500)'
          : '0 0 0 1px var(--chakra-colors-green-500)',
      }}
      borderRadius="xl"
      transition="all 0.2s"
      aria-invalid={isInvalid}
      {...props}
    />

    {/* Right element slot (e.g. show/hide toggle) */}
    {rightElement && (
      <Box
        position="absolute"
        right={4}
        top="50%"
        transform="translateY(-50%)"
        zIndex={1}
      >
        {rightElement}
      </Box>
    )}
  </Box>
);

// ─── Field error text ──────────────────────────────────────────────────────────
const FieldError = ({ message }) =>
  message ? (
    <Box display="flex" alignItems="center" gap={1} mt={1}>
      <AlertCircle size={12} color="var(--chakra-colors-red-400)" />
      <Text fontSize="xs" color="red.400">{message}</Text>
    </Box>
  ) : null;

// ─── Login Page ────────────────────────────────────────────────────────────────
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPw, setShowPw]     = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── Validate a single field on blur ─────────────────────────────────────────
  const validateField = useCallback((name, value) => {
    if (name === 'email')    return validateEmail(value);
    if (name === 'password') return validatePasswordBasic(value);
    return '';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setApiError('');
    // Re-validate live once the field has been touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Run full form validation and mark all fields touched
    const validationErrors = validateLoginForm(formData);
    setTouched({ email: true, password: true });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await login(formData);
      toaster.create({
        title: 'Welcome back!',
        description: 'You are now logged in to DocuTrust.',
        type: 'success',
        duration: 3000,
        closable: true,
      });
      navigate('/dashboard');
    } catch (err) {
      const data    = err.response?.data;
      const message = data?.message || 'Invalid email or password. Please try again.';

      // Map field-level errors from backend if present
      if (data?.errors?.length) {
        setErrors(mapApiErrors(data.errors));
      }

      setApiError(message);
      toaster.create({
        title: 'Login Failed',
        description: message,
        type: 'error',
        duration: 4000,
        closable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Welcome back — verify with confidence">
      {/* API-level error banner */}
      {apiError && <ErrorBanner message={apiError} />}

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap={5}>

          {/* ── Email ──────────────────────────────────────────────────── */}
          <Field.Root invalid={touched.email && !!errors.email}>
            <Field.Label color="whiteAlpha.700" fontWeight="medium" fontSize="sm" mb={1}>
              Email Address
            </Field.Label>
            <AuthInput
              icon={Mail}
              name="email"
              type="email"
              placeholder="name@organization.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="email"
              isInvalid={touched.email && !!errors.email}
            />
            <FieldError message={touched.email && errors.email} />
          </Field.Root>

          {/* ── Password ───────────────────────────────────────────────── */}
          <Field.Root invalid={touched.password && !!errors.password}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Field.Label color="whiteAlpha.700" fontWeight="medium" fontSize="sm" m={0}>
                Password
              </Field.Label>
              <ChakraLink
                href="#"
                fontSize="xs"
                color="green.400"
                _hover={{ color: 'green.300', textDecoration: 'underline' }}
              >
                Forgot password?
              </ChakraLink>
            </Box>
            <AuthInput
              icon={Lock}
              name="password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="current-password"
              isInvalid={touched.password && !!errors.password}
              rightElement={
                <Box
                  as="button"
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  color="whiteAlpha.400"
                  _hover={{ color: 'whiteAlpha.700' }}
                  transition="color 0.2s"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </Box>
              }
            />
            <FieldError message={touched.password && errors.password} />
          </Field.Root>

          {/* ── Submit ─────────────────────────────────────────────────── */}
          <Button
            type="submit"
            colorPalette="green"
            size="lg"
            width="full"
            loading={loading}
            loadingText="Signing in..."
            mt={2}
            borderRadius="full"
            fontWeight="bold"
            letterSpacing="wide"
            boxShadow="0 0 20px rgba(72,187,120,0.2)"
            _hover={{ boxShadow: '0 0 30px rgba(72,187,120,0.35)', transform: 'translateY(-1px)' }}
            transition="all 0.2s"
          >
            <Box display="flex" alignItems="center" gap={2}>
              Sign In <ArrowRight size={16} />
            </Box>
          </Button>
        </Stack>
      </form>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <Box position="relative" my={2}>
        <Box borderTopWidth={1} borderColor="whiteAlpha.100" />
        <Text
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bg="black"
          px={3}
          fontSize="xs"
          color="whiteAlpha.400"
        >
          New to DocuTrust?
        </Text>
      </Box>

      <Text textAlign="center" fontSize="sm" color="whiteAlpha.500">
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#68d391', fontWeight: '600' }}>
          Create one free
        </Link>
      </Text>
    </AuthLayout>
  );
};

export default Login;
