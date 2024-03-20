import {  setLoading } from "@/lib/Reducers/AuthSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HiViewList } from "react-icons/hi";
import InfiniteScroll from "react-infinite-scroller";

import {
  Button,
} from "@material-tailwind/react";
import Navbar from "@/components/Navebar";

import Link from "next/link";
import Loder2 from "../loder2";
import Sidebaar from "@/components/sidebaar";
import { HashLoader } from "react-spinners";

function productlist() {
  const [list, setList]: any = useState([]);
  const { isLoading } = useSelector((state: any) => state.auth);
  const api = "https://jupiter.cmdev.cc";
  const [{ accessToken }]: any = useCookies(["accessToken"]);

  const dispatch = useDispatch();
  const dashboarddata = async () => {
    dispatch(setLoading(true));
    try {
      const payload = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      const res = await axios.get(`${api}/admin/product`, {
        headers: payload,
        params: { skip: 0, take: 10 },
      });
      // console.log(res.data);
      setList(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(() => {
    if (accessToken?.accessToken) {
      dashboarddata();
    }
  }, []);
  const listtable = () => {
    return list?.list?.map((item: any) => (
      <div
        key={item?.id}
        className="bg-white border-b flex justify-stretch text-center  dark:bg-gray-800 dark:border-gray-700 w-full"
      >
        <div className="px-3 py-2 items-center font-medium text-gray-900 whitespace-nowrap dark:text-white w-[10%]">
          <img
            src={item.image[0]?.description}
            alt=""
            className=" object-contain w-full"
          />
        </div>
        <div className="px-3 py-4  w-[30%] truncate">{item.id}</div>
        <div className="px-3 py-4  w-[27%] truncate">{item.name}</div>
        <div className="px-3  py-4  w-[15%] truncate">{item.price}</div>
        <div className="px-3 py-4  w-[10%] truncate">{item.dosage}</div>
        <div className="py-2 items-center  w-[8%]">
          <Link href={`/productlist/${item.id}`}>
            <Button
              placeholder={Button}
              className="bg-white text-black text-xl border px-3"
            >
              <HiViewList />
            </Button>
          </Link>
        </div>
      </div>
    ));
  };
  const nfinitescroller = async (n: any) => {
    const payload = {
      Authorization: `Bearer ${accessToken?.accessToken}`,
    };
    const res = await axios.get(`${api}/admin/product`, {
      headers: payload,
      params: { skip: n * 10, take: 10 },
    });
    setList({
      list: [...list?.list, ...res?.data?.list],
      count: list?.count + res?.data?.count,
      hasMany: res?.data?.hasMany,
      total: res?.data?.total,
    });
  };

  return (
    <>
      <Navbar/>

      <div className="flex w-full ">
        <div className="w-[20%]">
          <Sidebaar />
        </div>
        {isLoading ? (
          <Loder2 />
        ) : (
          <>
            <div className="w-[80%]">
              <div className="relative  border ">
                <div className=" w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <div className="  text-xs   text-white  uppercase bg-blue-gray-400 ">
                    <div className="  flex justify-stretch ">
                      <div className="px-4 py-2 w-[10%] "></div>
                      <div className="px-6 py-3 text-center w-[30%]">Id</div>
                      <div className="px-3 py-3 text-center w-[27%]">Name</div>
                      <div className="px-3 py-3 w-[15%]">price</div>
                      <div className="px-3 py-3 w-[10%]">dosage</div>
                      <div className="px-2  py-3 w-[8%]">Actione</div>
                    </div>
                  </div>
                  <div>
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={nfinitescroller}
                      hasMore={list.hasMany}
                      loader={
                        <div className="loader flex justify-center" key={0}>
                          <HashLoader color="#363ad6" size={25} />
                        </div>
                      }
                    >
                      <div> {listtable()}</div>
                    </InfiniteScroll>
                  </div>
                </div>
              </div>
            </div>

            {/* <MDBTable classNameName="Project-table center">
              <MDBTableHead>
                <tr>
                  <td></td>
                  <td>ID</td>
                  <td>Name</td>
                  <td>price</td>
                  <td>Dosage</td>
                  <td>Actione</td>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={nfinitescroller}
                  hasMore={list.hasMany}
                  loader={
                    <div classNameName="loader" key={0}>
                      Loading ...
                    </div>
                  }
                >
                  <div> {listtable()}</div>
                </InfiniteScroll>
              </MDBTableBody>
            </MDBTable> */}
          </>
        )}
      </div>
    </>
  );
}

export default productlist;
