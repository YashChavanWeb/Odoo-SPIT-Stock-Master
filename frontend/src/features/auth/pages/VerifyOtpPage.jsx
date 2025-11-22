import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Toast from "../../../components/ui/Toast";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/reset-password", { state: { email, otp } });
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Card>
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Verify OTP</h1>
          <p className="text-muted text-sm">Enter OTP sent to your email</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Enter OTP"
            name="otp"
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button type="submit" fullWidth>
            Verify OTP
          </Button>
        </form>
      </Card>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />
    </div>
  );
};

export default VerifyOtpPage;
