import store from "@/store";
import { useSelector } from "react-redux";

const AppAdminDashboard = () => {
  const { currentUser } = useSelector((store) => store.currentUser);

  document.title = `${currentUser?.name}'s Dashboard | ${
    import.meta.env.VITE_APP_NAME
  }`;

  return <div>AppAdminDashboard</div>;
};
export default AppAdminDashboard;
