import React, {useEffect, useRef, useState} from 'react';
import {
  Box,
  Heading,
  Image,
  VStack,
  Text,
  HStack,
  Divider,
  Button,
  ScrollView,
  Icon,
  IconButton,
  Center,
  AlertDialog,
  useTheme,
} from 'native-base';
import {useNavigation, useRoute} from '@react-navigation/native';
import Texts from '../Constants/Texts';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {SharedElement} from 'react-navigation-shared-element';
import {bookDownload, IsDownloaded, showToast} from '../Constants/Actions';
import {Animated, View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {fetchAllDownBooks} from '../Redux/Slices/downloadedSlice';

const BookTitle = ({book_writer, book_name}) => {
  return (
    <>
      <Heading textAlign={'center'} fontFamily={'nik'} fontSize={30}>
        {book_name}
      </Heading>
      <Text
        textAlign={'center'}
        fontFamily={'nik'}
        fontSize={20}
        color={'primary.500'}>
        {book_writer}
      </Text>
    </>
  );
};

const BookDiscription = ({book_dictype, book_discription}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <VStack px={3}>
      <Text fontSize={23} color={'gray.400'}>
        {book_dictype}
      </Text>
      <Text color={'gray.600'} isTruncated={!isOpen} fontSize={23}>
        {book_discription}
      </Text>
      <Button
        variant={'link'}
        _text={{fontFamily: 'en'}}
        onPress={() => setIsOpen(!isOpen)}>
        {!isOpen ? 'See More' : 'Less More'}
      </Button>
    </VStack>
  );
};

const BookInfoTable = ({infoKey, infoValue}) => {
  if (infoValue == '0') {
    return null;
  }

  return (
    <HStack mx={3} my={1} justifyContent={'space-between'}>
      <Text fontSize={22} color={'gray.400'}>
        {infoKey}
      </Text>
      <Divider width={2} />
      <Text maxW={'60%'} fontSize={22.5}>
        {infoValue}
      </Text>
    </HStack>
  );
};
function DownloadPreviewBtn({
  info,
  filePath,
  thumbPath,
  setInfo,
  isDownloaded,
  setIsDownloaded,
  setThumbPath,
  setFilePath,
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const [error, setError] = useState(undefined);
  const nav = useNavigation();
  const dispatch = useDispatch();
  const {colors} = useTheme();
  function OnlinePreview() {
    nav.navigate('BookReadingScreen', {bookInfo: info});
  }
  function OfflinePreview() {
    nav.navigate('BookReadingScreen', {
      bookInfo: info,
      filePath,
      thumbPath,
    });
  }
  const OnComplete = React.useCallback(function (downInfo) {
    setIsDownloaded(true);
    setInfo(downInfo.info);
    setFilePath(downInfo.pdfpath);
    setThumbPath(downInfo.pdfThumb);
    setIsOpen(false);
    dispatch(fetchAllDownBooks());
  }, []);

  const AnimatedProgress = useRef(new Animated.Value(0)).current;

  function dowload() {
    setIsOpen(true);
    bookDownload(
      info,
      ({bytesWritten, contentLength}) => {
        AnimatedProgress.setValue(
          Math.floor((bytesWritten * 100) / contentLength),
        );
      },
      OnComplete,
      err => {
        showToast(err.message, 2000);
        onClose();
      },
    );
  }

  function renderActionButton() {
    if (!isDownloaded) {
      return (
        <HStack p={2} shadow={'4'} bg={'#fff'}>
          <Button
            onPress={OnlinePreview}
            leftIcon={<Icon as={IonIcon} name="ios-reader" />}
            _text={{fontSize: 22}}
            mx={1}
            flex={1}>
            {Texts.previewButton}
          </Button>
          <Button
            onPress={dowload}
            leftIcon={<Icon as={IonIcon} name="download" />}
            _text={{fontSize: 22}}
            mx={1}
            flex={1}>
            {Texts.downloadButton}
          </Button>
        </HStack>
      );
    } else {
      return (
        <HStack p={2} shadow={'4'} bg={'#fff'}>
          <Button
            onPress={OfflinePreview}
            leftIcon={<Icon as={IonIcon} name="ios-reader" />}
            _text={{fontSize: 22}}
            mx={1}
            flex={1}>
            {Texts.offlineReading}
          </Button>
        </HStack>
      );
    }
  }

  return (
    <>
      <Center>
        <AlertDialog
          motionPreset="fade"
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          isOpen={isOpen}
          isCentered>
          <AlertDialog.Content>
            <AlertDialog.Header>
              {Texts.downloadingDiologueHeader}
            </AlertDialog.Header>
            <AlertDialog.Body>
              <Text>
                বই সাইজঃ{' '}
                <Text fontFamily={'en'} fontSize={18}>
                  {info[3]}MB
                </Text>
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    marginVertical: 10,
                    width: '100%',
                    height: 5,
                    backgroundColor: colors.amber['200'],
                  }}>
                  <Animated.View
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      backgroundColor: colors.primary[500],
                      height: '100%',
                      width: AnimatedProgress.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                      }),
                    }}
                  />
                </View>
              </View>
            </AlertDialog.Body>
          </AlertDialog.Content>
        </AlertDialog>
      </Center>
      {renderActionButton()}
    </>
  );
}

