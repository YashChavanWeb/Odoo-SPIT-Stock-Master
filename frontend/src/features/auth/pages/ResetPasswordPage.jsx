import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Added Link for navigation clarity
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Toast from "../../../components/ui/Toast";
import { useAuth } from "../../../context/AuthContext";

const ResetPasswordPage = () => {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // **Crucial:** Relies on the 'email' being passed from the OTP verification step
  const email = location.state?.email;

  const [values, setValues] = useState({ newPassword: "", confirmPassword: "" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // Redirect if email is missing (means user landed here improperly)
  if (!email) {
    setTimeout(() => navigate('/forgot-password'), 0);
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 1. Password match check
    if (values.newPassword !== values.confirmPassword) {
      return setToast({ open: true, message: "Passwords do not match", severity: "error" });
    }

    // 2. Password complexity check (assuming standard rules apply)
    const passwordRules =
      /[a-z]/.test(values.newPassword) &&
      /[A-Z]/.test(values.newPassword) &&
      /[0-9]/.test(values.newPassword) &&
      /[^A-Za-z0-9]/.test(values.newPassword) &&
      values.newPassword.length >= 8;

    if (!passwordRules) {
      return setToast({
        open: true,
        message: 'Password must have uppercase, lowercase, number, special character and be minimum 8 characters',
        severity: 'error'
      });
    }

    // 3. API Call
    const result = await resetPassword({
      email,
      newPassword: values.newPassword, // Ensure this matches the AuthContext function argument name
    });

    if (result.success) {
      setToast({ open: true, message: "Password reset successful! Redirecting to login.", severity: "success" });
      navigate("/login", { replace: true });
    } else {
      setToast({ open: true, message: result.message || "Server error, please try again.", severity: "error" });
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 mt-20">
      <Card>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create New Password</h1>
          <p className="text-muted text-sm">Enter and confirm your new password for **{email}**</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            required
            value={values.newPassword}
            onChange={handleChange}
            helperText="Min 8 chars, including Uppercase, Lowercase, Number, and Special Char"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            value={values.confirmPassword}
            onChange={handleChange}
          />

          <Button type="submit" loading={loading} fullWidth>
            Reset Password
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Back to Login
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

export default ResetPasswordPage;