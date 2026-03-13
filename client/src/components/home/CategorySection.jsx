const categories = [
 "Electronics",
 "Fashion",
 "Home",
 "Beauty"
];

export default function CategorySection() {

  return (

    <section className="max-w-7xl mx-auto px-6 py-16">

      <h2 className="text-3xl font-bold mb-10 text-center">
        Shop by Category
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        {categories.map((cat) => (

          <div
            key={cat}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg text-center cursor-pointer"
          >

            <h3 className="font-semibold text-lg">
              {cat}
            </h3>

          </div>

        ))}

      </div>

    </section>

  );

}