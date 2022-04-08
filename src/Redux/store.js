import {configureStore} from '@reduxjs/toolkit';
import booksSlices from './Slices/booksSlices';
import cetagoriesSlice from './Slices/cetagoriesSlice';
import favouriteBooksSlice from './Slices/favouriteBooksSlice';
import downloadedSlice from './Slices/downloadedSlice';
import pagesaveSlice from './Slices/pagesaveSlice';

export default configureStore({
  reducer: {
    eBooks: booksSlices,
    eBooksCeta: cetagoriesSlice,
    favouriteBooks: favouriteBooksSlice,
    downloadBooks: downloadedSlice,
    savedPages: pagesaveSlice,
  },
});