const BookScreen = ({navigation}) => {
  const {
    params: {bookInfo},
  } = useRoute();

  if (!bookInfo) {
    navigation.navigate('Main');
  }

  const [info, setInfo] = useState([...bookInfo]);
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
    book_discription,
  ] = info;
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [filePath, setFilePath] = useState();
  const [thumbPath, setThumbPath] = useState();
  const books = useSelector(state => state.eBooks.books);
  const onlinebook = books.find(item => item[0] == bookInfo[0]);

  const dbooks = useSelector(state => state.downloadBooks.downBooks);
  const offlinebook = dbooks.find(item => item.id == bookInfo[0]);

  useEffect(() => {
    if (!!offlinebook) {
      // console.log('down');
      setInfo(offlinebook.info);
      setFilePath(offlinebook.pdfpath);
      setThumbPath(offlinebook.pdfThumb);
      // console.log('offlineBook: ', dbooks);
      setIsDownloaded(true);
    } else {
      // console.log('on');
      setInfo(onlinebook);
      // console.log('onLineBook: ', onlinebook);
      setIsDownloaded(false);
    }
  }, []);
  // console.log('offbook: ', offlinebook);
  // console.log('onlinebook: ', onlinebook);

  return (
    <Box flex={1} bg={'#fff'}>
      <IconButton
        onPress={() => {
          navigation.goBack();
        }}
        position={'absolute'}
        top={2}
        left={1}
        zIndex={2}
        icon={
          <Icon as={AntDesign} name="left" size={25} color={'primary.500'} />
        }
      />
      <ScrollView>
        <VStack py={2}>
          <Box mt={5} alignItems={'center'} justifyContent={'center'}>
            <SharedElement id={id}>
              <Box
                bg={'#fff'}
                shadow={'8'}
                style={{width: 250, height: 350}}
                overflow={'hidden'}
                rounded={'lg'}>
                <Image
                  resizeMode="stretch"
                  rounded={'md'}
                  style={{width: 250, height: 350}}
                  // borderRadius={15}
                  source={{
                    uri: book_thumbnail.startsWith('http')
                      ? book_thumbnail
                      : 'file://' + book_thumbnail,
                  }}
                  alt={book_name}
                />
              </Box>
            </SharedElement>
          </Box>
          <Box my={5}>
            <BookTitle book_name={book_name} book_writer={book_writer} />
            <BookDiscription
              book_dictype={'বিস্তারিত'}
              book_discription={book_discription}
            />
            <BookInfoTable infoKey={'বইয়ের ধরন'} infoValue={book_cetagory} />
            <BookInfoTable infoKey={'প্রকাশনী'} infoValue={book_publication} />
            <BookInfoTable infoKey={'লেখক'} infoValue={book_writer} />
            <BookInfoTable infoKey={'অনুবাদক'} infoValue={book_translator} />
            {/* <BookInfoTable
              infoKey={'ফাইল সাইজ'}
              infoValue={book_size + ' মেগাবাইট'}
            /> */}
          </Box>
        </VStack>
      </ScrollView>
      <DownloadPreviewBtn
        setInfo={setInfo}
        isDownloaded={isDownloaded}
        setIsDownloaded={setIsDownloaded}
        info={info}
        filePath={filePath}
        thumbPath={thumbPath}
        setFilePath={setFilePath}
        setThumbPath={setThumbPath}
      />
    </Box>
  );
};

export default BookScreen;
