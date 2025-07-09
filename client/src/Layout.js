import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { LoadingContext } from "./LoadingContext";
import FullScreenLoader from "./components/FullScreenLoader";

export default function Layout() {
  const { loading } = useContext(LoadingContext);

  return (
    <>
      {loading && <FullScreenLoader />}
      <main>
        <Header />
        <Outlet />
      </main>
    </>
  );
}
