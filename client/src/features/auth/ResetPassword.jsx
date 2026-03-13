import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useResetPasswordMutation } from "../../features/auth/authApi";


export default function ResetPassword() {

    const navigate = useNavigate();
    const location = useLocation();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const email = location.state?.email;

    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // reset password api
            await resetPassword({ email, password }).unwrap();

            toast.success("Password updated");
            navigate("/login");

        } catch (err) {

            toast.error("Failed");

        }

    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <h2 className="text-3xl font-bold mb-6 text-center">
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border p-3 rounded-lg"
                    />

                    <button className="w-full bg-black text-white py-3 rounded-lg"
                    disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Password"}
                    </button>

                </form>

            </div>

        </div>

    );

}