import { Link } from "react-router-dom";
export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">

      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Shop Smarter, <br /> Live Better
          </h1>

          <p className="mb-8 text-lg opacity-90">
            Discover exclusive deals on top products with fast delivery.
          </p>

          <div className="flex gap-4">
            <Link className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition">
              Shop Now
            </Link>

            <Link className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition">
              Explore Deals
            </Link>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae"
          className="rounded-2xl shadow-2xl hover:scale-105 transition duration-500"
        />
      </div>
    </section>
  );
}