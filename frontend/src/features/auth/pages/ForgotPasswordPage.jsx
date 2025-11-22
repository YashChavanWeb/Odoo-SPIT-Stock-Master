import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import { useAuth } from '../../../context/AuthContext';

const ForgotPasswordPage = () => {
  const { sendOTP, verifyOTP, resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: enter email, 2: verify OTP, 3: set new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Step 1: send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await sendOTP({ email });
      if (result.success) {
        setToast({ open: true, message: 'OTP sent to your email', severity: 'success' });
        setStep(2);
      } else {
        setToast({ open: true, message: 'Failed to send OTP', severity: 'error' });
      }
    } catch (err) {
      setToast({ open: true, message: 'An error occurred', severity: 'error' });
    }
  };

  // Step 2: verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyOTP({ email, otp });
      if (result.success) {
        setToast({ open: true, message: 'OTP verified', severity: 'success' });
        setStep(3);
      } else {
        setToast({ open: true, message: 'Invalid OTP', severity: 'error' });
      }
    } catch (err) {
      setToast({ open: true, message: 'An error occurred', severity: 'error' });
    }
  };

  // Step 3: set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    try {
      const result = await resetPassword({ email, newPassword });
      if (result.success) {
        setToast({ open: true, message: 'Password updated successfully', severity: 'success' });
        navigate('/login');
      } else {
        setToast({ open: true, message: 'Failed to reset password', severity: 'error' });
      }
    } catch (err) {
      setToast({ open: true, message: 'An error occurred', severity: 'error' });
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 mt-20">
      <Card>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
          <p className="text-sm text-muted">
            {step === 1 && 'Enter your email to receive an OTP'}
            {step === 2 && 'Enter the OTP sent to your email'}
            {step === 3 && 'Set a new password for your account'}
          </p>
        </div>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOTP}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            <Button type="submit" fullWidth loading={loading}>
              Send OTP
            </Button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleVerifyOTP}>
            <Input
              label="OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter the OTP"
            />
            <Button type="submit" fullWidth loading={loading}>
              Verify OTP
            </Button>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter new password"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
            />
            <Button type="submit" fullWidth loading={loading}>
              Set New Password
            </Button>
          </form>
        )}
      </Card>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default ForgotPasswordPage;
