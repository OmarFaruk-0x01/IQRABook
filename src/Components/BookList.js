import React from 'react';
import {Box, FlatList} from 'native-base';
import BookItem from './BookItem';

const BookList = ({Books, extraData, isLoading, refreshing, onRefresh}) => {
  function renderItem({item, index}) {
    return (
      <BookItem
        info={item.info ? item.info : item}
        filepath={item?.pdfpath}
        thumb={item?.pdfThumb}
      />
    );
  }

  function renderPreloadItems() {
    return (
      <FlatList
        data={['', '', '', '', '', '']}
        numColumns={2}
        columnWrapperStyle={{margin: 2}}
        contentContainerStyle={{paddingHorizontal: 5}}
        renderItem={() => {
          return (
            <Box
              w={'47%'}
              m={1.5}
              borderRadius={10}
              style={{height: 300}}
              bg={'gray.100'}></Box>
          );
        }}
      />
    );
  }

  function renderBookList() {
    if (isLoading) {
      return renderPreloadItems();
    }
    return (
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={Books}
        extraData={extraData}
        keyExtractor={item => item[0]}
        numColumns={2}
        columnWrapperStyle={{margin: 0}}
        contentContainerStyle={{paddingHorizontal: 5}}
        renderItem={renderItem}
      />
    );
  }

  return <Box flex={1}>{renderBookList()}</Box>;
};

export default BookList;
