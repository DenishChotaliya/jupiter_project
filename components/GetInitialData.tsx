import { setInitialData, setLoading } from "@/lib/Reducers/AuthSlice";
import axios from "axios";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";

const GetInitialData = () => {
  const api = `https://jupiter.cmdev.cc`;

  const dispatch = useDispatch();

  const [{ accessToken }]: any = useCookies(["accessToken"]);

  const initialData = async () => {
    try {
      // console.log("Hello");
      const payload = {
        Authorization: `Bearer ${accessToken?.accessToken}`,
       
      };
      // console.log(payload);

      // const login = await axios.get(`${api}/admin/auth/who-am-i`, {
      //   headers: payload,

      // });
      const login = await axios.get(`${api}/admin/auth/who-am-i`, {
        headers: payload,
      });
      // const login2 = await axios.get(`${api}/manager/dashboard`, {
      //   headers: payload,

      dispatch(setInitialData(login.data));
      // console.log(login, "Venue@123");
      // }
    } catch (error) {
      // console.log(error);
    } finally {
      dispatch(setLoading(false));
      // console.log("Denish");
    }
  };
  // useEffect(() => {
  // if (accessToken?.session?.accessToken) {
  //     initialData();
  //   // } else {
  //   //   dispatch(setLoading(false));
  //   // }
  // });
  useEffect(() => {
    if (accessToken?.accessToken) {
      initialData();
    }
  }, []);
  return null;
};
export default GetInitialData;
