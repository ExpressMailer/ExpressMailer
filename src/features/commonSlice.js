import { createSlice } from '@reduxjs/toolkit';

export const commonSlice = createSlice({
  name: 'common',
  initialState: {
    showSidebar: true,
  },
  reducers: {
    toggleSidebar: state => {
      state.showSidebar = !state.showSidebar;
    },
  },
});

export const { 
  toggleSidebar, 
} = commonSlice.actions;


export const selectShowSidebar = (state) => state.common.showSidebar;

export default commonSlice.reducer;
