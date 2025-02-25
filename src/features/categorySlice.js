import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  parentCategories: [],
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
  },
});
export const { setCategories, unsetCategories, setParentCategories } =
  categorySlice.actions;
export default categorySlice.reducer;
