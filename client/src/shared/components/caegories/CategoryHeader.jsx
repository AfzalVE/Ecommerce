import { useGetCategoriesQuery } from "../../../modules/categories/categoryApi";

export default function CategoryHeader({ categoryId, total = 0 }) {
  const { data: catData } = useGetCategoriesQuery();
  const categories = catData?.categories || [];

  // Find category by ID
  const category = categories.find((c) => c._id === categoryId);

  const categoryName = category?.name || "All Products";

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-3">
        Home / <span className="text-gray-700">{categoryName}</span>
      </p>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">{categoryName}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {total > 0
              ? `${total} products available`
              : "No products found"}
          </p>
        </div>

        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <img
            src="https://images.unsplash.com/photo-1510557880182-3c3c8c0fbc2c"
            alt="category"
            className="h-20 w-32 object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}