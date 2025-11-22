import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import { useAuth } from '../../../context/AuthContext';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const [values, setValues] = useState({ email: '', password: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(values);
    if (result.success) {
      setToast({ open: true, message: 'Welcome back!', severity: 'success' });
      navigate(redirectPath, { replace: true });
    } else {
      setToast({ open: true, message: 'Login failed. Try again.', severity: 'error' });
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card>
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-brand-500">Login</p>
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="text-muted text-sm">
            Access your workspace and manage your hackathon squad in one place.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            value={values.password}
            onChange={handleChange}
          />
          <Button type="submit" loading={loading} fullWidth>
            Sign in
          </Button>
        </form>
        <p className="text-center text-sm text-muted">
          No account yet?{' '}
          <a href="/signup" className="text-brand-500 font-medium">
            Create one
          </a>
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

export default LoginPage;

