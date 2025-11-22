import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import LogoImage from '../../../components/ui/Logo.png';
import { useAuth } from '../../../context/AuthContext';
import { APP_NAME } from '../../../constants';

const SignupPage = () => {
  // The signup function here should handle the Axios call internally.
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { loginId, email, password, confirmPassword } = formData;

    // --- Client-Side Validation (Matching Backend Rules) ---

    // 1. Login ID length check
    if (loginId.length < 6 || loginId.length > 12) {
      setToast({
        open: true,
        message: 'Login ID must be between 6 and 12 characters',
        severity: 'error',
      });
      return;
    }

    // 2. Password match check
    if (password !== confirmPassword) {
      setToast({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    // 3. Password complexity check
    const passwordRules =
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      password.length >= 8;

    if (!passwordRules) {
      setToast({
        open: true,
        message: 'Password must have uppercase, lowercase, number, special character and be minimum 8 characters',
        severity: 'error',
      });
      return;
    }

    // --- Signup API Call (via AuthContext) ---
    try {
      // Call the signup function from AuthContext with necessary data
      const result = await signup({
        loginId,
        email,
        password,
        // Note: role is usually set by the backend/defaults to 'staff' as per your backend code
      });

      // The 'result' should contain { success: true, token, ... } if successful
      if (result.success) {
        setToast({ open: true, message: 'Account created! Redirecting...', severity: 'success' });
        // Redirect to dashboard after successful signup and token storage
        navigate('/dashboard');
      } else {
        // Handle success=false from context (if context handles errors gracefully)
        setToast({ open: true, message: result.message || 'Signup failed', severity: 'error' });
      }
    } catch (err) {
      // Handle network errors or specific errors thrown by the context function
      setToast({
        open: true,
        // Accessing message from nested response structure if available
        message: err?.response?.data?.message || err?.message || 'An unexpected error occurred during signup',
        severity: 'error',
      });
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card>
        <div className="flex flex-col items-center space-y-2 mb-4">
          <img src={LogoImage} alt="Logo" className="w-[70px] h-[70px]" />
          <h1 className="text-3xl font-semibold">Join the launchpad</h1>
          <p className="text-sm text-muted text-center">
            Create your {APP_NAME} workspace and get started.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Login ID"
            name="loginId"
            type="text"
            value={formData.loginId}
            onChange={handleChange}
            required
            placeholder="Enter your login ID (6-12 characters)"
            autoFocus
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            helperText="Min 8 chars, including Uppercase, Lowercase, Number, and Special Char"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Re-enter your password"
          />

          <Button type="submit" loading={loading} fullWidth>
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-500 font-medium">
            Login here
          </Link>
        </p>
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

export default SignupPage;