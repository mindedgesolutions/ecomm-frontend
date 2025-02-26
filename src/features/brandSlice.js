import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  brands: [],
  allBrands: [],
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
    setAllBrands: (state, action) => {
      state.allBrands = action.payload;
    },
  },
});
export const { setBrands, unsetBrands, setAllBrands } = brandSlice.actions;
export default brandSlice.reducer;
