import React from 'react';
import {
  AlertDialog,
  Box,
  Button,
  Center,
  Icon,
  IconButton,
  Image,
  Pressable,
  Text,
} from 'native-base';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity, TouchableOpacityBase} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SharedElement} from 'react-navigation-shared-element';
import FavouriteIconBtn from './FavouriteBtn';
import Texts from '../Constants/Texts';
import {useDispatch} from 'react-redux';
import {removeDownBook, showToast} from '../Constants/Actions';
import {
  fetchAllDownBooks,
  loadUpdateDownBooks,
} from '../Redux/Slices/downloadedSlice';

function RemoveDownBook({bookId, cancelRef, onClose, isOpen}) {
  const dispatch = useDispatch();
  const onYes = () => {
    removeDownBook(bookId).then(data => {
      showToast(Texts.removeDownBookToast);
      onClose();
      setTimeout(() => {
        dispatch(fetchAllDownBooks());
      }, 500);
    });
  };

  return (
    <Center>
      <AlertDialog
        motionPreset="fade"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>
            {Texts.removeDownDiologeHeader}
          </AlertDialog.Header>
          <AlertDialog.Body>{Texts.removeDownDiologeBody}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button ref={cancelRef} onPress={onClose}>
              না
            </Button>
            <Button onPress={onYes} colorScheme="red" ml={3}>
              হ্যা
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  );
}

const BookItem = ({info}) => {
  const nav = useNavigation();
  const route = useRoute();

  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
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
  ] = info;
  // console.log(book_thumbnail);
  function onBookPress() {
    nav.navigate('BookScreen', {bookInfo: info});
  }
  // console.log(id);
  function onLongPress() {
    if (route.name == Texts.downloadScreen) setIsOpen(!isOpen);
  }
  return (
    <>
      <Pressable
        _pressed={{opacity: 0.7}}
        w={'47%'}
        m={1.5}
        onLongPress={onLongPress}
        onPress={onBookPress}
        activeOpacity={0.4}>
        <SharedElement id={id}>
          <Box shadow={'5'} rounded={'lg'} bg={'white'} overflow={'hidden'}>
            <Image
              rounded={'md'}
              style={{width: '100%', height: 300}}
              source={{
                uri: book_thumbnail.startsWith('http')
                  ? book_thumbnail
                  : 'file://' + book_thumbnail,
              }}
              alt={book_name}
              resizeMode="stretch"
            />
          </Box>
        </SharedElement>
        <FavouriteIconBtn info={info} />

        {/* </Box> */}
      </Pressable>
      <RemoveDownBook
        cancelRef={cancelRef}
        isOpen={isOpen}
        bookId={info[0]}
        onClose={onClose}
      />
    </>
  );
};

export default React.memo(BookItem);
