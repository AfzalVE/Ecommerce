export default function Newsletter() {

  return (

    <section className="bg-indigo-600 text-white py-16">

      <div className="max-w-3xl mx-auto text-center">

        <h2 className="text-3xl font-bold mb-4">
          Stay Updated
        </h2>

        <div className="flex justify-center gap-3">

          <input
            type="email"
            placeholder="Enter email"
            className="px-4 py-3 rounded-lg text-black"
          />

          <button className="bg-black px-6 py-3 rounded-lg">
            Subscribe
          </button>

        </div>

      </div>

    </section>

  );

}