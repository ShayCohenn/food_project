import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Layout from "components/Layout";
import UserSearchResult from "components/UserSearchResult";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { searchUsersAsync } from "redux/features/async_functions/userAsyncSlice";
import { useAppDispatch } from "redux/store";

const UserSearchPage = () => {
  const dispatch = useAppDispatch();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(searchUsersAsync(""));
  }, [dispatch]);

  const handleSearch = async () => {
    setIsLoading(true);
    await dispatch(searchUsersAsync(input));
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the Enter key was pressed (key code 13)
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Layout title="Search Users" content="search users">
      <div className="mt-28 w-full flex flex-col items-center">
        <div className="border border-base-content w-10/12 max-w-[1000px] flex rounded-full h-12 items-center">
          <MagnifyingGlassIcon className="w-6 h-6 ml-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            placeholder={`Search Users here`}
            className="bg-transparent w-full h-full rounded-r-full text-xl pl-3 outline-none"
            onKeyPress={handleKeyPress}
          />
          {input && (
            <FaTimes
              onClick={() => setInput("")}
              className="h-4 w-4 text-rose-800/80 mr-4"
            />
          )}
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`${
              isLoading ? "opacity-50" : ""
            } hover:bg-base-300 xs:text-sm w-2/6 max-w-[90px] h-full rounded-r-full border-l border-base-content bg-base-200 text-xl`}>
            search
          </button>
        </div>

        {isLoading ? (
          <span className="loading loading-spinner loading-lg mt-10"></span>
        ) : (
          <UserSearchResult />
        )}
      </div>
    </Layout>
  );
};

export default UserSearchPage;
