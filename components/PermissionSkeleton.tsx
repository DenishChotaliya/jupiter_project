import React from "react";
import Skeleton from "react-loading-skeleton";

const PermissionSkeleton = ({rows}: any) => {
 
  return (
    <>
      {Array.from(Array(rows || 2)).map((n, index) => (
        <div
          key={index}
          className="bg-white border-b flex justify-stretch text-center  dark:bg-gray-800 dark:border-gray-700 w-full"
        >
          <div className="px-3 py-1.5 items-center font-medium  whitespace-nowrap dark:text-white w-[15%]">
            <Skeleton height={30} />
          </div>
          <div className="px-3 py-1.5  w-[25%] ">
            <Skeleton height={30} />
          </div>
          <div className="px-3 py-1.5   w-[15%] ">
            <Skeleton height={30} />
          </div>
          <div className="px-3  py-1.5  w-[20%] ">
            <Skeleton height={30} />
          </div>
          <div className="px-3 py-1.5  w-[15%]">
            <Skeleton height={30} />
          </div>
          <div className="py-1.5 px-3   w-[10%]">
            <Skeleton height={30} />
          </div>
        </div>
      ))}
    </>
  );
};

export default PermissionSkeleton;
