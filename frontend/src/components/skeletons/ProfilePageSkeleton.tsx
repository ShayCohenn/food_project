import { Button } from "@material-tailwind/react";
import Layout from "components/Layout";
import RecipeCardSkeleton from "./RecipeCardSkeleton";

const ProfilePageSkeleton = () => {
  return (
    <Layout title="Loading" content="user profile">
      <div className="flex flex-col">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="shadow-md rounded-lg overflow-hidden">
            {/* User Information */}
            <div className="p-4">
              <div className="flex items-center space-x-4">
                {/* Profile Picture */}
                <div className="avatar">
                  <div className="w-36 rounded-full bg-gray-600/70 animate-pulse"></div>
                </div>
                {/* User Information */}
                <div>
                  <div className="flex">
                    <h1 className="text-2xl font-semibold"></h1>
                  </div>
                  <div className="profile-info-row">
                    <div className="flex items-end">
                      <span>Recipes:</span>
                      <span className="mr-2 ml-1 loading loading-dots loading-xs"></span>
                    </div>
                    <div className="flex items-end">
                      Followers:
                      <span className="mr-4 ml-1 loading loading-dots loading-xs"></span>
                    </div>
                    <div className="flex items-end">
                      Following:
                      <span className="mr-4 ml-1 loading loading-dots loading-xs"></span>
                    </div>
                  </div>
                  <div className="btn animate-pulse w-28 text-sm px-4 py-3 rounded-md mx-auto bg-base-300 text-base-content">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-600/70 w-56 h-7 mt-4 ml-4 animate-pulse"></div>
        <div className="ml-4 flex flex-wrap">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePageSkeleton;
