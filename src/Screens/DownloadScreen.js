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
import RNFS from 'react-native-fs';
import {fetchAllDownBooks} from '../Redux/Slices/downloadedSlice';
const DownloadScreen = () => {
  const dispatch = useDispatch();
  const {downBooks, loading, errors} = useSelector(
    state => state.downloadBooks,
  );

  useEffect(() => {
    dispatch(fetchAllDownBooks());
  }, []);
  // console.log(downBooks);
  function renderBooks() {
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = () => {
      dispatch(fetchAllDownBooks());
    };

    if (loading) {
      return <BookList isLoading={true} />;
    } else if (downBooks?.length > 0) {
      return (
        <BookList
          refreshing={refreshing}
          onRefresh={onRefresh}
          Books={downBooks}
        />
      );
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
      <AppHeader title={Texts.downloadScreen} />
      {renderBooks()}
    </View>
  );
};

export default DownloadScreen;
