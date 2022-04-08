import React from 'react';
import {Box, Heading, Icon, IconButton, useColorModeValue} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Linking} from 'react-native';
import {ADDFORMURL} from '../Constants/Fetcher';
import {showToast} from '../Constants/Actions';
import Texts from '../Constants/Texts';

const AppHeader = ({title, isBackAction}) => {
  const nav = useNavigation();

  function backAction() {
    function handleBackAction() {
      if (nav.canGoBack()) {
        nav.goBack();
      }
    }
    if (isBackAction) {
      return (
        <IconButton
          mr={3}
          onPress={handleBackAction}
          icon={
            <Icon as={AntDesign} name="left" size={25} color={'primary.500'} />
          }
        />
      );
    }
    return null;
  }

  return (
    <Box
      zIndex={1}
      py={2}
      px={isBackAction ? 3 : 3}
      bg={'#fff'}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      justifyItems={'center'}>
      {backAction()}
      <Heading top={'2px'} fontFamily={'nik'} fontSize={25}>
        {title}
      </Heading>
      <IconButton
        borderRadius={20}
        onLongPress={() => {
          showToast(Texts.bookSuggesionText, 3000);
        }}
        onPress={() => {
          Linking.openURL(ADDFORMURL);
        }}
        icon={
          <Icon
            name="pluscircleo"
            as={AntDesign}
            size={'sm'}
            color={'primary.500'}
          />
        }
      />
    </Box>
  );
};

export default AppHeader;
