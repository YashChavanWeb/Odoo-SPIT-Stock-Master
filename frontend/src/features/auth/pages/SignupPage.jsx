import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Toast from '../../../components/ui/Toast';
import { useAuth } from '../../../context/AuthContext';

const SignupPage = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await signup(values);
    if (result.success) {
      setToast({ open: true, message: 'Account created!', severity: 'success' });
      navigate('/dashboard');
    } else {
      setToast({ open: true, message: 'Signup failed. Try again.', severity: 'error' });
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Card>
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-brand-500">Create account</p>
          <h1 className="text-3xl font-semibold">Join the launchpad</h1>
          <p className="text-muted text-sm">
            Spin up your hackathon-ready workspace with secure defaults and polished UI.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Name" name="name" required value={values.name} onChange={handleChange} />
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
            Create account
          </Button>
        </form>
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <a href="/login" className="text-brand-500 font-medium">
            Login here
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

export default SignupPage;

