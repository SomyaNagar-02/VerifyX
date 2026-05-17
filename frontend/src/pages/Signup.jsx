import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Field,
  Input,
  Stack,
  Text,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, ShieldCheck, AlertCircle,
  CheckCircle, Eye, EyeOff, Check, X,
} from "lucide-react";
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { toaster } from '../components/ui/toaster';
import {
  validateName,
  validateEmail,
  validatePasswordStrict,
  getPasswordStrength,
  PASSWORD_RULES,
  validateSignupForm,
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

// ─── Field error text ──────────────────────────────────────────────────────────
const FieldError = ({ message }) =>
  message ? (
    <Box display="flex" alignItems="center" gap={1} mt={1}>
      <AlertCircle size={12} color="var(--chakra-colors-red-400)" />
      <Text fontSize="xs" color="red.400">{message}</Text>
    </Box>
  ) : null;

// ─── Input with icon + optional right element ──────────────────────────────────
const AuthInput = ({ icon: Icon, rightElement, isInvalid, isValid, ...props }) => (
  <Box position="relative">
    <Box
      position="absolute"
      left={4}
      top="50%"
      transform="translateY(-50%)"
      color={isInvalid ? 'red.400' : isValid ? 'green.400' : 'whiteAlpha.400'}
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
      borderColor={
        isInvalid ? 'red.500'
        : isValid  ? 'green.500'
        : 'whiteAlpha.150'
      }
      color="white"
      _placeholder={{ color: 'whiteAlpha.300' }}
      _hover={{ borderColor: isInvalid ? 'red.400' : isValid ? 'green.400' : 'whiteAlpha.300' }}
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

// ─── Password Requirements Checklist ──────────────────────────────────────────
const PasswordChecklist = ({ password }) => (
  <Box
    mt={2}
    p={3}
    bg="rgba(0,0,0,0.3)"
    borderRadius="xl"
    borderWidth={1}
    borderColor="whiteAlpha.80"
  >
    <Text fontSize="10px" color="whiteAlpha.400" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" mb={2}>
      Password requirements
    </Text>
    <Stack gap={1}>
      {PASSWORD_RULES.map((rule) => {
        const passed = password ? rule.test(password) : false;
        return (
          <Box key={rule.id} display="flex" alignItems="center" gap={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxSize={4}
              borderRadius="full"
              bg={passed ? 'green.500' : 'whiteAlpha.100'}
              transition="background 0.2s"
              flexShrink={0}
            >
              {passed
                ? <Check size={10} color="black" />
                : <X size={9} color="rgba(255,255,255,0.3)" />
              }
            </Box>
            <Text
              fontSize="xs"
              color={passed ? 'green.400' : 'whiteAlpha.400'}
              transition="color 0.2s"
            >
              {rule.label}
            </Text>
          </Box>
        );
      })}
    </Stack>
  </Box>
);

// ─── Password Strength Bar ─────────────────────────────────────────────────────
const StrengthBar = ({ password }) => {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  return (
    <Box mt={2}>
      <SimpleGrid columns={4} gap={1}>
        {[1, 2, 3, 4].map((bar) => (
          <Box
            key={bar}
            h="3px"
            borderRadius="full"
            bg={bar <= score ? color : 'whiteAlpha.100'}
            transition="background 0.3s"
          />
        ))}
      </SimpleGrid>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Text fontSize="10px" color={color} fontWeight="bold">{label}</Text>
        <Text fontSize="10px" color="whiteAlpha.300">{score}/4</Text>
      </Box>
    </Box>
  );
};

// ─── Signup Page ───────────────────────────────────────────────────────────────
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'issuer',
  });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [pwFocused, setPwFocused] = useState(false);

  const { signup } = useAuth();
  const navigate   = useNavigate();

  // ── Single-field validator ──────────────────────────────────────────────────
  const validateField = useCallback((name, value) => {
    if (name === 'name')            return validateName(value);
    if (name === 'email')           return validateEmail(value);
    if (name === 'password')        return validatePasswordStrict(value);
    if (name === 'confirmPassword') {
      if (!value) return 'Please confirm your password';
      if (value !== formData.password) return 'Passwords do not match';
      return '';
    }
    return '';
  }, [formData.password]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setApiError('');
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
    // Re-validate confirmPassword whenever password changes
    if (name === 'password' && touched.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: formData.confirmPassword !== value
          ? 'Passwords do not match'
          : '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    if (name === 'password') setPwFocused(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate core fields (confirmPassword is frontend-only)
    const validationErrors = validateSignupForm(formData);

    // Also validate confirmPassword
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }

    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Send only the fields the API expects (not confirmPassword)
      const { confirmPassword, ...payload } = formData;
      await signup(payload);
      toaster.create({
        title: 'Account Created! 🎉',
        description: 'Your DocuTrust account is ready. Please sign in.',
        type: 'success',
        duration: 4000,
        closable: true,
      });
      navigate('/login');
    } catch (err) {
      const data    = err.response?.data;
      const message = data?.message || 'Signup failed. Please try again.';

      if (data?.errors?.length) {
        setErrors(mapApiErrors(data.errors));
      }

      setApiError(message);
      toaster.create({
        title: 'Signup Failed',
        description: message,
        type: 'error',
        duration: 4000,
        closable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper — is a field valid (touched, no error, has value)?
  const isFieldValid = (name) =>
    touched[name] && !errors[name] && !!formData[name];

  return (
    <AuthLayout subtitle="Create your secure issuer account">

      {/* Trust badges */}
      <SimpleGrid columns={3} gap={2}>
        {[
          { icon: ShieldCheck, label: 'Zero-storage' },
          { icon: CheckCircle, label: 'SHA-256 hash' },
          { icon: Lock, label: 'JWT secured' },
        ].map(({ icon: Icon, label }) => (
          <Box
            key={label}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
            p={3}
            bg="whiteAlpha.50"
            borderRadius="xl"
            borderWidth={1}
            borderColor="whiteAlpha.80"
          >
            <Icon size={15} color="#68d391" />
            <Text fontSize="9px" color="whiteAlpha.500" fontWeight="bold" textTransform="uppercase" letterSpacing="wider" textAlign="center">
              {label}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {apiError && <ErrorBanner message={apiError} />}

      <form onSubmit={handleSubmit} noValidate>
        <Stack gap={4}>

          {/* ── Full Name ─────────────────────────────────────────────── */}
          <Field.Root invalid={touched.name && !!errors.name}>
            <Field.Label color="whiteAlpha.700" fontWeight="medium" fontSize="sm" mb={1}>
              Full Name
            </Field.Label>
            <AuthInput
              icon={User}
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="name"
              isInvalid={touched.name && !!errors.name}
              isValid={isFieldValid('name')}
            />
            <FieldError message={touched.name && errors.name} />
          </Field.Root>

          {/* ── Email ─────────────────────────────────────────────────── */}
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
              isValid={isFieldValid('email')}
            />
            <FieldError message={touched.email && errors.email} />
          </Field.Root>

          {/* ── Password ──────────────────────────────────────────────── */}
          <Field.Root invalid={touched.password && !!errors.password}>
            <Field.Label color="whiteAlpha.700" fontWeight="medium" fontSize="sm" mb={1}>
              Password
            </Field.Label>
            <AuthInput
              icon={Lock}
              name="password"
              type={showPw ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => setPwFocused(true)}
              autoComplete="new-password"
              isInvalid={touched.password && !!errors.password}
              isValid={isFieldValid('password')}
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
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </Box>
              }
            />

            {/* Strength bar — shown whenever user has typed something */}
            <StrengthBar password={formData.password} />

            {/* Requirements checklist — shown on focus or when there's an error */}
            {(pwFocused || (touched.password && errors.password)) && (
              <PasswordChecklist password={formData.password} />
            )}

            <FieldError message={touched.password && errors.password} />
          </Field.Root>

          {/* ── Confirm Password ───────────────────────────────────────── */}
          <Field.Root invalid={touched.confirmPassword && !!errors.confirmPassword}>
            <Field.Label color="whiteAlpha.700" fontWeight="medium" fontSize="sm" mb={1}>
              Confirm Password
            </Field.Label>
            <AuthInput
              icon={Lock}
              name="confirmPassword"
              type={showCpw ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              autoComplete="new-password"
              isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              isValid={isFieldValid('confirmPassword') && formData.confirmPassword === formData.password}
              rightElement={
                <Box
                  as="button"
                  type="button"
                  onClick={() => setShowCpw(s => !s)}
                  color="whiteAlpha.400"
                  _hover={{ color: 'whiteAlpha.700' }}
                  transition="color 0.2s"
                  aria-label={showCpw ? 'Hide password' : 'Show password'}
                >
                  {showCpw ? <EyeOff size={15} /> : <Eye size={15} />}
                </Box>
              }
            />
            <FieldError message={touched.confirmPassword && errors.confirmPassword} />
          </Field.Root>

          {/* ── Role badge ────────────────────────────────────────────── */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={4}
            bg="whiteAlpha.50"
            borderRadius="xl"
            borderWidth={1}
            borderColor="whiteAlpha.80"
          >
            <Text fontSize="sm" color="whiteAlpha.500">Account Role</Text>
            <Badge
              colorPalette="green"
              variant="surface"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="xs"
              textTransform="capitalize"
            >
              {formData.role}
            </Badge>
          </Box>

          {/* ── Submit ────────────────────────────────────────────────── */}
          <Button
            type="submit"
            colorPalette="green"
            size="lg"
            width="full"
            loading={loading}
            loadingText="Creating account..."
            mt={1}
            borderRadius="full"
            fontWeight="bold"
            letterSpacing="wide"
            boxShadow="0 0 20px rgba(72,187,120,0.2)"
            _hover={{ boxShadow: '0 0 30px rgba(72,187,120,0.35)', transform: 'translateY(-1px)' }}
            transition="all 0.2s"
          >
            Create Account
          </Button>
        </Stack>
      </form>

      {/* ── Divider ────────────────────────────────────────────────────── */}
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
          Already registered?
        </Text>
      </Box>

      <Text textAlign="center" fontSize="sm" color="whiteAlpha.500">
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#68d391', fontWeight: '600' }}>
          Sign In
        </Link>
      </Text>
    </AuthLayout>
  );
};

export default Signup;
