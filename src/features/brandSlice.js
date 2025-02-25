import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
};

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    unsetBrands: (state) => {
      state.brands = [];
    },
  },
});
export const { setBrands, unsetBrands } = brandSlice.actions;
export default brandSlice.reducer;
