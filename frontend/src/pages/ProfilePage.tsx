import { Button, Typography } from "@material-tailwind/react";
import Layout from "components/Layout";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  checkUserExistsAsync,
  followUserAsync,
} from "redux/features/async_functions/userAsyncSlice";
import { isUserExists, user } from "redux/features/slices/userSlice";
import { useAppDispatch } from "redux/store";
import NotFoundPage from "./NotFoundPage";
import FollowersModal from "components/FollowersModal";
import ProfileRecipes from "components/ProfileRecipes";
import ReactPaginate from "react-paginate";
import ProfilePageSkeleton from "../components/skeletons/ProfilePageSkeleton";

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [open, setOpen] = useState(false);
  const [pageLoader, setPageLoader] = useState(true);
  const userExists = useSelector(isUserExists);
  const current_user = useSelector(user);
  const usernameFromRedux = current_user.username;
  const profile_pic = current_user.profile_pic;
  const total_followers = current_user.total_followers;
  const total_following = current_user.total_following;
  const followers = current_user.followers;
  const following = current_user.following;
  const total_recipes = current_user.total_recipes;
  const isFollowing = current_user.isFollowing;
  const isOwner = current_user.isOwner;

  useEffect(() => {
    setPageLoader(true);
    if (username) {
      dispatch(checkUserExistsAsync(username))
        .then(() => {
          setPageLoader(false); // Mark loading as complete when data is fetched
        })
        .catch(() => {
          setPageLoader(false); // Handle errors and mark loading as complete
        });
    }
  }, [username, dispatch]);

  if (userExists === "no") {
    return <NotFoundPage />;
  }

  if (pageLoader) {
    return <ProfilePageSkeleton />;
  }

  const handleFollow = async () => {
    setIsLoading(true);
    if (usernameFromRedux && username) {
      try {
        await dispatch(
          followUserAsync({
            follower: usernameFromRedux,
            following: username,
            isFollowing: isFollowing,
          })
        );
        // Update isFollowing state based on the action's success
      } catch (error) {
        // Handle any error here
      }
      dispatch(checkUserExistsAsync(username));
    }
    setIsLoading(false);
  };
  return (
    <Layout title={`SITE | ${username}'s profile`} content="user profile">
      <div className="flex flex-col">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="shadow-md rounded-lg overflow-hidden">
            {/* User Information */}
            <div className="p-4">
              <div className="flex items-center space-x-4">
                {/* Profile Picture */}
                <div className="avatar">
                  <div className="w-36 rounded-full">
                    <img src={profile_pic} alt="" />
                  </div>
                </div>
                {/* User Information */}
                <div>
                  <div className="flex">
                    <h1 className="text-2xl font-semibold">{username}</h1>
                  </div>
                  <div className="profile-info-row">
                    <div>
                      <span>Recipes:</span>
                      <span className="mr-2 ml-1">{total_recipes}</span>
                    </div>
                    <button
                      onClick={() => {
                        setOpen(!open);
                        setShowFollowers(true);
                      }}>
                      Followers:
                      <span className="mr-4 ml-1">{total_followers}</span>
                    </button>
                    <button
                      onClick={() => {
                        setOpen(!open);
                        setShowFollowers(false);
                      }}>
                      Following:
                      <span className="mr-4 ml-1">{total_following}</span>
                    </button>
                  </div>
                  {isOwner ? (
                    <Link to="/edit">
                      <Button className="text-sm px-4 py-3 rounded-md mx-auto border border-base-content bg-base-300 text-base-content">
                        Edit profile
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      onClick={handleFollow}
                      className={`text-sm px-4 py-3 text-white rounded-md mx-auto ${
                        isFollowing ? "bg-red-500" : "bg-blue-500"
                      }
                      ${isLoading ? "opacity-40 cursor-wait" : ""}`}>
                      {isFollowing ? "Unfollow" : "Follow"}
                      {isLoading ? "ing..." : ""}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${
          open ? "fixed " : "hidden"
        } z-50 transition-opacity duration-800`}>
        <div className=" bg-black opacity-50"></div>
        <FollowersModal
          handleClose={() => setOpen(!open)}
          users={showFollowers ? followers : following}
          title={showFollowers ? "Followers" : "Following"}
        />
      </div>

      <Typography variant="h3" className="ml-5">
        {username}'s recipes:
      </Typography>
      <div className="flex w-screen flex-wrap user-recipes">
        <ProfileRecipes />
      </div>
    </Layout>
  );
};

export default ProfilePage;
