import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import LogoImage from '../../../components/ui/Logo.png';
import { useAuth } from '../../../context/AuthContext';
import { APP_NAME } from '../../../constants';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ loginId: '', password: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const result = await login({
        loginId: formData.loginId,
        password: formData.password,
      });

      if (result.success) {
        setToast({ open: true, message: 'Welcome back!', severity: 'success' });
        navigate('/dashboard', { replace: true });
      } else {

        setToast({ open: true, message: result.message || 'Invalid login credentials.', severity: 'error' });
      }
    } catch (err) {
      setToast({
        open: true,
        message: err?.response?.data?.message || 'An error occurred. Please try again.',
        severity: 'error'
      });
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card>
        {/* Logo + Heading */}
        <div className="flex flex-col items-center space-y-2 mb-4">
          <img src={LogoImage} alt="Logo" className="w-[70px] h-[70px]" />
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted text-center">
            Access your workspace and manage your {APP_NAME} in one place.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Login ID"
            name="loginId"
            type="text"
            required
            value={formData.loginId}
            onChange={handleChange}
            placeholder="Enter your login ID"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <Button type="submit" loading={loading} fullWidth>
            Sign in
          </Button>
        </form>

        <div className="mt-4 flex justify-between text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-primary hover:underline font-semibold">
            Sign Up
          </Link>
        </div>
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

export default LoginPage;