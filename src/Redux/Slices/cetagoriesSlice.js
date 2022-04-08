import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {GetCetagories} from '../../Constants/Fetcher';
import Texts from '../../Constants/Texts';

const fetchAllCetagories = createAsyncThunk('ceta/fetchAll', async thunkAPI => {
  const cetaResp = await GetCetagories();
  return cetaResp;
});

const cetagoriesSlice = createSlice({
  name: 'cetagoriesSlice',
  initialState: {
    loading: false,
    cetagories: false,
    errors: null,
    activeCetagory: Texts.allBookCeta,
  },
  reducers: {
    setActiveCeta: (state, action) => {
      state.activeCetagory = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAllCetagories.fulfilled, (state, action) => {
      state.cetagories = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllCetagories.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchAllCetagories.rejected, (state, action) => {
      state.errors = action.error;
      state.loading = false;
    });
  },
});

export {fetchAllCetagories};
export const {setActiveCeta} = cetagoriesSlice.actions;
export default cetagoriesSlice.reducer;
