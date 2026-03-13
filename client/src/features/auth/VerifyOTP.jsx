import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSendOtpMutation } from "../../features/auth/authApi";


export default function VerifyOTP() {

  const navigate = useNavigate();
  const location = useLocation();
  const [sendOtp , {isLoading}] = useSendOtpMutation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // verify otp api

      await sendOtp({ email }).unwrap();  
      toast.success("OTP verified");

      navigate("/reset-password", { state: { email } });

    } catch (err) {

      toast.error("Invalid OTP");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Enter OTP"
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full border p-3 rounded-lg text-center text-xl tracking-widest"
          />

          <button className="w-full bg-black text-white py-3 rounded-lg"
          disabled={isLoading}>
            {isLoading ? "Verifying OTP..." : "Verify OTP"}
          </button>

        </form>

      </div>

    </div>

  );

}