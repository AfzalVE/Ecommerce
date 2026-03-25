import { useNavigate, useSearchParams, useParams } from "react-router-dom";

export default function CategorySortBar({ total = 0 }) {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams(); // ✅ get categoryId from URL

  const currentSort = searchParams.get("sort") || "";

  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);

    // ✅ set sort
    params.set("sort", e.target.value);

    // ✅ reset page
    params.set("page", 1);

    // ✅ navigate to correct category route
    navigate(`/category/${categoryId}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

      {/* LEFT */}
      <p className="text-sm text-gray-600 font-medium">
        {total > 0 ? `${total} Products found` : "No products"}
      </p>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        <span className="text-sm text-gray-500">Sort by:</span>

        <select
          value={currentSort}
          onChange={handleSortChange}
          className="border px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Relevance</option>
          <option value="popular">Popularity</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="newest">Newest</option>
        </select>

      </div>

    </div>
  );
}