import { useState } from "react";
import PageContainer from "../../../shared/components/layout/PageContainer";
import Input from "../../../shared/components/ui/Input";
import Button from "../../../shared/components/ui/Button";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from "./categoryApi";

export default function AddEditCategory() {

  const { data, isLoading } = useGetCategoriesQuery();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const categories = data?.categories || [];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState(null);

  /* RESET FORM */

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditing(null);
  };

  /* SUBMIT */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!name.trim()) return;

    try {

      if (editing) {

        await updateCategory({
          id: editing,
          name,
          description
        }).unwrap();

      } else {

        await createCategory({
          name,
          description
        }).unwrap();

      }

      resetForm();

    } catch (err) {

      console.error("Category error:", err);

    }

  };

  /* EDIT */

  const handleEdit = (cat) => {

    setEditing(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");

  };

  /* DELETE */

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (!confirmDelete) return;

    try {

      await deleteCategory(id).unwrap();

      // If deleted category was being edited
      if (editing === id) {
        resetForm();
      }

    } catch (err) {

      console.error("Delete failed:", err);

    }

  };

  if (isLoading) {
    return <p className="text-center py-10">Loading categories...</p>;
  }

  return (

    <PageContainer>

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Category Manager
        </h1>

        {/* ADD / EDIT FORM */}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-xl p-6 mb-8 space-y-4"
        >

          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="border rounded-lg p-3 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button type="submit">

            {editing ? "Update Category" : "Add Category"}

          </Button>

          {editing && (

            <Button
              type="button"
              className="ml-2 bg-gray-400"
              onClick={resetForm}
            >
              Cancel
            </Button>

          )}

        </form>

        {/* CATEGORY TABLE */}

        <div className="bg-white shadow rounded-xl overflow-hidden">

          <table className="w-full">

            <thead className="border-b bg-gray-50">

              <tr className="text-left">

                <th className="p-4">Name</th>
                <th>Description</th>
                <th className="text-right p-4">Actions</th>

              </tr>

            </thead>

            <tbody>

              {categories.length === 0 && (

                <tr>

                  <td
                    colSpan="3"
                    className="text-center py-6 text-gray-500"
                  >
                    No categories found
                  </td>

                </tr>

              )}

              {categories.map((cat) => (

                <tr
                  key={cat._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4 font-medium">
                    {cat.name}
                  </td>

                  <td>
                    {cat.description || "-"}
                  </td>

                  <td className="text-right p-4 space-x-2">

                    <Button
                      type="button"
                      onClick={() => handleEdit(cat)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleDelete(cat._id)}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </Button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </PageContainer>

  );

}