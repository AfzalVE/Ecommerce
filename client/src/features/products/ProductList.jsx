import { useNavigate } from "react-router-dom";

export default function ProductList({ products }) {
  console.log("Rendering ProductList with products:", products);

  const navigate = useNavigate();

  return (

    <div className="bg-white shadow rounded-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr className="text-left">

            <th className="p-4">Image</th>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Variants</th>
            <th className="p-4">Actions</th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr
              key={product._id}
              className="border-t hover:bg-gray-50"
            >

              <td className="p-4">

                <img
                  src={`http://localhost:5000${product.variants?.[0]?.images?.[0]?.url}`}
                  className="w-14 h-14 object-cover rounded"
                />

              </td>

              <td className="p-4 font-medium">
                {product.title}
              </td>

              <td className="p-4">
                {product.category?.name || "Uncategorized"}
              </td>

              <td className="p-4">
                {product.variants?.length}
              </td>

              <td className="p-4">

                <button
                  onClick={() => navigate(`/edit-product/${product._id}`)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}