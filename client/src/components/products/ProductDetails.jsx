import { useState } from "react";
import toast from "react-hot-toast";
import { useAddToCartMutation } from "../../features/cart/cartApi";


export default function ProductDetails({ product }){

 const [variant,setVariant] = useState(product.variants[0]);
  const [addToCart] = useAddToCartMutation();


 return(

  <div className="space-y-6">

   <h1 className="text-4xl font-bold">
    {product.title}
   </h1>

   <p className="text-gray-600">
    {product.description}
   </p>

   <p className="text-2xl font-semibold">
    ₹ {variant.price}
   </p>

   {/* SIZE */}

   <div>

    <p className="font-semibold mb-2">Select Size</p>

    <div className="flex gap-3">

     {product.variants.map((v,i)=>(
      <button
       key={i}
       onClick={()=>setVariant(v)}
       className="border px-4 py-2 rounded-lg hover:bg-black hover:text-white transition"
      >
       {v.size}
      </button>
     ))}

    </div>

   </div>

   {/* COLOR */}

   <div>

    <p className="font-semibold mb-2">Color</p>

    <div className="flex gap-3">

     {product.variants.map((v,i)=>(
      <div
       key={i}
       onClick={()=>setVariant(v)}
       className="w-8 h-8 rounded-full border cursor-pointer"
       style={{ background: v.color }}
      />
     ))}

    </div>

   </div>

   {/* STOCK */}

   <p className="text-sm text-gray-500">

    {variant.stock > 0
     ? `${variant.stock} in stock`
     : "Out of stock"}

   </p>

   {/* ADD TO CART */}

   <button 
     className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
     onClick={() => {
       addToCart({ 
         productId: product._id, 
         variantId: variant._id, 
         quantity: 1 
       }).unwrap().then(() => {
         toast.success("Added to cart!");
       }).catch(() => {
         toast.error("Failed to add to cart");
       });
     }}
     disabled={variant.stock === 0}
   >
     {variant.stock === 0 ? "Out of Stock" : "Add To Cart"}
   </button>


  </div>

 );
}