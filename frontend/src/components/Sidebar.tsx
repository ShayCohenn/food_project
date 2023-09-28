import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

const Sidebar = () => {
  return (
    <div className="drawer z-50">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{/* Page content here */}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <div className="rounded-none border-b-2 border-base-content flex items-center text-4xl font-extrabold text-base-content">
              <label htmlFor="my-drawer" className="drawer-button">
                <Bars3Icon className="h-10 mx-2" />
              </label>
              <Link to={"/"}>LOGO</Link>
            </div>
          </li>
          <li>
            <Link to={"/search/recipes"} className="text-xl py-3">
              <MagnifyingGlassIcon className="text-base-content h-5 w-5 ml-1 mt-1" />
              Search Recipes
            </Link>
          </li>
          <li>
            <Link to={"/search/users"} className="text-xl py-3">
              <MagnifyingGlassIcon className="text-base-content h-5 w-5 ml-1 mt-1" />
              Search Users
            </Link>
          </li>
          <li>
            <Link to={"/new/recipe"} className="text-xl py-3">
              <AiOutlinePlus className="text-base-content h-5 w-5 ml-1 mt-1" />
              Create Recipe
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
