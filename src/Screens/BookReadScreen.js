import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Box,
  CircularProgress,
  Fab,
  Fade,
  Icon,
  IconButton,
  Image,
  Slide,
  Slider,
  Spinner,
  Text,
  useTheme,
} from 'native-base';
import RNPdf from 'react-native-pdf';
import {useRoute} from '@react-navigation/native';
import AppHeader from '../Components/AppHeader';
import {SharedElement} from 'react-navigation-shared-element';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Animated, Linking, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {savePages} from '../Redux/Slices/pagesaveSlice';

const BookReadingScreen = ({navigation}) => {
  const {
    params: {bookInfo, filePath, thumbPath},
  } = useRoute();
  const [id, book_name, book_url, size, book_thumbnail, _] = bookInfo;
  const [currentPage, setCurrentPage] = useState(0);
  const [jumpPage, setJumpPage] = useState(undefined);
  const [slideOpen, setSlideOpen] = useState(false);
  const [totoalPage, setTotalPage] = useState('');
  const theme = useTheme();
  const dispatch = useDispatch();
  const ProgressValue = useRef(new Animated.Value(0)).current;
  const savedPages = useSelector(state => state.savedPages.pages);
  const book = savedPages.find(b => b.id == id);
  const OnPageChanged = (page, numberOfPages) => {
    if (slideOpen) setSlideOpen(false);
    setCurrentPage(page);
    dispatch(savePages({bookID: id, pageNO: page}));
  };
  useEffect(() => {
    if (book) {
      jumpToPage(book.pageNO);
    }
  }, []);
  const onPageTouch = () => {
    setSlideOpen(!slideOpen);
  };
  const onPdfLoad = useCallback((numberOfPages, filePath) => {
    setSlideOpen(true);
    setTotalPage(numberOfPages.toString());
  }, []);
  const jumpToPage = useCallback(v => {
    v && setCurrentPage(Math.floor(v));
    setJumpPage(Math.floor(v));
    dispatch(savePages({bookID: id, pageNO: v}));
  }, []);

  return (
    <Box flex={1} bg={'#fff'} px={1}>
      <SharedElement id={id} style={{position: 'absolute', zIndex: -1}}>
        <Box
          bg={'#fff'}
          shadow={'8'}
          //   position={'absolute'}
          //   top={0}
          //   left={'50%'}
          style={{
            width: 250,
            height: 300,
            transform: [{translateX: -250 / 2}, {rotateZ: '0rad'}],
          }}
          overflow={'hidden'}
          opacity={0}
          rounded={'lg'}>
          <Image
            opacity={0}
            resizeMode="stretch"
            // borderRadius={10}
            rounded={'md'}
            style={{width: 250, height: 300}}
            // borderRadius={15}
            source={{
              uri: thumbPath ? 'file://' + thumbPath : book_thumbnail,
            }}
            alt={book_name}
          />
        </Box>
      </SharedElement>
      <RNPdf
        renderActivityIndicator={progress => {
          // console.log(progress);
          return <Spinner size={50} />;
        }}
        source={{uri: filePath ? filePath : book_url}}
        onLoadComplete={onPdfLoad}
        enablePaging={true}
        onPageChanged={OnPageChanged}
        onError={error => {
          // console.log(error);
        }}
        onLoadProgress={per => {
          ProgressValue.setValue(Math.floor(per * 100));
        }}
        onPressLink={uri => {
          Linking.openURL(uri).catch(err => console.error('Error', err));
        }}
        onPageSingleTap={onPageTouch}
        page={jumpPage}
        style={{
          //   borderWidth: 1,
          flex: 1,
          //   position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 0,
          backgroundColor: '#fff',
        }}
      />
      <Slide in={true} placement="right">
        <Box
          width={20}
          height={9}
          style={{top: 9, right: 5, position: 'absolute'}}
          alignItems={'center'}
          justifyContent={'center'}
          rounded={'lg'}
          zIndex={5}
          bg={'primary.200'}>
          <Text fontSize={16} fontFamily={'en'}>
            {currentPage == '0' ? '' : currentPage} - {totoalPage}
          </Text>
        </Box>
      </Slide>
      <Slide in={slideOpen} placement="top">
        <Box
          mt={2}
          py={1}
          mx={20}
          mr={24}
          //   style={{top: 9, position: 'absolute'}}
          //   alignItems={'center'}
          justifyContent={'center'}
          rounded={'lg'}
          zIndex={5}
          bg={'primary.200'}>
          <Text paddingX={1.5} textAlign={'center'} isTruncated fontSize={19}>
            {book_name}
          </Text>
          {!totoalPage && (
            <Animated.View
              style={{
                position: 'absolute',
                bottom: 2,
                left: 1,
                height: 2,
                backgroundColor: theme.colors.primary[500],
                borderRadius: 20,
                width: ProgressValue.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              }}
            />
          )}
        </Box>
      </Slide>
      <Slide in={slideOpen} placement={'bottom'}>
        <Box
          position={'absolute'}
          mx={2}
          mb={2}
          width={'96.5%'}
          bottom={0}
          bg={'primary.200'}
          shadow={'2'}
          rounded={'lg'}>
          <Box px={2} my={4} alignItems={'center'} flexDirection={'row'}>
            <Text mr={3} flex={0} fontFamily={'en'}>
              0
            </Text>
            <Slider
              flex={5}
              maxValue={totoalPage}
              defaultValue={1}
              value={currentPage}
              onChange={v => {
                v && setCurrentPage(Math.floor(v));
              }}
              onChangeEnd={jumpToPage}>
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
            <Text ml={3} flex={0} fontFamily={'en'}>
              {currentPage}
            </Text>
          </Box>
        </Box>
      </Slide>
      <IconButton
        rounded={'lg'}
        position={'absolute'}
        top={2}
        onPress={() => {
          navigation.goBack();
        }}
        left={2}
        bg={'white'}
        zIndex={100}
        icon={
          <Icon as={AntDesign} name="left" size={6} color={'primary.500'} />
        }
      />
      <Slide in={!slideOpen} placement={'right'}>
        <Fab
          size={10}
          onPress={() => {
            setSlideOpen(!slideOpen);
          }}
          icon={<Icon as={AntDesign} name="up" size={4} color={'white'} />}
        />
      </Slide>
      {!slideOpen && (
        <Box
          position={'absolute'}
          bottom={0}
          left={0}
          w={`${(parseInt(currentPage) * 100) / totoalPage}%`}
          height={1.5}
          bg={'primary.500'}
          zIndex={5}
        />
      )}
    </Box>
  );
};

export default BookReadingScreen;
