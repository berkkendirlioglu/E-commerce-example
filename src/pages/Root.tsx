import { Outlet } from "react-router-dom";
import {Navbar, Footer} from './index.ts';

const Root = () => {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  );
};

export default Root;
