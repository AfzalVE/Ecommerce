import { useState } from "react";
import PageContainer from "../../components/layout/PageContainer";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from "./categoryApi";

export default function AddEditCategory() {

  const { data } = useGetCategoriesQuery();

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.categories || [];

  const [name,setName] = useState("");
  const [description,setDescription] = useState("");

  const [editing,setEditing] = useState(null);

  /* SUBMIT */

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      if(editing){

        await updateCategory({
          id: editing,
          name,
          description
        }).unwrap();

      }else{

        await createCategory({
          name,
          description
        }).unwrap();

      }

      setName("");
      setDescription("");
      setEditing(null);

    }catch(err){

      console.error(err);

    }

  };

  /* EDIT */

  const handleEdit = (cat)=>{

    setEditing(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");

  };

  /* DELETE */

  const handleDelete = async(id)=>{

    if(!confirm("Delete category?")) return;

    try{

      await deleteCategory(id).unwrap();

    }catch(err){

      console.error(err);

    }

  };

  return(

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
            onChange={(e)=>setName(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="border rounded-lg p-3 w-full"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />

          <Button type="submit">

            {editing ? "Update Category" : "Add Category"}

          </Button>

        </form>

        {/* CATEGORY TABLE */}

        <div className="bg-white shadow rounded-xl">

          <table className="w-full">

            <thead className="border-b">

              <tr className="text-left">

                <th className="p-4">Name</th>
                <th>Description</th>
                <th className="text-right p-4">Actions</th>

              </tr>

            </thead>

            <tbody>

              {categories.map((cat)=>(

                <tr
                  key={cat._id}
                  className="border-b"
                >

                  <td className="p-4">
                    {cat.name}
                  </td>

                  <td>
                    {cat.description}
                  </td>

                  <td className="text-right p-4 space-x-2">

                    <Button
                      type="button"
                      onClick={()=>handleEdit(cat)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      className="bg-red-500"
                      onClick={()=>handleDelete(cat._id)}
                    >
                      Delete
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