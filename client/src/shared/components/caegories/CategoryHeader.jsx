import { useNavigate } from "react-router-dom";
import { useGetCategoriesQuery } from "../../../modules/categories/categoryApi";

export default function CategoryHeader({ categoryId, total = 0 }) {
  const navigate = useNavigate();

  const { data: catData } = useGetCategoriesQuery();
  const categories = catData?.categories || [];

  const category = categories.find((c) => c._id === categoryId);
  const categoryName = category?.name || "All Products";

  // 🔥 HANDLE CATEGORY CHANGE
  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;

    if (!selectedId) {
      navigate("/category"); // all products
    } else {
      navigate(`/category/${selectedId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">

      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-3">
        Home / <span className="text-gray-700">{categoryName}</span>
      </p>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        {/* LEFT */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            {categoryName}
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            {total > 0
              ? `${total} products available`
              : "No products found"}
          </p>
        </div>

        {/* 🔥 RIGHT: CATEGORY FILTER */}
        <div>
          <select
            value={categoryId || ""}
            onChange={handleCategoryChange}
            className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}