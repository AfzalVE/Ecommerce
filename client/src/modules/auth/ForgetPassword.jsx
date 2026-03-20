import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSendOtpMutation } from "../../modules/auth/authApi";

export default function ForgotPassword() {
    const [sendOtp, {isLoading}] = useSendOtpMutation();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // call send otp api
        await sendOtp({ email }).unwrap();
      toast.success("OTP sent to email");
      navigate("/verify-otp", { state: { email } });

    } catch (err) {

      toast.error("Failed to send OTP");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-3 rounded-lg"
          />

          <button className="w-full bg-black text-white py-3 rounded-lg"
          disabled={isLoading}>
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>

      </div>

    </div>

  );

}