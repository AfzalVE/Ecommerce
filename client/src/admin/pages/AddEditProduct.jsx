import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import PageContainer from "../../shared/components/layout/PageContainer";
import Input from "../../shared/components/ui/Input";
import Button from "../../shared/components/ui/Button";

import {
  useCreateProductMutation,
  useUpdateProductMutation
} from "../../modules/products/admin/productApi";
import { useGetProductByIdQuery } from "../../modules/products/productApi";

import { useGetCategoriesQuery } from "../../modules/categories/categoryApi";
import { API_URL } from "../../shared/utils/constants";

export default function AddEditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetProductByIdQuery(id, { skip: !id });
  const { data: categoryData } = useGetCategoriesQuery();

  const product = data?.product;
  const categories = categoryData?.categories || [];

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [variants, setVariants] = useState([]);

  /* ================= PREFILL ================= */

  useEffect(() => {
    if (product && id) {

      setTitle(product.title || "");
      setDescription(product.description || "");
      setCategory(product.category?._id || product.category || "");

      const formatted = (product.variants || []).map(v => {

        const existingImages = (v.images || []).map(img => ({
          url: img.url,
          preview: `${API_URL}${img.url}`,
          file: null
        }));

        return {
          ...v,
          images: [
            ...existingImages,
            { file: null, preview: "" } // ✅ always add upload slot
          ]
        };
      });

      setVariants(
        formatted.length
          ? formatted
          : [{
              color: "",
              size: "",
              sku: "",
              price: "",
              stock: "",
              images: [{ file: null, preview: "" }]
            }]
      );
    }
  }, [product, id]);

  /* ================= VARIANTS ================= */

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      {
        color: "",
        size: "",
        sku: "",
        price: "",
        stock: "",
        images: [{ file: null, preview: "" }]
      }
    ]);
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index][field] = value;

      const color = field === "color" ? value : updated[index].color;
      const size = field === "size" ? value : updated[index].size;

      updated[index].sku =
        `${title}-${color}-${size}`
          .replace(/\s+/g, "-")
          .toUpperCase();

      return updated;
    });
  };

  useEffect(() => {
    if (!variants.length) return;

    setVariants(prev =>
      prev.map(v => ({
        ...v,
        sku: `${title}-${v.color}-${v.size}`
          .replace(/\s+/g, "-")
          .toUpperCase()
      }))
    );
  }, [title]);

  /* ================= IMAGES ================= */

  const handleImageUpload = (variantIndex, imageIndex, file) => {
    if (!file) return;

    setVariants(prev => {
      const updated = [...prev];

      updated[variantIndex].images[imageIndex] = {
        file,
        preview: URL.createObjectURL(file)
      };

      const images = updated[variantIndex].images;

      // ✅ always keep one empty input at end
      if (images[images.length - 1]?.file) {
        images.push({ file: null, preview: "" });
      }

      return updated;
    });
  };

  const deleteImage = (variantIndex, imageIndex) => {
    setVariants(prev => {
      const updated = [...prev];

      updated[variantIndex].images.splice(imageIndex, 1);

      if (updated[variantIndex].images.length === 0) {
        updated[variantIndex].images.push({
          file: null,
          preview: ""
        });
      }

      return updated;
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    formData.append(
      "variants",
      JSON.stringify(
        variants.map(v => ({
          color: v.color,
          size: v.size,
          sku: v.sku,
          price: v.price,
          stock: v.stock
        }))
      )
    );

    variants.forEach((variant, i) => {
      variant.images.forEach(img => {
        if (img.file) {
          formData.append(`variantImages_${i}`, img.file);
        }
      });
    });

    try {
      if (id) {
        await updateProduct({ id, data: formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }

      toast.success(id ? "Product Updated" : "Product Created");
      navigate("/admin/dashboard");

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  if (id && isLoading) return null;

  /* ================= UI ================= */

  return (
    <PageContainer>

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          {id ? "Edit Product" : "Add Product"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 space-y-6"
        >

          {/* BASIC INFO */}

          <div className="grid md:grid-cols-2 gap-4">

            <Input
              label="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <div>
              <label className="block mb-1 font-medium">
                Category
              </label>

              <select
                className="border rounded-lg p-3 w-full"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>

                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <textarea
            placeholder="Description"
            className="border rounded-lg p-3 w-full"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          {/* VARIANTS */}

          <div>

            <h2 className="text-xl font-semibold mb-4">
              Variants
            </h2>

            {variants.map((variant, vIndex) => (

              <div
                key={vIndex}
                className="border rounded-lg p-4 mb-6 space-y-4"
              >

                <div className="grid md:grid-cols-5 gap-3">

                  <Input
                    label="Color"
                    value={variant.color}
                    onChange={e =>
                      updateVariant(vIndex, "color", e.target.value)
                    }
                  />

                  <Input
                    label="Size"
                    value={variant.size}
                    onChange={e =>
                      updateVariant(vIndex, "size", e.target.value)
                    }
                  />

                  <Input label="SKU" value={variant.sku} readOnly />

                  <Input
                    label="Price"
                    value={variant.price}
                    onChange={e =>
                      updateVariant(vIndex, "price", e.target.value)
                    }
                  />

                  <Input
                    label="Stock"
                    value={variant.stock}
                    onChange={e =>
                      updateVariant(vIndex, "stock", e.target.value)
                    }
                  />

                </div>

                {/* IMAGES */}

                <div>

                  <p className="font-medium mb-2">
                    Variant Images
                  </p>

                  {variant.images.map((img, imgIndex) => (

                    <div
                      key={imgIndex}
                      className="flex items-center gap-4 mb-3"
                    >

                      <input
                        type="file"
                        accept="image/*"
                        onChange={e =>
                          handleImageUpload(
                            vIndex,
                            imgIndex,
                            e.target.files?.[0]
                          )
                        }
                      />

                      {img.preview && (
                        <div className="relative">
                          <img
                            src={img.preview}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded border"
                          />

                          <button
                            type="button"
                            onClick={() => deleteImage(vIndex, imgIndex)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs"
                          >
                            X
                          </button>
                        </div>
                      )}

                    </div>

                  ))}

                </div>

                <Button
                  type="button"
                  onClick={() => removeVariant(vIndex)}
                  className="bg-red-500"
                >
                  Remove Variant
                </Button>

              </div>

            ))}

            <Button type="button" onClick={addVariant}>
              Add Variant
            </Button>

          </div>

          <Button type="submit" className="w-full">
            {id ? "Update Product" : "Save Product"}
          </Button>

        </form>

      </div>

    </PageContainer>
  );
}