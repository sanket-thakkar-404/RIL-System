import { Outlet } from "react-router";
import PublicHeader from "../../components/public/PublicHeader";

const PublicLayout = () => {
  return (
    <div>
      <PublicHeader/>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
