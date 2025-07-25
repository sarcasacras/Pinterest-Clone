import "./MainLayout.css";
import Left from "../../components/Left/Left";
// import Right from '../../components/Right/Right'
import Top from "../../components/Top/Top";
import { Outlet } from "react-router";

function MainLayout() {
  return (
    <>
      <div className="container">
        <div className="navbar">
          <Left />
        </div>
        <div className="main">
          <Top />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default MainLayout;
