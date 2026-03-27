import { useNavigate, useSearchParams } from "react-router-dom";

export default function Pagination({ page = 1, totalPages = 1 }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const changePage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="flex justify-center mt-6 gap-2">
      <button
        disabled={page <= 1}
        onClick={() => changePage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => changePage(i + 1)}
          className={`px-3 py-1 rounded ${
            page === i + 1 ? "bg-blue-500 text-white" : "border"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={page >= totalPages}
        onClick={() => changePage(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}