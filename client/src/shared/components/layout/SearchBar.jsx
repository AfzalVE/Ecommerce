import { useState, useEffect } from "react";

export default function SearchBar({ value, onChange, onSelect, fetchSuggestions }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!value) return setSuggestions([]);

    const fetch = async () => {
      const res = await fetchSuggestions(value);
      setSuggestions(res || []);
    };

    const debounce = setTimeout(fetch, 300); // debounce
    return () => clearTimeout(debounce);
  }, [value, fetchSuggestions]);

  return (
    <div className="relative mb-4">
      <input
        type="text"
        className="border p-2 w-full rounded"
        placeholder="Search orders by #, user name or email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 rounded shadow z-10 max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(item);
                onChange(""); // reset search input
                setSuggestions([]);
              }}
            >
              {item.orderNumber} - {item.user?.name} ({item.user?.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}