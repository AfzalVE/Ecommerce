import { Link } from "react-router-dom";

export default function CategoryList({ categories }) {

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-12">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Categories</h2>

        <Link
          to="/admin/categories"
          className="text-indigo-600 font-medium"
        >
          Manage Categories
        </Link>
      </div>

      <table className="w-full">

        <thead className="border-b">
          <tr className="text-left">
            <th className="p-3">Name</th>
            <th>Description</th>
            <th className="text-right p-3">Actions</th>
          </tr>
        </thead>

        <tbody>

          {categories.map((cat) => (
            <tr key={cat._id} className="border-b">

              <td className="p-3 font-medium">
                {cat.name}
              </td>

              <td>
                {cat.description || "-"}
              </td>

              <td className="text-right p-3">

                <Link
                  to="/admin/categories"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </Link>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}