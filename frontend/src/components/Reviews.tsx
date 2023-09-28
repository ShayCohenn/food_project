import { Rating } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createCommentAsync,
  createRatingAsync,
} from "redux/features/async_functions/recipesAsync";
import { selected_recipe } from "redux/features/slices/recipeSlice";
import { user } from "redux/features/slices/userSlice";
import { useAppDispatch } from "redux/store";

const Reviews = () => {
  const dispatch = useAppDispatch();
  const ratings = useSelector(selected_recipe)[0].ratings;
  const username = useSelector(user).username;
  const comments = useSelector(selected_recipe)[0].comments;
  const uuid = useSelector(selected_recipe)[0].uuid;
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rated, setRated] = useState(false);
  const [showToast, setShowToast] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    ratings.forEach((rate) => {
      if (rate.user?.username === username) {
        setUserRating(parseInt(rate.rating));
        setRated(true);
      }
    });
  }, [ratings]);

  const showToastWithTimeout = (message: string, type: string) => {
    const alertClassName = type === "success" ? "alert-success" : "alert-error";
    setShowToast(alertClassName);
    setToastMsg(message);

    setTimeout(() => {
      setShowToast("");
    }, 5000);

    setIsLoading(false);
  };

  const handleRating = async (rating: number) => {
    if (rating >= 1 && rating <= 5) {
      // Valid rating value
      setUserRating(rating);
      await dispatch(createRatingAsync({ id: uuid, rating: rating }));
      showToastWithTimeout("Rated successfuly", "success");
    } else {
      // Handle invalid rating (e.g., display an error message)
      console.error("Invalid rating value. Rating must be between 1 and 5.");
      // You can also set an error state or display a message to the user.
    }
  };

  const handlePost = async () => {
    setIsLoading(true);
    try {
      // Dispatch the API call
      const response = await dispatch(
        createCommentAsync({ id: uuid, comment: userComment })
      );
      // Check if the API call was successful
      if (createCommentAsync.fulfilled.match(response)) {
        // Show success message if it was successful
        showToastWithTimeout("Review submitted successfully", "success");
      } else {
        // Show an error message if it failed
        showToastWithTimeout("Failed to submit review", "error");
      }
    } catch (error) {
      // Handle any errors from the API call
      console.error("API error:", error);
      showToastWithTimeout("An error occurred", "error");
    }
  };
  const ratingKey = userRating.toString();
  return (
    <div className=" p-4 rounded-lg shadow-md mt-8">
      {showToast && (
        <div className="toast">
          <div className={`alert ${showToast}`}>
            <span className="font-bold">{toastMsg}</span>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
      <div className="max-h-[800px] overflow-y-scroll">
        {comments &&
          comments.map((comment, index) => (
            <div key={index} className="border-2 border-base-content/20 p-4">
              {" "}
              {/* Add a unique key */}
              <div className="flex items-center mb-4">
                <img
                  src={comment.user && comment.user.profile_pic}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-medium">
                    {comment.user && comment.user.username}
                  </h3>
                  <p className="text-gray-500">
                    {comment.rating === "Didn't rate" ? comment.rating : "Rated:" + comment.rating + "/5"}
                    {comment.was_edited && " (was edited)"}
                  </p>
                </div>
              </div>
              <p style={{ overflowWrap: "break-word" }} className="mb-4">
                {comment.comment}
              </p>
              <p className="text-gray-500">
                release date: {comment.formatted_date}
              </p>
            </div>
          ))}
      </div>

      {/* User Review Section */}
      <div className="mt-8 border-t-2 border-base-content pt-4">
        <h3 className="text-xl font-semibold mb-2">Write a Review</h3>
        <div className="mb-4">
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Your Rating
          </label>

          <Rating
            unratedColor="yellow"
            ratedColor="yellow"
            key={ratingKey}
            value={userRating ? userRating : 0} // Set the value based on userRating state
            onChange={(rating) => handleRating(rating)} // Call handleRatingChange when rating changes
          />
        </div>
        <div className="mb-4">
          <label className="text-gray-600 text-sm font-medium mb-1">
            Your Comment
          </label>
          <textarea
            className="border bg-base-100 rounded-md w-full h-20 py-2 px-3 placeholder:opacity-50"
            placeholder="Write your comment here..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}></textarea>
        </div>
        <div className="mb-4">
          <button
            onClick={handlePost}
            disabled={isLoading}
            className={`${
              isLoading ? "opacity-50 cursor-wait" : "hover:bg-primary/80"
            } bg-primary flex items-end text-white py-2 px-4 rounded-md`}
            type="submit">
            {isLoading ? "submitting" : "Submit Comment"}
            {isLoading && (
              <span className="loading loading-dots loading-xs"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
