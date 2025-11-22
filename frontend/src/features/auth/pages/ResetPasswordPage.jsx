import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Toast from "../../../components/ui/Toast";
import { useAuth } from "../../../context/AuthContext";

const ResetPasswordPage = () => {
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // email received from Verify OTP page

  const [values, setValues] = useState({ newPassword: "", confirmPassword: "" });
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values.newPassword !== values.confirmPassword) {
      return setToast({ open: true, message: "Passwords do not match", severity: "error" });
    }

    const result = await resetPassword({
      email,
      password: values.newPassword,
    });

    if (result.success) {
      setToast({ open: true, message: "Password reset successful", severity: "success" });
      navigate("/login", { replace: true });
    } else {
      setToast({ open: true, message: "Server error, try again", severity: "error" });
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create New Password</h1>
          <p className="text-muted text-sm">Enter and confirm your new password</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            required
            value={values.newPassword}
            onChange={handleChange}
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
