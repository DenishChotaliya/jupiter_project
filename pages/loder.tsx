import React from "react";
import { PacmanLoader } from "react-spinners";
// import { SyncLoader } from "react-spinners"

function Loder() {
  return (
    <div className="flex justify-center items-center h-screen ">
      <PacmanLoader color="#d63736" />
    </div>
    // <div className="fixed h-screen w-screen bg-[#f6f6f680] backdrop-blur-sm z-50">
    //   <div className="flex justify-center items-center h-screen z-50">
    //     <SyncLoader color="#000000" />
    //   </div>
    // </div>
  );
}
export default Loder;

//  center img
// hight:100vh
// display:grd
// placeitems:center
