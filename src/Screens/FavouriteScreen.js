import React, {useEffect, useState} from 'react';
import {Box, Text, View} from 'native-base';
import AppHeader from '../Components/AppHeader';
import BookList from '../Components/BookList';
import CetagoryList from '../Components/CetagoryList';
import Texts from '../Constants/Texts';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {fatchAllFavouriteBooks} from '../Redux/Slices/favouriteBooksSlice';
import {fetchAllBooksScilent} from '../Redux/Slices/booksSlices';

const FavouriteScreen = () => {
  const [avaiableBooks, setAvailableBooks] = useState([]);
  const dispatch = useDispatch();
  const {fvBooks, loading, errors} = useSelector(state => state.favouriteBooks);
  const isFoucsed = useIsFocused();
  const activeCetagory = useSelector(state => state.eBooksCeta.activeCetagory);
  useEffect(() => {
    const fvBooksFetch = dispatch(fatchAllFavouriteBooks());
    dispatch(fetchAllBooksScilent());
    return () => {
      fvBooksFetch.abort();
    };
  }, []);

  useEffect(() => {
    if (activeCetagory !== Texts.allBookCeta) {
      setAvailableBooks(fvBooks?.filter(book => book[5] == activeCetagory));
    } else {
      setAvailableBooks(fvBooks);
    }
  }, [activeCetagory, fvBooks]);

  function renderBooks() {
    if (loading) {
      return <BookList isLoading={true} />;
    } else if (avaiableBooks?.length > 0) {
      return <BookList Books={avaiableBooks} />;
    } else {
      return (
        <Box flex={1} alignItems={'center'} justifyContent={'center'}>
          <Text color={'gray.400'}>{Texts.emptyText}</Text>
        </Box>
      );
    }
  }
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <AppHeader title={Texts.favouriteScreenHeader} />
      <CetagoryList />
      {renderBooks()}
    </View>
  );
};

export default FavouriteScreen;
