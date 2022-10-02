import { useEffect, useState, React, useContext } from "react";
import NavSide from "../components/NavSide";
import "../styles/globals.css";
import "antd/dist/antd.css";
// import  {AppState}  from "components/app-state";
import Cookies from "js-Cookie";
import axios from "../libs/axios";
import useSwr from "swr";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../src/theme";
import App from "next/app";
import Interceptors from "../components/Interceptors";

function MyApp({ Component, pageProps }) {
  const [accessToken, setAccessToken] = useState();

  useEffect(async () => {
    axios
      .get("/auth/get-cookie")
      .then(function (response) {
        setAccessToken(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  // const appState = useContext(accessToken);
  // console.log(accessToken);
  const fetcher = (url) => axios.get(url).then((response) => response.data);

  const { data, error } = useSwr("/auth/get-cookie", fetcher, {
    refreshInterval: 1000,
  });

  return (
    <>
      {data?.data == undefined ? (
        <Component {...pageProps} />
      ) : (
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          {/* <Interceptors> */}
          <CssBaseline />
          <NavSide>
            <Component {...pageProps} />
          </NavSide>
          {/* </Interceptors> */}
        </ThemeProvider>
      )}
      {/* 
{data?.data == undefined ? (
        <Component {...pageProps} />
      ) : (
        <NavSide>
          <Component {...pageProps} />
        </NavSide>
      )} */}
      {/* {accessToken ? (
        <NavSide>
          <Component {...pageProps} />
        </NavSide>
      ) : (
        <Component {...pageProps} />
      )} */}
    </>
  );
}

// MyApp.getInitialProps = async (appContext) => {
//   const { pageProps } = await App.getInitialProps(appContext);
//   const { ctx } = appContext;
//   return { pageProps };
// };

export default MyApp;
