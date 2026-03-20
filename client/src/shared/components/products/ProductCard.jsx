import { Link } from "react-router-dom";
import { API_URL } from "../../utils/constants";

export default function ProductCard({ product }){

 const image = product.variants?.[0]?.images?.[0]?.url;

 return(

  <Link
   to={`/product/${product.slug}/${product._id}`}
   className="border rounded-lg p-3 hover:shadow-lg transition"
  >

   <img
    src={`${API_URL}${image}`}
    className="w-full h-48 object-cover rounded"
   />

   <p className="mt-2 font-semibold">
    {product.title}
   </p>

  </Link>

 );

}