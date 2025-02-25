import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  parentCategories: [],
  childCategories: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    unsetCategories: (state) => {
      state.categories = [];
    },
    setParentCategories: (state, action) => {
      state.parentCategories = action.payload;
    },
    setChildCategories: (state, action) => {
      state.childCategories = action.payload;
    },
  },
});
export const {
  setCategories,
  unsetCategories,
  setParentCategories,
  setChildCategories,
} = categorySlice.actions;
export default categorySlice.reducer;
