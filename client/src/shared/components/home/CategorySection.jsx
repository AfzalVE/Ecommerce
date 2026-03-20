const categories = [
  { name: "Electronics", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Home", icon: "🏠" },
  { name: "Beauty", icon: "💄" }
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
            key={cat.name}
            className="bg-white p-8 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition text-center cursor-pointer"
          >
            <div className="text-4xl mb-3">{cat.icon}</div>

            <h3 className="font-semibold text-lg">
              {cat.name}
            </h3>
          </div>
        ))}

      </div>
    </section>
  );
}