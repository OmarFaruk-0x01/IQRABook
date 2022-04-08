import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {GetAllDownBooks} from '../../Constants/Actions';

const fetchAllDownBooks = createAsyncThunk(
  'downBooks/fetchAll',
  async thunkAPI => {
    const books = await GetAllDownBooks();
    if (books.ok && books.data) {
      return books.data;
    } else {
      return [];
    }
  },
);

const downloadedSlice = createSlice({
  name: 'downloadedSlice',
  initialState: {
    loading: false,
    downBooks: [],
    errors: null,
  },
  reducers: {
    loadUpdateDownBooks: (state, action) => {
      state.downBooks = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchAllDownBooks.fulfilled, (state, action) => {
      state.downBooks = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllDownBooks.rejected, (state, action) => {
      state.errors = action.error;
      state.loading = false;
    });
    builder.addCase(fetchAllDownBooks.pending, (state, action) => {
      state.loading = true;
    });
  },
});

export {fetchAllDownBooks};
export const {loadUpdateDownBooks} = downloadedSlice.actions;
export default downloadedSlice.reducer;
