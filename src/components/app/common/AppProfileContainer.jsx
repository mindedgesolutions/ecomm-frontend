import { Lock, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import avatar from "@/assets/images/000m.jpg";
import { Link, useNavigate } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import showSuccess from "@/utils/showSuccess";
import { useDispatch, useSelector } from "react-redux";
import { unsetCurrentUser } from "@/features/currentUserSlice";

const AppProfileContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((store) => store.currentUser);

  const logout = async () => {
    try {
      await customFetch.post("/auth/logout");

      showSuccess("Logged out successfully");
      localStorage.removeItem(import.meta.env.VITE_TOKEN_NAME);
      dispatch(unsetCurrentUser());
      navigate("/sign-in");
    } catch (error) {
      console.log(error?.response?.data?.errors);
      return;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-2 hidden md:block">
        <button type="button" variant="ghost" className="focus:outline-none">
          <img src={avatar} alt="user" className="w-8 h-8 rounded-full" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-1 w-48">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to={`/${currentUser?.user_detail?.slug}/settings`}>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link to={`/${currentUser?.user_detail?.slug}/change-password`}>
            <DropdownMenuItem className="cursor-pointer">
              <Lock className="mr-2 h-4 w-4" />
              <span>Change password</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default AppProfileContainer;
