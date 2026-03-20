import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return alert("Please enter a valid email");
    alert("Subscribed successfully!");
    setEmail("");
  };

  return (
    <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20">

      <div className="max-w-4xl mx-auto text-center px-6">

        {/* TITLE */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay in the Loop 🚀
        </h2>

        <p className="mb-8 text-lg opacity-90">
          Get exclusive deals, new arrivals & special discounts directly to your inbox.
        </p>

        {/* INPUT */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-5 py-3 rounded-lg text-black focus:outline-none"
          />

          <button
            onClick={handleSubscribe}
            className="bg-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Subscribe
          </button>
        </div>

        {/* TRUST TEXT */}
        <p className="text-sm mt-4 opacity-80">
          No spam. Unsubscribe anytime.
        </p>

      </div>
    </section>
  );
}