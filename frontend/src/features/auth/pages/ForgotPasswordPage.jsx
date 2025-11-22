import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import { useAuth } from '../../../context/AuthContext';

const ForgotPasswordPage = () => {
  // All context functions are correctly imported
  const { sendOTP, verifyOTP, resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: enter email, 2: verify OTP, 3: set new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // Function to show toast message
  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };

  // Step 1: send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await sendOTP({ email });
      if (result.success) {
        showToast('OTP sent to your email', 'success');
        setStep(2);
      } else {
        showToast(result.message || 'Failed to send OTP. Please check your email.', 'error');
      }
    } catch (err) {
      showToast('An error occurred during OTP request.', 'error');
    }
  };

  // Step 2: verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await verifyOTP({ email, otp });
      if (result.success) {
        showToast('OTP verified successfully', 'success');
        setStep(3);
      } else {
        showToast(result.message || 'Invalid or expired OTP. Please try again.', 'error');
      }
    } catch (err) {
      showToast('An error occurred during OTP verification.', 'error');
    }
  };

  // Step 3: set new password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // 1. Password match check
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    // 2. Password complexity check (Assuming same rules as signup)
    const passwordRules =
      /[a-z]/.test(newPassword) &&
      /[A-Z]/.test(newPassword) &&
      /[0-9]/.test(newPassword) &&
      /[^A-Za-z0-9]/.test(newPassword) &&
      newPassword.length >= 8;

    if (!passwordRules) {
      showToast(
        'Password must have uppercase, lowercase, number, special character and be minimum 8 characters',
        'error'
      );
      return;
    }

    // 3. API Call
    try {
      // Backend expects { email, newPassword }
      const result = await resetPassword({ email, newPassword });

      if (result.success) {
        showToast('Password updated successfully! Redirecting to login.', 'success');
        navigate('/login');
      } else {
        showToast(result.message || 'Failed to reset password. Please try again.', 'error');
      }
    } catch (err) {
      showToast('An error occurred during password reset.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 mt-20">
      <Card>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold">Forgot Password</h1>
          <p className="text-sm text-muted">
            {step === 1 && 'Enter your email to receive an OTP'}
            {step === 2 && `Enter the OTP sent to ${email}`}
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
              placeholder="Enter the 6-digit OTP"
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
              helperText="Min 8 chars, including Uppercase, Lowercase, Number, and Special Char"
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