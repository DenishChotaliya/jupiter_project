import { logOut } from "@/lib/Reducers/AuthSlice";
import {
  Collapse,
  Button,
  Card,
  CardBody,
} from "@material-tailwind/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Cookies, useCookies } from "react-cookie";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

function Navbar() {
  const router = useRouter();

  const { isAuth, loginuser } = useSelector((state: any) => state.auth);
  const [open, setOpen] = React.useState(false);

  const toggleOpen = () => setOpen((cur) => !cur);
  const dispatch = useDispatch();
  const cookies = new Cookies();
  const logout = () => {
    dispatch(logOut());
    toggleOpen();
    cookies.remove("accessToken");
    router.push(`/`);
  };
  // console.log(loginuser);

  return (
    <>
      <nav className="bg-blue-gray-600  dark:bg-gray-900 sticky w-full  top-0 start-0 border-b border-gray-200 dark:border-gray-600 z-30">
        <div className="max-w-screen-xl flex flex-wrap  justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse max-lg:ml-4"
          >
            <small className="self-center text-2xl font-semibold white space-nowrap text-black ">
              Jupiter
            </small>
          </Link>
          <div className=" md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse">
            <div className=" max-lg:mr-3 text-end">
              {!isAuth ? (
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onClick={() => {
                    router.push(`/login`);
                  }}
                >
                  Login
                </button>
              ) : (
                <div className="flex items-center">
                  <Button
                    className="text-white"
                    onClick={toggleOpen}
                    placeholder={Button}
                  >
                    <BsFillPersonLinesFill />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Collapse open={open} className="z-40 absolute top-20 pt-1 left-0">
        <Card className="my-4 mx-auto w-full " placeholder={Card}>
          <CardBody placeholder={CardBody}>
            <div>
              <div>
                <h1 className="flex justify-center font-bold text-2xl text-blue-800  dark:text-blue-500">
                  Profile
                </h1>
                <div className="bg-whit p-5 shadow-md rounded-md bg-gray-50 mt-5 dark:bg-gray-900">
                  <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 dark:text-gray-50">
                    <small className="text-green-500">
                      <svg
                        className="h-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </small>
                    <small className="tracking-wide">About</small>
                  </div>
                  <div className="mt-3">
                    <div className="grid sm:grid-cols-2 text-sm gap-1 dark:text-gray-100">
                      <div className="grid grid-cols-2">
                        <p className="px-4 py-2 font-semibold"> Email</p>
                        <p className="px-4 py-2 bg-gray-200 rounded-md truncate dark:bg-gray-700">
                          {loginuser?.user?.email}
                        </p>
                      </div>
                      <div className="grid grid-cols-2">
                        <p className="px-4 py-2 font-semibold">Contact No.</p>
                        <p className="px-4 py-2 bg-gray-200 rounded-md truncate dark:bg-gray-700">
                          {loginuser?.user?.phone || `-`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mr-5 mt-3">
                    <button
                      type="button"
                      className="block mb-0 bg-transparent text-red-800 text-sm font-semibold rounded-lg hover:bg-red-800 hover:text-white  focus:outline-none focus:shadow-outline focus:bg-red-800 focus:text-white hover:shadow-xs p-3 my-4 border border-red-800 hover:border-transparent dark:hover:bg-red-600 dark:border-red-600 dark:text-red-600 dark:focus:bg-red-600 dark:focus:text-gray-100 dark:hover:text-gray-100"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Collapse>
    </>
  );
}

export default Navbar;
