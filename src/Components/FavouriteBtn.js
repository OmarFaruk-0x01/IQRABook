import React, {useEffect, useState} from 'react';
import {AlertDialog, Button, Icon, IconButton} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {setFavouriteBook, showToast} from '../Constants/Actions';
import Texts from '../Constants/Texts';
import {useDispatch, useSelector} from 'react-redux';
import {
  addFavouriteBook,
  removeFavouriteBook,
  fatchAllFavouriteBooks,
} from '../Redux/Slices/favouriteBooksSlice';
import {useIsFocused} from '@react-navigation/native';

const FavouriteIconBtn = ({setIsFavourite, info}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isFav, setIsFav] = useState(false);
  const onClose = () => setIsOpen(false);
  const fvBooks = useSelector(state => state.favouriteBooks.fvBooks);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [mounted, setMounted] = useState(true);
  const isFavourite = () => {
    const fv = fvBooks.find(book => book[0] == info[0]);
    if (fv && mounted) {
      setIsFav(true);
    }
  };
  useEffect(() => {
    isFavourite();
    return () => {
      setMounted(false);
    };
  }, [fvBooks]);

  async function _setFavourite() {
    dispatch(addFavouriteBook(info));
    showToast(Texts.BookFavouriteAdded);
    setIsFav(true);
    // console.log('FVPressd: ', info);
    // const resp = await setFavouriteBook(info);
    // if (resp.ok) {
    //   showToast(Texts.BookFavouriteAdded);
    //   dispatch(fatchAllFavouriteBooks());
    //   isFavourite();
    // } else {
    //   showToast(resp.error.toString());
    // }
  }

  const openRemoveDiologe = () => {
    setIsOpen(true);
  };

  const removeFav = () => {
    dispatch(removeFavouriteBook(info[0]));
    showToast(Texts.removeFavToast);
    onClose();
    setIsFav(false);
  };

  const cancelRef = React.useRef(null);

  return (
    <>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{Texts.ask_favRemoveHeader}</AlertDialog.Header>
          <AlertDialog.Body>{Texts.ask_favRemoveDetails}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={onClose}
                ref={cancelRef}>
                {Texts.ask_favRemoveCancleBtn}
              </Button>
              <Button colorScheme="danger" onPress={removeFav}>
                {Texts.ask_favRemoveBtn}
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
      <IconButton
        onLongPress={openRemoveDiologe}
        onPress={_setFavourite}
        bg={'white'}
        position={'absolute'}
        bottom={2}
        right={2}
        borderRadius={20}
        zIndex={2}
        icon={
          <Icon
            as={AntDesign}
            name={`heart${isFav ? '' : 'o'}`}
            size={6}
            color={'primary.500'}
          />
        }
      />
    </>
  );
};

export default FavouriteIconBtn;
