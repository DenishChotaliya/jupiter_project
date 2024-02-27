import axios from "axios";
import { Avatar } from "evergreen-ui";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import InfiniteScroll from "react-infinite-scroller";
import { HashLoader } from "react-spinners";

function Nfinitescroller() {
  const [list, setList]: any = useState([]);
  const router = useRouter();
  const api = "https://jupiter.cmdev.cc";
  const [{ accessToken }]: any = useCookies(["accessToken"]);

  const patientsList = () => {
    return list?.list?.map((item: any) => (
      <>
        <div key={item?.id} className="truncate w-full">
          <div
            className="flex items-center"
            onClick={() => {
              router.push({
                pathname: `/patients`, // Specify the pathname of the page
                query: { d: item?.id }, // Specify your query parameters
              });
            }}
          >
            <Avatar name={`${item?.firstName} ${item?.lastName}`} size={40} />

            <span className="ml-2">
              {item?.firstName} {item?.lastName}
            </span>
          </div>
        </div>
      </>
    ));
  };
  const nfinitescroller = async (n: any) => {
    console.log("Ravi");
    const payload = {
      Authorization: `Bearer ${accessToken?.accessToken}`,
    };
    const res = await axios.get(`${api}/admin/patient-user`, {
      headers: payload,
      params: { skip: n * 15, take: 15 },
    });
    setList({
      list: [...list?.list, ...res?.data?.list],
      count: list?.count + res?.data?.count,
      hasMany: res?.data?.hasMany,
      total: res?.data?.total,
    });
  };
//   useEffect(() => {
//     if (accessToken?.accessToken) {
//       patientsdata();
//     }
//   }, []);
  return (
    <>
      <div className="w-[20%] border-4  ">
        <InfiniteScroll
          pageStart={0}
          loadMore={nfinitescroller}
          hasMore={list.hasMany}
          threshold={50}
          loader={
            <div className="loader flex justify-center" key={0}>
              <HashLoader color="#363ad6" size={25} />
            </div>
          }
        >
          <div> {patientsList()}</div>
        </InfiniteScroll>
      </div>
    </>
  );
}

export default Nfinitescroller;
