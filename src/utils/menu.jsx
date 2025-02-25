import { Building2, Gauge, Layers, Settings, Users } from "lucide-react";
import { useSelector } from "react-redux";

function allMenus() {
  const { currentUser } = useSelector((store) => store.currentUser);
  const slug = currentUser?.user_details?.slug;
  const role = currentUser?.role;

  const data = {
    navSuperAdmin: [
      { title: "Dashboard", url: `/admin/${slug}/dashboard`, icon: Gauge },
      {
        title: "Product Settings",
        url: "#",
        icon: Settings,
        children: [
          {
            title: "Brands",
            url: `/admin/${slug}/products/brands`,
          },
          {
            title: "Categories",
            url: `/admin/${slug}/products/categories`,
          },
        ],
      },
      {
        title: "Products",
        url: "#",
        icon: Layers,
        children: [
          {
            title: "Products",
            url: `/admin/${slug}/products`,
          },
          {
            title: "Promotions / Discounts",
            url: `/admin/${slug}/products/discounts`,
          },
          {
            title: "Bought Together",
            url: `/admin/${slug}/products/bought-together`,
          },
        ],
      },
      { title: "Customers", url: `/admin/${slug}/companies`, icon: Building2 },
      { title: "Orders", url: `/admin/${slug}/companies`, icon: Building2 },
      {
        title: "Reports",
        url: `#`,
        icon: Users,
        children: [
          {
            title: "Customers",
            url: `/admin/${slug}/users/super-admin`,
          },
          {
            title: "Users (Client)",
            url: `/admin/${slug}/users/client`,
          },
        ],
      },
    ],
    navCustomer: [],
  };

  let menu = [];

  if (role === "super admin" || role === "admin") {
    menu = data.navSuperAdmin;
  } else if (role === "customer") {
    menu = data.navCustomer;
  }

  return menu;
}
export default allMenus;
