import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLoginMutation } from "../../features/auth/authApi";

export default function LoginPage() {

  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await loginUser(form).unwrap();

      toast.success("Login successful");

      navigate("/");

    } catch (err) {

      toast.error(err?.data?.message || "Login failed");

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-3xl font-bold mb-6 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="flex justify-between mt-4 text-sm">

          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Create Account
          </Link>

          <Link
            to="/forgot-password"
            className="text-red-500 hover:underline"
          >
            Forgot Password
          </Link>

        </div>

      </div>

    </div>

  );

}