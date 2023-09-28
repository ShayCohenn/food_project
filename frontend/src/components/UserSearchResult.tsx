import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { users } from "redux/features/slices/searchUserSlice";

// Result of the User Search Page

const UserSearchResult = () => {
  const searched_users = useSelector(users);
  
  return (
    <div>
      {searched_users.length > 0 && <div className="w-screen">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">Profile picture</th>
              <th>Name</th>
              <th>Recipe Count</th>
              <th>Followers</th>
            </tr>
          </thead>
          <tbody>
            {searched_users.map((user, index) => (
              <tr key={index}>
                <td>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="avatar">
                      <Link
                        to={`/profile/${user.username}`}
                        className="mask mask-squircle w-12 h-12">
                        <img
                          src={user.profile_pic}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </Link>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <Link
                      to={`/profile/${user.username}`}
                      className="font-bold text-lg hover:underline">
                      @{user.username}
                    </Link>
                    <div className="text-sm opacity-80">
                      {user.first_name} {user.last_name}
                    </div>
                  </div>
                </td>
                <td className="text-lg font-semibold">{user.recipe_count}</td>
                <td className="text-lg font-semibold">{user.follower_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}
    </div>
  );
};

export default UserSearchResult;
