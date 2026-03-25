import { Link } from "react-router-dom";
import { Laptop, Shirt, Home, Sparkles } from "lucide-react";
import { useGetCategoriesQuery } from "../../../modules/categories/categoryApi";

const iconMap = {
  Electronics: <Laptop size={28} />,
  Fashion: <Shirt size={28} />,
  Home: <Home size={28} />,
  Beauty: <Sparkles size={28} />,
};

export default function CategorySection() {
  const { data, isLoading, isError } = useGetCategoriesQuery();
  const categories = data?.categories || [];

  if (isLoading) return <div className="p-4 text-gray-500">Loading categories...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load categories</div>;
  if (!categories.length) return <div className="p-4 text-gray-500">No categories found</div>;

  return (
    <section className="bg-white border-b">
      <div className="max-w-7xl mx-auto flex justify-between px-6 py-4 overflow-x-auto">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            to={`/category/${cat._id}`} // pass ID for proper fetch
            className="flex flex-col items-center group min-w-[80px]"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-full
              group-hover:bg-blue-500 group-hover:text-white transition">
              {iconMap[cat.name] || <Laptop size={28} />}
            </div>
            <p className="text-sm mt-2 group-hover:text-blue-600 whitespace-nowrap">{cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}