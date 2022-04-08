import React, {useEffect} from 'react';
import {Box, Button, Divider, FlatList} from 'native-base';
import {useDispatch} from 'react-redux';
import {
  fetchAllCetagories,
  setActiveCeta,
} from '../Redux/Slices/cetagoriesSlice';
import Texts from '../Constants/Texts';
import {useSelector} from 'react-redux';

const CetagoryList = ({}) => {
  const {
    cetagories,
    loading: cetaLoading,
    errors: cetaError,
    activeCetagory,
  } = useSelector(state => state.eBooksCeta);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllCetagories());
  }, []);
  function renderItem({item, index}) {
    return (
      <Button
        mx={1}
        onPress={() => {
          dispatch(setActiveCeta(item));
        }}
        borderRadius={50}
        bg={activeCetagory == item ? 'primary.500' : 'warmGray.100'}
        _pressed={{backgroundColor: 'primary.200'}}
        _text={{
          fontSize: 17,
          fontFamily: 'nik',
          color: activeCetagory !== item ? 'primary.600' : 'white',
        }}
        variant={'ghost'}>
        {item}
      </Button>
    );
  }

  return (
    <>
      <Box p={2} flexDirection={'row'} alignItems={'center'} bg={'white'}>
        <Box pr={2} borderRightWidth={0.2}>
          <Button
            borderRadius={50}
            onPress={() => {
              dispatch(setActiveCeta(Texts.allBookCeta));
            }}
            variant={'ghost'}
            bg={activeCetagory == 'সকল ই-বুক' ? 'primary.500' : 'white'}
            _text={{
              fontSize: 17,
              color: activeCetagory !== 'সকল ই-বুক' ? 'primary.600' : 'white',
              fontFamily: 'nik',
            }}>
            সকল ই-বুক
          </Button>
        </Box>
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={cetagories}
          keyExtractor={item => item.toString()}
          renderItem={renderItem}
        />
      </Box>
      <Divider />
    </>
  );
};

export default CetagoryList;
