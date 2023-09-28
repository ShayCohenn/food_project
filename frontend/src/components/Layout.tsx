import React, { ReactNode } from "react";
import { Helmet } from "react-helmet";
import MyNavbar from "./MyNavbar";
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  title: string;
  content: string;
}

const Layout = ({ children, title, content }: LayoutProps) => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={content} />
    </Helmet>
    <MyNavbar />
    <Sidebar/>
    <div>{children}</div>
  </>
);

export default Layout;