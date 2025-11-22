import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import LogoImage from '../../../components/ui/Logo.png';
import { useAuth } from '../../../context/AuthContext';
import { APP_NAME } from '../../../constants';

const SignupPage = () => {
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

    if (formData.password !== formData.confirmPassword) {
      setToast({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    if (formData.password.length < 6) {
      setToast({ open: true, message: 'Password must be at least 6 characters', severity: 'error' });
      return;
    }

    try {
      const result = await signup({
        name: formData.loginId,
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        setToast({ open: true, message: 'Account created!', severity: 'success' });
        navigate('/dashboard');
      } else {
        setToast({ open: true, message: 'Signup failed. Try again.', severity: 'error' });
      }
    } catch (err) {
      setToast({ open: true, message: 'An error occurred. Please try again.', severity: 'error' });
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card>
        {/* Logo + Heading */}
        <div className="flex flex-col items-center space-y-2 mb-4">
          <img src={LogoImage} alt="Logo" className="w-[70px] h-[70px]" />
          <h1 className="text-3xl font-semibold">Join the launchpad</h1>
          <p className="text-sm text-muted text-center">
            Create your {APP_NAME} workspace and get started.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Login ID"
            name="loginId"
            type="text"
            value={formData.loginId}
            onChange={handleChange}
            required
            placeholder="Enter your login ID"
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
