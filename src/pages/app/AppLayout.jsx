import { AppFooter, AppTopnav } from "@/components";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { setCurrentUser, unsetCurrentUser } from "@/features/currentUserSlice";
import customFetch from "@/utils/customFetch";
import showError from "@/utils/showError";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { slug } = useParams();
  const { currentUser } = useSelector((store) => store.currentUser);
  const userSlug = currentUser?.user_details?.slug;

  const unauthenticated = () => {
    showError(`You are not authenticated! Please sign in.`);
    dispatch(unsetCurrentUser());
    localStorage.removeItem(import.meta.env.VITE_TOKEN_NAME);
    navigate(`/sign-in`);
  };

  const unauthorized = () => {
    showError(`You are not authorized to access this page.`);
    navigate(`/forbidden`);
  };

  const invalidurl = () => {
    if (userSlug && slug !== userSlug) {
      showError(`Invalid URL! Please sign again.`);
      dispatch(unsetCurrentUser());
      localStorage.removeItem(import.meta.env.VITE_TOKEN_NAME);
      navigate(`/sign-in`);
    }
    return true;
  };

  useEffect(() => {
    window.addEventListener("unauthenticated", unauthenticated);
    window.addEventListener("unauthorized", unauthorized);
    invalidurl();
  }, [pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <AppTopnav />
        <Outlet />
        <AppFooter />
      </main>
    </SidebarProvider>
  );
};
export default AppLayout;

// --------------------------------------------

export const loader = (store) => async () => {
  const { currentUser } = store.getState().currentUser;

  try {
    if (!currentUser.name) {
      const response = await customFetch.get(`/auth/me`);
      if (response.status === 200) {
        store.dispatch(setCurrentUser(response.data.data));
      }
    }
    return null;
  } catch (error) {
    console.log(error?.response?.data);
    showError(`Something went wrong! Please try again later.`);
    localStorage.removeItem(import.meta.env.VITE_TOKEN_NAME);
    return redirect(`/sign-in`);
  }
};
