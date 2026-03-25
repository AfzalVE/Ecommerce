export default function Newsletter() {
  return (
    <section className="bg-gray-900 text-white py-16 text-center">

      <h2 className="text-2xl font-semibold mb-4">
        Get Exclusive Deals
      </h2>

      <div className="flex justify-center max-w-md mx-auto">

        <input
          className="px-4 py-2 w-full text-black rounded-l"
          placeholder="Enter email"
        />

        <button className="bg-yellow-400 px-5 text-black rounded-r">
          Subscribe
        </button>

      </div>

    </section>
  );
}