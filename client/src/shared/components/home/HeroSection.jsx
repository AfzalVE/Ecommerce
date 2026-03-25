export default function HeroSection() {
  return (
    <section className="bg-[#2874f0] text-white">

      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 items-center gap-10">

        <div>
          <h1 className="text-4xl font-bold mb-4">
            Big Billion Days Sale 🔥
          </h1>

          <p className="mb-6 text-lg">
            Up to 70% off on Electronics, Fashion & more
          </p>

          <button className="bg-yellow-400 text-black px-6 py-3 rounded font-semibold hover:bg-yellow-500">
            Shop Now
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae"
          className="rounded-lg shadow-lg"
        />

      </div>
    </section>
  );
}