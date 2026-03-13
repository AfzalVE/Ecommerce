import { Link } from "react-router-dom";

export default function HeroSection() {

  return (

    <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

        <div>

          <h1 className="text-5xl font-bold mb-6">
            Discover Premium Products
          </h1>

          <p className="mb-8 text-lg opacity-90">
            Shop trending products from trusted brands.
          </p>

          <Link
            to="/products"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold"
          >
            Shop Now
          </Link>

        </div>

        <img
          src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae"
          alt="hero"
          className="rounded-xl shadow-lg"
        />

      </div>

    </section>

  );

}