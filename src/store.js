import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "@/features/currentUserSlice";
import commonReducer from "@/features/commonSlice";
import brandReducer from "@/features/brandSlice";
import categoryReducer from "@/features/categorySlice";

const store = configureStore({
  reducer: {
    common: commonReducer,
    currentUser: currentUserReducer,
    brands: brandReducer,
    categories: categoryReducer,
  },
});
export default store;
