import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAllSavedPage, savePage} from '../../Constants/Actions';

const fetchAllSavedPages = createAsyncThunk(
  'savedPages/fetchAll',
  async thunkAPI => {
    const savedPageResp = await getAllSavedPage();
    return savedPageResp;
  },
);

const savePages = createAsyncThunk(
  'savedPages/add',
  async ({bookID, pageNO}, {dispatch}) => {
    const addResp = await savePage(bookID, pageNO);
    console.log(bookID, pageNO);
    dispatch(fetchAllSavedPages());
  },
);

const pagesaveSlice = createSlice({
  name: 'pagesaveSlice',
  initialState: {
    pages: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAllSavedPages.fulfilled, (state, action) => {
      state.pages = action.payload;
    });
  },
});
export {savePages, fetchAllSavedPages};
export default pagesaveSlice.reducer;
