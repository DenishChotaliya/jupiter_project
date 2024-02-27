import Navbar from "@/components/Navebar";
import Sidebaar from "@/components/sidebaar";
import React from "react";
import { useSelector } from "react-redux";

function admin() {
  const { isAuth} = useSelector((state: any) => state.auth);

  return (
    <>
      <Navbar />

      {isAuth && (
        <>
          {/* <Loder /> */}
          <Sidebaar />
        </>
      ) }
    </>
  );
}

export default admin;
