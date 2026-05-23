import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import IssueCertificate from './pages/IssueCertificate';
import History from './pages/History';
import TestProcessing from './pages/TestProcessing';
import TestImageVerification from './pages/TestImageVerification';
import VerifyEntry from './pages/VerifyEntry';
import VerifyDocument from './pages/VerifyDocument';
import Profile from './pages/Profile';
import AuditLogs from './pages/AuditLogs';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/manual-verify" element={<VerifyEntry />} />
      <Route path="/verify/:sealId" element={<VerifyDocument />} />

      {/* ── Auth Routes (Redirects if logged in) ──────── */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* ── Protected Routes ──────────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issue-document" element={<IssueCertificate />} />
        <Route path="/history" element={<History />} />
        <Route path="/process" element={<TestProcessing />} />
        <Route path="/image-verify" element={<TestImageVerification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
      </Route>
    </Routes>
  );
}

export default App;

