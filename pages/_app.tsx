import GetInitialData from "@/components/GetInitialData";
import { store } from "@/lib/Store";
// import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className=" mx-auto">
      <Provider store={store}>
        <SessionProvider session={pageProps.session}>
          <GetInitialData />
          <Component {...pageProps} />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              style: {
                borderRadius: "10px",
                border: "#EDF2F7 1px solid",
                background: "#000000",
                color: "#ffffff",
              },
            }}
          />
        </SessionProvider>
      </Provider>
    </div>
  );
}
