import Navbar from "@/components/Navebar";
import Sidebaar from "@/components/sidebaar";
import { setLoading } from "@/lib/Reducers/AuthSlice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import Loder2 from "../loder2";
import { ListItem} from "@material-tailwind/react";
import InfiniteScroll from "react-infinite-scroller";
import { Avatar } from "evergreen-ui";
import { HashLoader } from "react-spinners";
import PatientsData from "@/components/PatientsData";
import { useRouter } from "next/router";

function index() {
  const [list, setList]: any = useState([]);
  const router = useRouter();
  const { isLoading } = useSelector((state: any) => state.auth);
  const api = "https://jupiter.cmdev.cc";
  const [{ accessToken }]: any = useCookies(["accessToken"]);
  const dispatch = useDispatch();

  const patientsdata = async () => {
    dispatch(setLoading(true));
    try {
      const payload = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      const res = await axios.get(`${api}/admin/patient-user`, {
        headers: payload,
        params: { skip: 0, take: 10 },
      });
      console.log(res.data);
      setList(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
      // console.log("Denish");
    }
  };
  const patientsList = () => {
    return list?.list?.map((item: any) => (
      <>
        <ListItem placeholder={ListItem} key={item?.id} className="truncate w-full">
          <div
            className="flex items-center"
            onClick={() => {
              router.push({
                query: { d: item?.id }, // Specify your query parameters
              });
            }}
          >
            <Avatar name={`${item?.firstName} ${item?.lastName}`} size={40} />
            <span className="ml-2">
              {item?.firstName} {item?.lastName}
            </span>
          </div>
        </ListItem>
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
      params: { skip: n * 10, take: 10 },
    });
    setList({
      list: [...list?.list, ...res?.data?.list],
      count: list?.count + res?.data?.count,
      hasMany: res?.data?.hasMany,
      total: res?.data?.total,
    });
  };

  useEffect(() => {
    if (accessToken?.accessToken) {
      patientsdata();
    }
  }, []);

  console.log(list);

  return (
    <>
      <Navbar />
      <div className="flex w-full">
        <div className="w-[15%]">
          <Sidebaar />
        </div>
        {isLoading ? (
          <Loder2 />
        ) : (
          <>
            <div className="w-[20%] border-4 h-[calc(100vh-79px)] bg-red-500 overflow-auto"  >
              <InfiniteScroll
                
                pageStart={0}
                loadMore={nfinitescroller}
                hasMore={list.hasMany}
                useWindow={false}
                threshold={10}
                loader={
                  <div className="loader flex justify-center" key={0}>
                    <HashLoader color="#363ad6" size={25} />
                  </div>
                }
              >
                <div> {patientsList()}</div>
              </InfiniteScroll>
            </div>
            <div className="w-[65%]">
              <PatientsData />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default index;
