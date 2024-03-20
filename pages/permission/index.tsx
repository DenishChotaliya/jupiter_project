import Navbar from "@/components/Navebar";
import Sidebaar from "@/components/sidebaar";
import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useCookies } from "react-cookie";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import PermissionSkeleton from "@/components/PermissionSkeleton";
import { BsDashCircle, BsEye } from "react-icons/bs";
import { DateTime } from "luxon";
import { RxCross2 } from "react-icons/rx";
import debounce from "lodash.debounce";
import PatientDetailsmodal from "@/components/PatientDetailsmodal";
import Viewpermission from "@/components/Viewpermission";
import Editpermission from "@/components/Editpermission";

const index = () => {
  const [{ accessToken }]: any = useCookies(["accessToken"]);
  const api = "https://jupiter.cmdev.cc";
  const [list, setList]: any = useState([]);
  const [loader, setLoader] = useState<Boolean>(true);

  const permissiondata = async () => {
    // dispatch(setLoading(true));

    try {
      const payload = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      const res = await axios.get(`${api}/admin-permission-group`, {
        headers: payload,
        params: {
          skip: 0,
          take: 10,
          include: "updatedBy",
          // orderBy: ["createdAt"],
        },
      });
      // console.log(res.data);
      setList(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
      // dispatch(setLoading(false));
      // console.log("Denish");
    }
  };
  useEffect(() => {
    if (accessToken?.accessToken) {
      permissiondata();
    }
  }, []);
  // console.log(list);
  const listtable = () => {
    return list?.list?.map((item: any) => (
      <div
        key={item?.id}
        className="bg-white border-b border-black  flex justify-stretch text-center  dark:bg-gray-800  w-full"
      >
        <div className="px-3 pt-3 pb-2 items-center font-medium  whitespace-nowrap dark:text-white w-[15%]">
          {item?.role}
        </div>
        <div className="px-3 pt-3 pb-2  w-[25%] ">{item.name}</div>
        <div className="px-3 pt-3 pb-2   w-[15%] ">
          {item?.updatedBy?.firstName || "-"} {item?.updatedBy?.lastName || "-"}
        </div>
        <div className="px-3  pt-3 pb-2  w-[20%] ">
          {" "}
          {DateTime.fromISO(item.updatedAt).toFormat("f")}
        </div>
        <div
          className={`${
            item.status === "ENABLED" ? "text-green-600" : "text-red-400"
          } px-3 py-3  w-[15%]`}
        >
          {item.status === "ENABLED" ? "ACTIVE" : "DE-ACTIVE"}
        </div>
        <div className="pt-3 pb-2  text-center  w-[10%]">
          <div className="flex  justify-center ">
            <div>
              <Viewpermission id={item} />
            </div>
            <div>
              <Editpermission id={item} />
            </div>
            <div>
              <BsDashCircle size={20} />
            </div>
          </div>
        </div>
      </div>
    ));
  };
  // const handleaddpermissionSearchInput = async (e: any) => {
  //   try {
  //     const payload = {
  //       Authorization: `Bearer ${accessToken?.accessToken}`,
  //     };
  //     const res = await axios.get(`${api}/admin-permission-group`, {
  //       headers: payload,
  //       params: {
  //         take: 10,
  //         skip: 0,
  //         orderBy: "createdAt|desc",
  //         include: "updatedBy",
  //         search: e,
  //         search_column: ["name"],
  //       },
  //     });
  //     setList(res.data);
  //     console.log(res.data);
  //   } catch (error: any) {
  //     console.log(error);
  //     // setLoader(false);
  //   }
  // };
  const handleSearchInput = async (e: any) => {
    // console.log(e);

    try {
      const payload = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      const res = await axios.get(`${api}/admin-permission-group`, {
        headers: payload,
        params: {
          take: 10,
          skip: 0,
          orderBy: "createdAt|desc",
          include: "updatedBy",
          search: e,
          search_column: ["name"],
        },
      });
      setList(res.data);
      // console.log(res.data);
    } catch (error: any) {
      console.log(error);
      // setLoader(false);
    }
  };
  const nfinitescroller = async (n: any) => {
    // dispatch(setLoading(true));
    try {
      const payload = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      const res = await axios.get(`${api}/admin-permission-group`, {
        headers: payload,
        params: { skip: n * 10, take: 10 },
      });
      setList({
        list: [...list?.list, ...res?.data?.list],
        count: list?.count + res?.data?.count,
        hasMany: res?.data?.hasMany,
        total: res?.data?.total,
      });
    } catch (error) {
      console.log(error);
    } finally {
      // dispatch(setLoading(false));
      console.log("Denish");
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex w-full overflow-y-hidden">
        <div className="w-[16%]">
          <Sidebaar />
        </div>

        <div className="m-3 w-full flex-auto items-center relative">
          <div className="flex ">
            <div>
              <div className="text-2xl text-blue-800 font-bold">
                Permission Management
              </div>
              <div className="mt-1">
                Assign roles and permissions to users to perform particular
                system functions.
              </div>
            </div>
            <div className="right-0 flex-auto text-end">
              <PatientDetailsmodal />
            </div>
          </div>
          <div className="relative w-full bg-gray-50 rounded-lg mt-2">
            <input
              type="text"
              placeholder="Search..."
              className={
                "bg-transparent focus:border-purple-600 z-20 !pl-8 !pr-8 border-black border w-full outline-none text-gray-900 sm:text-sm rounded-lg block p-1 dark:bg-gray-700  dark:placeholder-gray-400 dark:text-white"
              }
              onChange={debounce((e) => {
                <>
                  {loader ? (
                    <PermissionSkeleton rows={10} />
                  ) : (
                    handleSearchInput(e.target.value)
                  )}
                </>;
              }, 1000)}
            />
            <div className="absolute top-1.5  left-2.5 text-gray-500">
              <FiSearch />
            </div>
            <div
              className="absolute top-2 z-30 cursor-pointer right-2.5 text-gray-500"
              onClick={() => {}}
            >
              <RxCross2 />
            </div>{" "}
                    
          </div>
          <div className="relative  border border-black rounded-lg ">
            <div className=" w-full   text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <div className="  text-xs    uppercase  ">
                <div className="  border-b border-black flex justify-stretch ">
                  <div className="px-6 py-3  text-center font-bold w-[15%] ">
                    Role Name
                  </div>
                  <div className="px-6 py-3 text-center w-[25%] font-bold">
                    Permission Name
                  </div>
                  <div className="px-3 py-3 text-center w-[15%] font-bold">
                    Updated By
                  </div>
                  <div className="px-3 py-3 w-[20%] text-center font-bold">
                    Updated Date
                  </div>
                  <div className="px-3 py-3 w-[15%] text-center font-bold">
                    Status
                  </div>
                  <div className="px-2  py-3 w-[10%] text-center font-bold">
                    Actions
                  </div>
                </div>
              </div>
              <div className="rounded-lg h-[calc(100vh-272px)] overflow-auto denish">
                <InfiniteScroll
                  pageStart={0}
                  loadMore={nfinitescroller}
                  hasMore={list.hasMany}
                  useWindow={false}
                  threshold={20}
                  loader={
                    <div key={0}>
                      <PermissionSkeleton />
                    </div>
                  }
                >
                  <div>
                    {loader ? (
                      <PermissionSkeleton rows={10} />
                    ) : (
                      <>
                        {list?.list?.length === 0 ? (
                          <div className="text-center">Data not Found</div>
                        ) : (
                          listtable()
                        )}
                      </>
                    )}
                  </div>
                </InfiniteScroll>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
