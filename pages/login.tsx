import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import React, { cache, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import {
  getUsers,
  logIn,
  otpverify,
  setLoading,
} from "@/lib/Reducers/AuthSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import OtpInput from "react-otp-input";
import Loder from "./loder";
import { signIn, useSession } from "next-auth/react";

function Login() {
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const api = "https://jupiter.cmdev.cc";
  const [Cookie, setCookie]: any = useCookies(["auth"]);
  const session = useSession();
  console.log(session.data);

  // const [verifyLoder, setVerifyLoder] = useState(true)
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, loginuser } = useSelector((state: any) => state.auth);
  const [otpsender, setOtpsender] = useState<Boolean>(false);
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const googleLogin = () => {
    signIn("google");
  };
  const githubLogin = () => {
    signIn("github");
  };
  const submitData = async (inputData: any) => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${api}/admin/auth/login`, inputData);
      dispatch(logIn(res.data));
      console.log(res.data);
      setOtpsender(true);

      // console.log("first");
    } catch (errors: any) {
      throw errors.massage;
    } finally {
      dispatch(setLoading(false));
    }
  };
  // console.log(loginuser.otpRef);

  const verifyotp = async () => {
    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${api}/admin/auth/otp-verify`, {
        otp: otp,
        otpRef: loginuser.otpRef,
      });
      dispatch(otpverify(res.data));
      const payload = {
        accessToken: res?.data?.session?.accessToken,
      };
      setCookie("accessToken", payload);

      router.push(`/admin`);
      // setVerifyLoder(false)
      // dispatch(setLoading(true))
    } catch (error: any) {
      console.log(error.massage);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <>
      {isLoading ? (
        <Loder />
      ) : (
        <>
          {!otpsender ? (
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                  className="mx-auto h-10 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Sign in to your account
                </h2>
              </div>
              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                  onSubmit={handleSubmit(submitData)}
                  className="space-y-6"
                  action="#"
                  method="POST"
                >
                  <div>
                    <label
                      htmlFor="Email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        type="email"
                        autoComplete="name"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register("email", {
                          required: true,
                          pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
                        })}
                      />
                      {errors?.email?.type === "required" && (
                        <small className="text-red-500 pl-5">
                          This field is required
                        </small>
                      )}
                      {errors?.email?.type === "pattern" && (
                        <small className="text-red-500 pl-5">
                          This pattern is required
                        </small>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                    </div>
                    <div className="mt-2 relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...register("password", {
                          required: true,
                          pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/i,
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute  right-2 bottom-3 cursor-pointer"
                      >
                        {showPassword ? <BiShow /> : <BiHide />}
                      </button>
                      {errors?.Password?.type === "required" && (
                        <small className="text-red-500  pl-5">
                          This field is required
                        </small>
                      )}
                      {errors?.Password?.type === "pattern" && (
                        <small className="text-red-500 pl-5">
                          Please enter a valid password
                        </small>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
                {session?.data === null && (
                  <div className="text-center mt-4">
                    <button className="mr-16 text-3xl" onClick={googleLogin}>
                      <FcGoogle />
                    </button>
                    <button className="text-3xl" onClick={githubLogin}>
                      <FaGithub />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* {!verifyLoder ? (
                <Loder />
              ) : ( */}
              <div className="flex justify-center border border-black">
                <div>
                  <h1 className="text-3xl text-center font-extrabold">
                    Verify your account
                  </h1>
                  <p className="text-center text-lg mt-4">Enter 6-digit Code</p>
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={
                      <span className="mt-3 mx-2 items-center mb-5"> </span>
                    }
                    renderInput={(props) => <input {...props} />}
                    inputStyle={`!w-[2.5rem] h-10 border border-black outline-blue-600 flex gap-x-3 text-gray-900 rounded-lg`}
                  />
                  <div className="text-center">
                    <button
                      className="bg-blue-900 my-4 text-white pl-4 pr-4 pt-2 pb-2 "
                      onClick={verifyotp}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
              {/* )} */}
            </>
          )}
        </>
      )}
    </>
  );
}

export default Login;
