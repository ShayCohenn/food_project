import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FollowUserType } from "redux/api/types";
import {
  followUserAsync,
  getUserDataAsync,
} from "redux/features/async_functions/userAsyncSlice";
import { user } from "redux/features/slices/userSlice";
import { useAppDispatch } from "redux/store";

// Displays a small user in the following modal

const MiniUser = ({
  mini_user,
  handleCloseModal,
}: {
  mini_user: FollowUserType;
  handleCloseModal: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const current_user = useSelector(user);
  const usernameFromRedux = current_user.username;
  const following = current_user.my_following;
  const isFollowing = following.some(
    (follower) => follower.username === mini_user.username
  );

  const handleLinkClick = () => {
    // Close the modal before navigating
    handleCloseModal();
  };
  const handleFollow = async () => {
    setIsLoading(true);
    if (usernameFromRedux && mini_user.username) {
      try {
        await dispatch(
          followUserAsync({
            follower: usernameFromRedux,
            following: mini_user.username,
            isFollowing: isFollowing,
          })
        );
        // Update isFollowing state based on the action's success
      } catch (error) {
        // Handle any error here
      }
      dispatch(getUserDataAsync(usernameFromRedux));
    }
    setIsLoading(false);
  };
  return (
    <div className="flex avatar justify-between items-center">
      <div className="w-16 rounded-full m-2">
        <img src={mini_user.profile_pic} alt="profile"/>
      </div>
      <Link
        to={`/profile/${mini_user.username}`}
        onClick={handleLinkClick}
        className="user-modal-text">
        {mini_user.username}
      </Link>
      {usernameFromRedux === mini_user.username ? (
        <Link to={`/edit`} className="mx-auto">
          <Button
            onClick={handleLinkClick}
            className="text-sm rounded-lg border border-base-content bg-base-300 text-base-content">
            Edit Profile
          </Button>
        </Link>
      ) : (
        <Button
          onClick={handleFollow}
          className={`text-sm mx-auto text-white rounded-lg ${
            isFollowing ? "bg-red-500" : "bg-blue-500"
          } ${isLoading ? "opacity-40 cursor-wait" : ""}`}>
          {isFollowing ? "Unfollow" : "Follow"}
          {isLoading ? "ing..." : ""}
        </Button>
      )}
    </div>
  );
};

export default MiniUser;
