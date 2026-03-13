import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../../features/products/productApi";

export default function FeaturedProducts() {

  const { data, isLoading, isError } = useGetProductsQuery();

  const products = data?.products || [];

  if (isLoading) {
    return (
      <section className="py-16 text-center">
        <p className="text-lg">Loading products...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 text-center">
        <p className="text-red-500">Failed to load products</p>
      </section>
    );
  }

  return (

    <section className="bg-white py-16">

      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl font-bold mb-10">
          Featured Products
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {products.map((product) => {

            const firstVariant = product?.variants?.[0];
            const image = firstVariant?.images?.[0]?.url;

            return (

              <Link
                key={product._id}
                to={`/product/${product.slug}/${product._id}`}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition block"
              >

                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <img
                    src={
                      image
                        ? `http://localhost:5000${image}`
                        : "https://via.placeholder.com/400x300"
                    }
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-4">

                  <h3 className="font-semibold mb-2">
                    {product.title}
                  </h3>

                  <p className="text-indigo-600 font-bold">
                    ₹{firstVariant?.price || 0}
                  </p>

                </div>

              </Link>

            );

          })}

        </div>

      </div>

    </section>

  );

}