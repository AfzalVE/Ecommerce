import { useState } from "react";
import {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation
} from "../../../modules/reviews/reviewApi";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Trash2, Star } from "lucide-react";

export default function ReviewSection({ productId }) {

  const navigate = useNavigate();
  const location = useLocation();

  const { data } = useGetReviewsQuery(productId);
  const [createReview] = useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.reviews || [];

  // ✅ FIX: Get user from Redux (cookie-based auth)
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {

    if (!isAuthenticated) {
      toast.error("Please login first");

      navigate("/login", {
        state: { from: location.pathname }
      });

      return;
    }

    if (!comment.trim()) {
      return toast.error("Write something...");
    }

    try {

      await createReview({
        productId,
        rating,
        comment
      }).unwrap();

      toast.success("Review added 🎉");
      setComment("");

    } catch {
      toast.error("Failed to add review");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="mt-16">

      <h2 className="text-2xl font-bold mb-6">
        Ratings & Reviews
      </h2>

      {/* REVIEW INPUT */}
      <div className="bg-white border rounded-xl p-4 shadow-sm mb-8">

        <div className="flex items-center gap-2 mb-3">
          {[1,2,3,4,5].map((n) => (
            <Star
              key={n}
              onClick={() => setRating(n)}
              className={`cursor-pointer ${
                rating >= n ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
              }`}
            />
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={
            isAuthenticated
              ? "Write your review..."
              : "Login to write a review..."
          }
          className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleSubmit}
          className="mt-3 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Submit Review
        </button>

      </div>

      {/* REVIEW LIST */}
      <div className="space-y-4">

        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet</p>
        )}

        {reviews.map((r) => (

          <div
            key={r._id}
            className="bg-white border rounded-xl p-4 shadow-sm flex justify-between"
          >

            <div>

              <p className="font-semibold">
                {r.user?.name}
              </p>

              <p className="text-yellow-500 text-sm">
                ⭐ {r.rating}
              </p>

              <p className="text-gray-600 mt-1">
                {r.comment}
              </p>

            </div>

            {/* ✅ Delete only if owner */}
            {isAuthenticated && user?._id === r.user?._id && (
              <button
                onClick={() => handleDelete(r._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            )}

          </div>

        ))}

      </div>

    </div>
  );
}