import Navbar from "@/components/Navebar";
// import { Inter } from "next/font/google";
import React from "react";
import { useRouter } from "next/router";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  CardHeader,
  Avatar,
  CardBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import Sidebaar from "@/components/sidebaar";

// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { isAuth, loginuser ,isLoading} = useSelector((state: any) => state.auth);
  // console.log(loginuser.generalTicket);

  return (
    <>
      {/* <h1 className="bg-red-600 text-white text-center ">Hello bro</h1> */}
      <Navbar />

     
        <h1 className="text-center">Home Page</h1>
      
    </>
  );
}
{
  /* <div>
<button
  type="button"
  className="block mb-0 ml-5 bg-transparent text-red-800 text-sm font-semibold rounded-lg hover:bg-red-800 hover:text-white  focus:outline-none focus:shadow-outline focus:bg-red-800 focus:text-white hover:shadow-xs p-3 my-4 border border-red-800 hover:border-transparent dark:hover:bg-red-600 dark:border-red-600 dark:text-red-600 dark:focus:bg-red-600 dark:focus:text-gray-100 dark:hover:text-gray-100"
  onClick={() => {
    router.push(`/admin/venue`);
  }}
>
  User Add
</button>
</div> */
}
