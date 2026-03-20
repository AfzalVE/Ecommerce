import { useState } from "react";
import { useCreateReviewMutation } from "../../../modules/reviews/reviewApi";

export default function AddReview({ productId }){

 const [rating,setRating] = useState(5);
 const [comment,setComment] = useState("");

 const [createReview] = useCreateReviewMutation();

 const submit = async()=>{

  await createReview({
   productId,
   rating,
   comment
  });

  setComment("");
          
 };

 return(

  <div className="space-y-4">

   <h3 className="text-2xl font-semibold">
    Write a Review
   </h3>

   <select
    value={rating}
    onChange={e=>setRating(e.target.value)}
    className="border p-2 rounded"
   >

    {[1,2,3,4,5].map(n=>(
     <option key={n}>{n}</option>
    ))}

   </select>

   <textarea
    value={comment}
    onChange={e=>setComment(e.target.value)}
    className="border w-full p-3 rounded"
    placeholder="Share your experience"
   />

   <button
    onClick={submit}
    className="bg-indigo-600 text-white px-6 py-2 rounded"
   >
    Submit Review
   </button>

  </div>

 );
}