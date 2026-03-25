import { useNavigate, useSearchParams } from "react-router-dom";

export default function CategoryFilters() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    navigate(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    navigate("/products");
  };

  return (

    <div className="bg-white p-4 rounded-lg shadow-sm space-y-6">

      <h2 className="font-semibold text-lg">Filters</h2>

      {/* PRICE */}
      <div>
        <p className="font-medium mb-2">Price</p>
        <input
          type="range"
          min="0"
          max="100000"
          onChange={(e) => updateFilter("price", e.target.value)}
          className="w-full accent-blue-500"
        />
      </div>

      {/* BRAND */}
      <div>
        <p className="font-medium mb-2">Brand</p>

        {["Apple", "Samsung", "Sony"].map((brand) => (

          <label key={brand} className="flex gap-2 text-sm cursor-pointer">

            <input
              type="checkbox"
              onChange={() => updateFilter("brand", brand)}
            />

            {brand}

          </label>

        ))}

      </div>

      <button
        onClick={clearFilters}
        className="text-blue-600 text-sm hover:underline"
      >
        Clear Filters
      </button>

    </div>
  );
}