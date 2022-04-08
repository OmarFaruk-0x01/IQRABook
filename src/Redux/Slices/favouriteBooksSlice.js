import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  getFavouriteBooks,
  setFavouriteBook,
  removeFavouriteBook as removeFVBook,
} from '../../Constants/Actions';
const fatchAllFavouriteBooks = createAsyncThunk(
  'favouriteBooks/fetchAll',
  async thunkAPI => {
    try {
      const fvBooksResp = await getFavouriteBooks();

      if (fvBooksResp.ok) return fvBooksResp.data;
      else return [];
    } catch (err) {
      return err;
    }
  },
);
const addFavouriteBook = createAsyncThunk(
  'add/favouriteBook',
  async (bookInfo, thunkAPI) => {
    try {
      const fvBooksResp = await setFavouriteBook(bookInfo);
      thunkAPI.dispatch(fatchAllFavouriteBooks());
      if (fvBooksResp.ok) return fvBooksResp.data;
      else return [];
    } catch (err) {
      return err;
    }
  },
);
const removeFavouriteBook = createAsyncThunk(
  'remove/favouriteBook',
  async (bookId, thunkAPI) => {
    try {
      const fvBooksResp = await removeFVBook(bookId);
      thunkAPI.dispatch(fatchAllFavouriteBooks());
      if (fvBooksResp.ok) return fvBooksResp.data;
      else return [];
    } catch (err) {
      return err;
    }
  },
);

const favouriteBooksSlice = createSlice({
  name: 'favouriteBooksSlice',
  initialState: {
    loading: false,
    fvBooks: [],
    errors: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fatchAllFavouriteBooks.fulfilled, (state, action) => {
      state.fvBooks = action.payload;
      state.loading = false;
    });

    builder.addCase(fatchAllFavouriteBooks.pending, state => {
      state.loading = true;
    });

    builder.addCase(fatchAllFavouriteBooks.rejected, (state, action) => {
      state.loading = false;
      state.errors = action.error;
    });
    builder.addCase(addFavouriteBook.fulfilled, (state, action) => {
      state.fvBooks = action.payload;
      state.errors = action.error;
    });
    builder.addCase(removeFavouriteBook.fulfilled, (state, action) => {
      state.fvBooks = action.payload;
      state.errors = action.error;
    });
  },
});

export {fatchAllFavouriteBooks, addFavouriteBook, removeFavouriteBook};

export default favouriteBooksSlice.reducer;
