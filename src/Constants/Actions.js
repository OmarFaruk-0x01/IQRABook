import {Toast} from 'native-base';
import {useStorage} from './Hooks';
import {DOWN_BOOKS_LIST, FAVOURITE_BOOKS_LIST, SAVED_PAGES} from './Keys';
import Texts from './Texts';
import RNFS from 'react-native-fs';
import path from 'path';

const BASEPATH = path.join(RNFS.ExternalDirectoryPath, 'ebooks');
const BASETHUMBPATH = path.join(RNFS.ExternalDirectoryPath, 'thumbs');
const isExists = async path => {
  // console.log('IsExsist:', path);
  return await RNFS.exists(path);
};

export const getFavouriteBooks = async () => {
  const {getItem} = useStorage();
  const booksList = await getItem(FAVOURITE_BOOKS_LIST);
  // console.log('BookList: ', booksList);
  if (booksList.ok && booksList.data) {
    return booksList;
  } else {
    return [];
  }
};

export const setFavouriteBook = async bookInfo => {
  const {setItem, getItem} = useStorage();
  const currentBookList = await getItem(FAVOURITE_BOOKS_LIST);
  // console.log('Current: ', currentBookList);
  if (currentBookList.ok) {
    const {data: books} = currentBookList;
    // console.log('fvBooks: ', books);
    const isBookHere = !!books
      ? books?.findIndex(book => book[0] === bookInfo[0])
      : -1;
    // console.log('isBook: ', isBookHere);
    if (isBookHere === -1) {
      const newBooks = !!books ? [...books, bookInfo] : [bookInfo];
      const taskResp = await setItem(FAVOURITE_BOOKS_LIST, newBooks);
      // console.log('task: ', taskResp);
      if (taskResp.ok) {
        return {ok: true, error: null, data: newBooks};
      } else {
        return {ok: false, error: taskResp.error, data: books};
      }
    } else {
      return {ok: false, error: Texts.alreadyBookFavourite, data: books};
    }
  } else {
    return {
      ok: false,
      error: currentBookList.error,
      data: currentBookList.data,
    };
  }
};

export const removeFavouriteBook = async bookId => {
  const {setItem, getItem} = useStorage();
  const currentBookList = await getItem(FAVOURITE_BOOKS_LIST);
  // console.log('Current: ', currentBookList);
  if (currentBookList.ok) {
    const {data: books} = currentBookList;
    const newBooks = books.filter(book => book[0] !== bookId);
    const taskResp = await setItem(FAVOURITE_BOOKS_LIST, newBooks);
    if (taskResp.ok) {
      return {ok: true, error: null, data: newBooks};
    } else {
      return {ok: false, error: taskResp.error, data: books};
    }
  } else {
    return {
      ok: false,
      error: currentBookList.error,
      data: currentBookList.data,
    };
  }
};

export const showToast = (message, duration = 1000) => {
  Toast.closeAll();
  Toast.show({
    title: message,
    duration,
    // bg: 'primary.200',
    color: 'black',
    _text: {
      fontSize: 18,
      color: 'black',
    },
  });
};

export const bookDownload = async (info, onProgress, onComplete, onError) => {
  if (!(await isExists(BASEPATH))) {
    RNFS.mkdir(BASEPATH);
  }
  if (!(await isExists(BASETHUMBPATH))) {
    RNFS.mkdir(BASETHUMBPATH);
  }
  const [
    id,
    book_name,
    book_url,
    book_size,
    book_thumbnail,
    book_cetagory,
    book_writer,
    book_translator,
    book_publication,
    disp,
  ] = info;
  const {setItem, getItem} = useStorage();
  const filePath = path.join(BASEPATH, `${id}.pdf`);
  const thumbPath = path.join(BASETHUMBPATH, `${id}.jpg`);
  const newObj = {
    id: info[0],
    pdfpath: filePath,
    pdfThumb: thumbPath,
    info,
  };
  RNFS.downloadFile({
    fromUrl: book_thumbnail,
    toFile: thumbPath,
  })
    .promise.then(() => {
      RNFS.downloadFile({
        fromUrl: book_url,
        toFile: filePath,
        progress: onProgress,
      })
        .promise.then(() => {
          onComplete(newObj);
          // console.log('Complete: ', info[1]);
        })
        .catch(err => {
          onError(err);
        });
    })
    .catch(err => {
      onError(err);
    });

  getItem(DOWN_BOOKS_LIST).then(({data, ok}) => {
    if (ok && !data) {
      setItem(DOWN_BOOKS_LIST, [newObj]);
    } else if (ok && data) {
      setItem(DOWN_BOOKS_LIST, [...data, newObj]);
    }
  });
};

export const GetAllDownBooks = async () => {
  const {getItem} = useStorage();
  return await getItem(DOWN_BOOKS_LIST);
};

export const removeDownBook = async bookID => {
  const {setItem} = useStorage();
  const downBooks = await GetAllDownBooks();
  if (downBooks.data) {
    const dbook = downBooks.data.find(item => item.id == bookID);
    if (!!dbook) {
      if (await isExists(dbook.pdfpath)) {
        await RNFS.unlink(dbook.pdfpath);
        await setItem(
          DOWN_BOOKS_LIST,
          downBooks.data.filter(item => item.id !== bookID),
        );
      } else {
        await setItem(
          DOWN_BOOKS_LIST,
          downBooks.data.filter(item => item.id !== bookID),
        );
      }
      if (await isExists(dbook.pdfThumb)) {
        await RNFS.unlink(dbook.pdfThumb);
        await setItem(
          DOWN_BOOKS_LIST,
          downBooks.data.filter(item => item.id !== bookID),
        );
      } else {
        await setItem(
          DOWN_BOOKS_LIST,
          downBooks.data.filter(item => item.id !== bookID),
        );
      }
    }
  }

  return downBooks.data.filter(item => item.id !== bookID);
};

export const getAllSavedPage = async () => {
  const {getItem} = useStorage();
  const pages = await getItem(SAVED_PAGES);
  if (pages.data) return pages.data;
  return [];
};

export const savePage = async (bookId, pageNumber) => {
  const {setItem} = useStorage();
  const savedPages = await getAllSavedPage();
  const books = savedPages.filter(item => item.id !== bookId);
  if (savedPages) {
    const book = savedPages.find(item => item.id == bookId);
    if (book) {
      const newBook = {...book, pageNO: pageNumber};
      books.push(newBook);
    } else {
      const newBook = {id: bookId, pageNO: pageNumber};
      books.push(newBook);
    }
    await setItem(SAVED_PAGES, books);
  } else {
    const newBook = {id: bookId, pageNO: pageNumber};
    await setItem(SAVED_PAGES, [newBook]);
  }
};
