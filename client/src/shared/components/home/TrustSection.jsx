export default function TrustSection() {
  const items = [
    { title: "Free Delivery", icon: "🚚" },
    { title: "Secure Payment", icon: "🔒" },
    { title: "Easy Returns", icon: "↩️" },
    { title: "24/7 Support", icon: "📞" }
  ];

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-6">

        {items.map((item) => (
          <div key={item.title}>
            <div className="text-3xl mb-2">{item.icon}</div>
            <p className="font-semibold">{item.title}</p>
          </div>
        ))}

      </div>
    </section>
  );
}