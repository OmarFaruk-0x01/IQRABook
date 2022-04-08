// import {Txt} from 'native-base';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppHeader from '../Components/AppHeader';
import BookList from '../Components/BookList';
import CetagoryList from '../Components/CetagoryList';
import Texts from '../Constants/Texts';
import {fetchAllBooks} from '../Redux/Slices/booksSlices';
import {fatchAllFavouriteBooks} from '../Redux/Slices/favouriteBooksSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchAllDownBooks} from '../Redux/Slices/downloadedSlice';
import {Box} from 'native-base';

const HomeScreen = () => {
  const [avaiableBooks, setAvailableBooks] = useState([]);
  const {books, loading, errors} = useSelector(state => state.eBooks);
  const fvBooks = useSelector(state => state.favouriteBooks.fvBooks);
  const activeCetagory = useSelector(state => state.eBooksCeta.activeCetagory);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fatchAllFavouriteBooks());
    dispatch(fetchAllDownBooks());
  }, []);

  useEffect(() => {
    if (activeCetagory !== Texts.allBookCeta) {
      setAvailableBooks(books?.filter(book => book[5] == activeCetagory));
    } else {
      setAvailableBooks(books);
    }
  }, [activeCetagory, books, fvBooks]);

  const onRefresh = () => {
    dispatch(fetchAllBooks());
    dispatch(fatchAllFavouriteBooks());
    dispatch(fetchAllDownBooks());
  };
  return (
    <Box flex={1} bg={'white'}>
      <AppHeader title={Texts.homeScreenHeader} />
      <CetagoryList />
      <BookList
        refreshing={refreshing}
        onRefresh={onRefresh}
        Books={avaiableBooks}
        extraData={fvBooks}
        isLoading={loading}
      />
    </Box>
  );
};

export default HomeScreen;
