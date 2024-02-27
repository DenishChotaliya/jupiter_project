import Loder2 from "@/pages/loder2";
import axios from "axios";
import { Avatar } from "evergreen-ui";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Patients from "@/components/img/PatientImg.svg";
import Profile from "@/components/img/PatientProfile.svg";
import Image from "next/image";

function PatientsData() {
  // console.log(itemId)
  const router = useRouter();
  const { d } = router.query;
  console.log(d);

  const [{ accessToken }]: any = useCookies(["accessToken"]);
  const [data, SetData]: any = useState();
  const [detailLoder, setDetailLoder] = useState(true);

  const getData = async () => {
    setDetailLoder(true);
    console.log("api call");
    const api = "https://jupiter.cmdev.cc";
    try {
      const payload = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
      };
      const res = await axios.get(`${api}/admin/patient-user/${d}`, {
        headers: payload,
        params: {
          include: ["creditCard", "patientUserAddress"],
        },
      });
      const data = await res.data;
      SetData(data);

      console.log(res?.data);
    } catch (error: any) {
      console.log(error);
      router.push(router.pathname);
    } finally {
      setDetailLoder(false);
    }
  };

  useEffect(() => {
    if (d) {
      getData();
    }
  }, [d]);
  if (d) {
    return (
      <>
        <div className="flex w-full">
          {detailLoder ? (
            <Loder2 />
          ) : (
            <>
              <div className="w-full">
                <div className="flex items-center">
                  <Avatar
                    name={`${data?.firstName} ${data?.lastName}`}
                    size={40}
                  />

                  <span className="ml-2">
                    {data?.firstName} {data?.lastName}
                  </span>
                </div>

                <div className="flex">
                  <div className="mr-5">
                    <div>Basic Information</div>
                    <div className="border rounded-lg border-black flex">
                      <div>
                        <Avatar name={`${data?.firstName}`} size={40} />
                      </div>
                      <div>
                        <div className="pt-2 pl-3">
                          Name :- {`${data?.firstName} ${data?.lastName}`}
                        </div>
                        <div className=" pl-3">Gender :- {data?.gender}</div>
                        <div className=" pl-3">
                          Date of Birth :- {data?.dob}
                        </div>
                        <div className=" pl-3">Email :- {data?.email}</div>
                        <div className=" pl-3">
                          Phone :- {data?.phone || `-`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div>Addresses</div>
                    <div className="border rounded-lg border-black">
                      <div className="my-2 ml-4">
                        Shipping Address :-{" "}
                        {`${data?.patientUserAddress[0]?.addressLine1},${data?.patientUserAddress[0]?.city}, ${data?.patientUserAddress[0]?.province}, ${data?.patientUserAddress[0]?.postalCode}`}
                      </div>
                      <div className="my-2 ml-4">
                        Billing Address :-{" "}
                        {`${data?.patientUserAddress[1]?.addressLine1},${data?.patientUserAddress[1]?.city}, ${data?.patientUserAddress[1]?.province}, ${data?.patientUserAddress[1]?.postalCode}`}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" mt-8">
                  <div>Credit Cards</div>
                  <div className="flex border rounded-lg border-black">
                    {data?.creditCard?.map((item: any, index: number) => (
                      <div key={index} className="mx-3">
                        <span>{item?.cardType}</span>
                        <div>{item?.cardName}</div>
                        <div>Ending with {item?.cardNumber}</div>
                        <div>
                          Expires on: {`${item?.exp_month}/${item?.exp_year}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </>
    );
  } else {
    return (
      <div className=" w-full text-center">
        <h1 className="py-4">Hi Admin Admin,</h1>
        <div className="pb-6">
          Select A Client To View Client Profile Or Perform Any Action
        </div>
        <div className="flex justify-around">
          <Image src={Patients} alt="" width={200} height={50} />
          <Image src={Profile} alt="" width={400} height={50} />
        </div>
      </div>
    );
  }
}

export default PatientsData;
