import { useGetProductsQuery } from "../../features/products/productApi";
import ProductCard from "../products/ProductCard";

export default function SimilarProducts({ category }){

 const { data } = useGetProductsQuery({
  category,
  limit:4
 });

 const products = data?.products || [];

 return(

  <div>

   <h2 className="text-3xl font-bold mb-6">
    Similar Products
   </h2>

   <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

    {products.map(p=>(
     <ProductCard key={p._id} product={p} />
    ))}

   </div>

  </div>

 );
}