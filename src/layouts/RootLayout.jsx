import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { WaterlineRail } from "../components/common/Waterline";

export default function RootLayout() {
  return (
    <>
      <WaterlineRail />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Analytics />
    </>
  );
}
