import { useGetReviewsQuery, useDeleteReviewMutation } from "../../../modules/reviews/reviewApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

export default function ReviewSection({ productId }) {

  const navigate = useNavigate();

  const { data } = useGetReviewsQuery(productId);
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.reviews || [];

  const user = JSON.parse(localStorage.getItem("user"));

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleSubmitClick = () => {
    if (!user) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
  };

  return (
    <div>

      <h2 className="text-3xl font-bold mb-6">
        Customer Reviews
      </h2>

      {/* Example submit button */}
      <button
        onClick={handleSubmitClick}
        className="mb-6 bg-black text-white px-4 py-2 rounded"
      >
        Write Review
      </button>

      <div className="space-y-4">

        {reviews.map((r) => (

          <div
            key={r._id}
            className="border p-4 rounded-lg flex justify-between items-start"
          >

            <div>

              <p className="font-semibold">
                {r.user.name}
              </p>

              <p className="text-yellow-500">
                ⭐ {r.rating}
              </p>

              <p className="text-gray-600">
                {r.comment}
              </p>

            </div>

            {/* Show delete icon only if review belongs to user */}

            {user && user._id === r.user._id && (

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