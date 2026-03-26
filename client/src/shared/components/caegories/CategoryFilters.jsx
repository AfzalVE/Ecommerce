import { useNavigate, useSearchParams, useParams } from "react-router-dom";

export default function CategoryFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categoryId } = useParams();

  // ✅ GET CURRENT VALUES
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const selectedColors = searchParams.get("color")?.split(",") || [];
  const selectedSizes = searchParams.get("size")?.split(",") || [];

  // ✅ UPDATE FILTER (MULTI VALUE SUPPORT)
  const updateFilter = (key, value, isMulti = false) => {
    const params = new URLSearchParams(searchParams);

    if (isMulti) {
      const current = params.get(key)?.split(",") || [];

      if (current.includes(value)) {
        const updated = current.filter((v) => v !== value);
        if (updated.length) params.set(key, updated.join(","));
        else params.delete(key);
      } else {
        current.push(value);
        params.set(key, current.join(","));
      }
    } else {
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    params.set("page", 1); // reset pagination

    const path = categoryId ? `/category/${categoryId}` : "/category";

    navigate(`${path}?${params.toString()}`);
  };

  // ✅ PRICE CHANGE
  const handlePriceChange = (type, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(type, value);
    } else {
      params.delete(type);
    }

    params.set("page", 1);

    const path = categoryId ? `/category/${categoryId}` : "/category";
    navigate(`${path}?${params.toString()}`);
  };

  // ✅ CLEAR ALL
  const clearFilters = () => {
    const path = categoryId ? `/category/${categoryId}` : "/category";
    navigate(path);
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm space-y-6">

      <h2 className="font-semibold text-lg border-b pb-2">
        Filters
      </h2>

      {/* ===== PRICE RANGE ===== */}
      <div>
        <p className="font-medium mb-3">Price Range</p>

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) =>
              handlePriceChange("minPrice", e.target.value)
            }
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />

          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) =>
              handlePriceChange("maxPrice", e.target.value)
            }
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* ===== COLOR FILTER ===== */}
      <div>
        <p className="font-medium mb-2">Color</p>

        {["Red", "Blue", "Black", "White"].map((color) => (
          <label key={color} className="flex gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedColors.includes(color)}
              onChange={() => updateFilter("color", color, true)}
            />
            {color}
          </label>
        ))}
      </div>

      {/* ===== SIZE FILTER ===== */}
      <div>
        <p className="font-medium mb-2">Size</p>

        {["S", "M", "L", "XL"].map((size) => (
          <label key={size} className="flex gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={() => updateFilter("size", size, true)}
            />
            {size}
          </label>
        ))}
      </div>

      {/* CLEAR */}
      <button
        onClick={clearFilters}
        className="text-blue-600 text-sm hover:underline"
      >
        Clear All Filters
      </button>
    </div>
  );
}