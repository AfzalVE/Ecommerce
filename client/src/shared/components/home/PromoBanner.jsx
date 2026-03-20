export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white p-10 rounded-2xl flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-bold mb-2">
            Big Sale is Live 🔥
          </h2>
          <p>Up to 50% off on selected items</p>
        </div>

        <button className="bg-white text-black px-6 py-3 rounded-lg font-semibold">
          Shop Deals
        </button>

      </div>
    </section>
  );
}