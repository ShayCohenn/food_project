import { Link } from "react-router-dom";
import Switcher from "Darkmode";
import { Bars3Icon } from "@heroicons/react/24/solid";

import UserMenu from "./UserMenu";

const MyNavbar = () => {
  return (
    <div className="navbar text-base-content bg-base-100">
      <div className="flex items-center text-4xl font-extrabold text-base-content">
        <label htmlFor="my-drawer" className="drawer-button">
          <Bars3Icon className="h-10 mx-2 cursor-pointer hover:bg-base-200" />
        </label>
        <Link to={"/"}>LOGO</Link>
      </div>
      <div className="flex items-center mr-3">
        <Switcher />
        <UserMenu />
      </div>
      
    </div>
  );
};
export default MyNavbar;
