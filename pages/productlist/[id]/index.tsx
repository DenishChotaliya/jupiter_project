import Navbar from "@/components/Navebar";
import Sidebaar from "@/components/sidebaar";
import Loder2 from "@/pages/loder2";
import { PresentationChartBarIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function index({ itemId }: any) {
  console.log(itemId);
  const router = useRouter();
  const [{ accessToken }]: any = useCookies(["accessToken"]);
  const [data, SetData]: any = useState();
  const [detailLoder, setDetailLoder] = useState(true);

  const back = () => {
    router.push(`/productlist`);
  };
  const getData = async () => {
    const api = "https://jupiter.cmdev.cc";

    const payload = {
      Authorization: `Bearer ${accessToken?.accessToken}`,
    };
    const res = await axios.get(`${api}/admin/product/${itemId}`, {
      headers: payload,
    });
    const data = await res.data;
    SetData(data);
    setDetailLoder(false)
  };
  useEffect(() => {
    getData();
    // toast.remove();'[]
  },[]);
  return (
    <>
      <Navbar />

      <div className="flex">
       <div className="w-[20%]">
       <Sidebaar />
       </div>
        {detailLoder ? (
          <Loder2 />
        ) : (
          <>
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4">
                  <div className="flex">
                    <div className="mb-4 font-bold  ">id:- </div>
                    <span>{data?.id}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold ">Price:-</div>
                    <span>{data?.price}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold inline">MonthPrice:-</div>
                    <span>{data?.monthPrice}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold">Dosage:-</div>
                    <span>{data?.dosage}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold inline">
                      ConditionLevel:-
                    </div>
                    <span>{data?.conditionLevel}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold ">DeliveryMonths:-</div>
                    <span>{data?.deliveryMonths}</span>
                  </div>
                  <div className="mb-4 font-bold">{data?.directions}</div>
                  <div className="flex">
                    <div className="mb-4 font-bold ">Condition:-</div>
                    <span>{data?.condition}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold inline">
                      SelectAvailability:-
                    </div>
                    <span>{data?.selectAvailability}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold inlne">ServiceId:-</div>
                    <span>{data?.serviceId}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold inline">UniqueId:-</div>
                    <span>{data?.uniqueId}</span>
                  </div>
                  <div className="flex">
                    <div className="mb-4 font-bold ">Quick-Code:-</div>
                    <span>{data?.quickCode}</span>
                  </div>
                  <div className="flex ">
                    <div className="mb-4 font-bold ">Description:-</div>
                    <span>{data?.description[0]}</span>
                  </div>
                </div>
                <div className="bg-gray-100 p-4">
                  <Image
                    src={data?.image[0]?.description}
                    alt="Denish"
                    className="w-full mb-4"
                    width={100}
                    height={100}
                  />
                  <div className="mb-4">
                    Name:- <span>{data?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-end">
        <Button placeholder={Button} onClick={back}>
          Back
        </Button>
      </div>
    </>
  );
}
export const getServerSideProps = async ({ params, req }: any) => {
  const itemId = params.id;

  console.log(itemId);

  return {
    props: {
      itemId,
    },
  };
  // } catch (error: any) {
  //   console.log(error?.response);
  //   return {
  //     props: {
  //       error,
  //     },
  //   };
  // }
};

export default index;
