import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDeleteProductMutation } from "./productApi";
import { API_URL } from "../../utils/constants";

export default function ProductList({ products }) {

  const navigate = useNavigate();
  const [deleteProduct] = useDeleteProductMutation();

  /* ✅ SAFE IMAGE FINDER */
  const getProductImage = (product) => {
    console.log("Finding image for product:", product);

    if (!product?.variants) return null;

    for (let variant of product.variants) {
      console.log("Checking variant:", variant);
      if (variant?.images && variant.images.length > 0) {
        return `${API_URL}${variant.images[0].url}`;
      }
    }

    return null;
  };

  /* ✅ TOTAL STOCK */
  const getTotalStock = (product) => {
    return (product.variants || []).reduce(
      (total, v) => total + (Number(v.stock) || 0),
      0
    );
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (

    <div className="bg-white shadow rounded-xl overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">

          <tr className="text-left">
            <th className="p-4">Image</th>
            <th className="p-4">Title</th>
            <th className="p-4">Category</th>
            <th className="p-4">Variants</th>
            <th className="p-4">Stock</th>
            <th className="p-4">Actions</th>
          </tr>

        </thead>

        <tbody>

          {products.map((product) => {

            const image = getProductImage(product);
            const totalStock = getTotalStock(product);

            return (

              <tr
                key={product._id}
                className="border-t hover:bg-gray-50"
              >

                {/* IMAGE */}
                <td className="p-4">

                  <img
                    src={image || "/placeholder.png"}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded"
                  />

                </td>

                {/* TITLE */}
                <td className="p-4 font-medium">
                  {product.title}
                </td>

                {/* CATEGORY */}
                <td className="p-4">
                  {product.category?.name || "Uncategorized"}
                </td>

                {/* VARIANTS */}
                <td className="p-4">
                  {product.variants?.length || 0}
                </td>

                {/* ✅ TOTAL STOCK */}
                <td className="p-4">
                  {totalStock}
                </td>

                {/* ACTIONS */}
                <td className="p-4 flex gap-2">

                  <button
                    onClick={() => navigate(`/edit-product/${product._id}`)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            );

          })}

        </tbody>

      </table>

    </div>

  );
}