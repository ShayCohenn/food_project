// User Menu - the profile picture top right and the dropdown list

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  MenuHandler,
  MenuList,
  Dialog,
  Button,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  LifebuoyIcon,
  PowerIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useJwt } from "react-jwt";
import { profile_pic_placeholder } from "config/index";
import { useSelector } from "react-redux";
import {
  a_token,
  logout,
  user,
} from "redux/features/slices/userSlice";
import {
  getUserDataAsync,
} from "redux/features/async_functions/userAsyncSlice";
import { useAppDispatch } from "redux/store";

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const access_token = useSelector(a_token) || "";
  const expired_access_token = useJwt(access_token).isExpired;
  const current_user = useSelector(user);
  const username = current_user.username;
  const profile_pic = current_user.my_profile_pic;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutMessage, setLogoutMessage] = useState(false);

  const handleLogout = () => {
    setLogoutMessage(false);
    dispatch(logout());
    navigate("/login");
  };

  useEffect(()=>{
    if(expired_access_token) handleLogout()
  },[expired_access_token])

  useEffect(() => {
    if(username && current_user.isOwner)  dispatch(getUserDataAsync(username));
  }, [username]);

  return (
    <div>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <button className="flex items-center gap-1 bg-transparent py-0.5 pr-2 pl-0.5 ml-auto">
            <div className="avatar">
              <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={
                    expired_access_token ? profile_pic_placeholder : profile_pic
                  }
                  alt=""
                />
              </div>
            </div>
          </button>
        </MenuHandler>
        <MenuList className="p-1 font-semibold">
          {expired_access_token ? (
            <div className="border-none outline-none">
              <Link to={"/login"} className="navar-user-menuItem">
                <ArrowRightOnRectangleIcon className="navbar-user-menuIconSize" />
                Sign in
              </Link>
              <Link to={"/register"} className="navar-user-menuItem">
                <UserCircleIcon className="navbar-user-menuIconSize" />
                Register
              </Link>
              <Link to={"/"} className="navar-user-menuItem">
                <LifebuoyIcon className="navbar-user-menuIconSize" />
                Help
              </Link>
            </div>
          ) : (
            <div className="border-none outline-none">
              <Link to={`/profile/${username}`} className="navar-user-menuItem">
                <UserCircleIcon className="navbar-user-menuIconSize " />
                My Profile
              </Link>
              <Link to={"/edit"} className="navar-user-menuItem">
                <Cog6ToothIcon className="navbar-user-menuIconSize" />
                Edit Profile
              </Link>
              <Link to={"/"} className="navar-user-menuItem">
                <LifebuoyIcon className="navbar-user-menuIconSize" />
                Help
              </Link>
              <button
                onClick={() => setLogoutMessage(true)}
                className="w-full text-red-500 navar-user-menuItem">
                <PowerIcon className="navbar-user-menuIconSize" />
                Logout
              </button>
            </div>
          )}
        </MenuList>
      </Menu>
      <Dialog
        className="w-5/12 rounded-3xl bg-base-300 text-base-content border border-base-content"
        open={logoutMessage}
        handler={setLogoutMessage}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.1, y: -200 },
        }}>
        <DialogHeader>Logout</DialogHeader>
        <DialogBody divider>
          The key to more success is to have a lot of pillows. Put it this way,
          it took me twenty five years to get these plants, twenty five years of
          blood sweat and tears, and I&apos;m never giving up, I&apos;m just
          getting started. I&apos;m up to something. Fan luv.
          <br />
          You sure you want to leave?
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setLogoutMessage(false)}
            className="mr-1">
            <span>Cancel</span>
          </Button>
          <Button variant="text" color="green" onClick={handleLogout}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};
export default UserMenu;
