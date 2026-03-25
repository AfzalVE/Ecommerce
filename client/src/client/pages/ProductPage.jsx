import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../modules/products/productApi";

import ProductGallery from "../../shared/components/products/ProductGallery";
import ProductDetails from "../../shared/components/products/ProductDetails";
import ReviewSection from "../../shared/components/products/ReviewSection";
import SimilarProducts from "../../shared/components/products/SimilarProducts";

export default function ProductPage(){

 const { id } = useParams();

 const { data, isLoading } = useGetProductByIdQuery(id);

 if(isLoading) return <p className="p-10">Loading...</p>;

 const product = data?.product;

 return(

  <div className="max-w-7xl mx-auto px-6 py-10 space-y-16">

   {/* PRODUCT SECTION */}

   <div className="grid md:grid-cols-2 gap-12">

    <ProductGallery variants={product.variants} />

    <ProductDetails product={product} />

   </div>

   {/* REVIEWS */}

   <ReviewSection productId={product._id} />



   {/* SIMILAR PRODUCTS */}

   <SimilarProducts category={product.category?._id} />

  </div>

 );

}