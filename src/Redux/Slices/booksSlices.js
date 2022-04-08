import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {GetBooks} from '../../Constants/Fetcher';

const fetchAllBooks = createAsyncThunk('books/fetchAll', async thunkAPI => {
  const booksResp = await GetBooks();
  return booksResp;
});
const fetchAllBooksScilent = createAsyncThunk(
  'books/fetchAllScilently',
  async thunkAPI => {
    const booksResp = await GetBooks();
    return booksResp;
  },
);

const booksSlice = createSlice({
  name: 'booksSlice',
  initialState: {
    loading: false,
    books: [],
    errors: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllBooks.fulfilled, (state, action) => {
      state.books = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllBooksScilent.fulfilled, (state, action) => {
      state.books = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchAllBooks.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchAllBooks.rejected, (state, action) => {
      state.books = action.error;
      state.loading = false;
    });
  },
});

export {fetchAllBooks, fetchAllBooksScilent};

export default booksSlice.reducer;
