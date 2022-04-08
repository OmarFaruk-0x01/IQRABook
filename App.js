import React from 'react';
import {LogBox} from 'react-native';
import {
  Box,
  Button,
  extendTheme,
  Icon,
  IconButton,
  NativeBaseProvider,
  Text,
  useTheme,
} from 'native-base';
import HomeScreen from './src/Screens/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import BookScreen from './src/Screens/BookScreen';

import IonIcons from 'react-native-vector-icons/Ionicons';
import Texts from './src/Constants/Texts';
import BookReadingScreen from './src/Screens/BookReadScreen';
import {Provider} from 'react-redux';
import store from './src/Redux/store';
import FavouriteScreen from './src/Screens/FavouriteScreen';
import DownloadScreen from './src/Screens/DownloadScreen';
LogBox.ignoreLogs(['NativeBase: The contrast']);

const newColorTheme = {
  iconColorsDark: {
    500: '#9E9EA0',
  },
  primary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  backgroundDark: {
    900: '#0c0c0c',
    800: '#0c0c0c',
    700: '#0c0c0c',
    600: '#0c0c0c',
    500: '#1c1c1c',
    400: '#2c2c2c',
    300: '#3c3c3c',
    200: '#4c4c4c',
    100: '#5c5c5c',
  },
  backgroundLight: {
    900: '#fcfcfc',
    800: '#fcfcfc',
    700: '#fcfcfc',
    600: '#fcfcfc',
    500: '#ececec',
    400: '#dcdcdc',
    300: '#cccccc',
    200: '#bcbcbc',
    100: '#acacac',
  },
};
const theme = extendTheme({
  components: {
    Text: {
      baseStyle: {
        fontSize: 20,
      },
    },
  },
  colors: newColorTheme,
  fontConfig: {
    nikos: {
      100: {
        normal: 'Nik',
        italic: 'Nik',
      },
      200: {
        normal: 'Nik',
        italic: 'Nik',
      },
      300: {
        normal: 'Nik',
        italic: 'Nik',
      },
      400: {
        normal: 'Nik',
        italic: 'Nik',
      },
      500: {
        normal: 'Nik',
        italic: 'Nik',
      },
      600: {
        normal: 'Nik',
        italic: 'Nik',
      },
      700: {
        normal: 'Nik',
        italic: 'Nik',
      },
      800: {
        normal: 'Nik',
        italic: 'Nik',
      },
      900: {
        normal: 'Nik',
        italic: 'Nik',
      },
    },
    sutoni: {
      100: {
        normal: 'S1',
        italic: 'S1',
      },
      200: {
        normal: 'S1',
        italic: 'S1',
      },
      300: {
        normal: 'S1',
        italic: 'S1',
      },
      400: {
        normal: 'S1',
        italic: 'S1',
      },
      500: {
        normal: 'S1',
        italic: 'S1',
      },
      600: {
        normal: 'S2',
        italic: 'S2',
      },
      700: {
        normal: 'S2',
        italic: 'S2',
      },
      800: {
        normal: 'S3',
        italic: 'S3',
      },
      900: {
        normal: 'S3',
        italic: 'S3',
      },
    },
    popins: {
      100: {
        normal: 'P2',
        italic: 'P2',
      },
      200: {
        normal: 'P2',
        italic: 'P2',
      },
      300: {
        normal: 'P5',
        italic: 'P5',
      },
      400: {
        normal: 'P5',
        italic: 'P5',
      },
      500: {
        normal: 'P3',
        italic: 'P3',
      },
      600: {
        normal: 'P3',
        italic: 'P3',
      },
      700: {
        normal: 'P4',
        italic: 'P4',
      },
      800: {
        normal: 'P4',
        italic: 'P4',
      },
      900: {
        normal: 'P1',
        italic: 'P1',
      },
    },
  },
  fonts: {
    heading: 'nikos',
    body: 'nikos',
    mono: 'nikos',
    en: 'popins',
    bn: 'sutoni',
    nik: 'nikos',
  },
  config: {
    useSystemColorMode: false,
    // Changing initialColorMode to 'dark'
    initialColorMode: 'light',
  },
});

const Stack = createSharedElementStackNavigator();
const BottomStack = createBottomTabNavigator();
const BottomTabs = () => {
  const {colors, fonts} = useTheme();
  return (
    <BottomStack.Navigator
      screenOptions={({route, navigation}) => ({
        headerShown: false,
        tabBarLabelPosition: 'beside-icon',
        tabBarActiveTintColor: colors.primary[500],
        tabBarLabel: ({color, focused, position}) => {
          return (
            <Text ml={5} color={color}>
              {route.name}
            </Text>
          );
        },
        tabBarLabelStyle: {
          fontSize: 20,
          fontFamily: 'nikosh',
          fontWeight: null,
        },
        tabBarIcon: ({size, color, focused}) => {
          switch (route.name) {
            case Texts.homeScreen:
              return (
                <Icon
                  as={IonIcons}
                  name="md-book-outline"
                  size={size}
                  color={color}
                />
              );

            case Texts.downloadScreen:
              return (
                <Icon
                  as={IonIcons}
                  name="ios-download"
                  size={size}
                  color={color}
                />
              );
            case Texts.favouriteScreen:
              return (
                <Icon
                  as={IonIcons}
                  name="ios-heart"
                  size={size}
                  color={color}
                />
              );
          }
        },
      })}>
      <BottomStack.Screen name={Texts.homeScreen} component={HomeScreen} />
      <BottomStack.Screen
        options={{
          tabBarButton: ({onPress}) => {
            return (
              <Button
                onPress={onPress}
                width={50}
                zIndex={100}
                height={50}
                position={'absolute'}
                top={-20}
                left={'50%'}
                borderRadius={50}
                style={{transform: [{translateX: -25}]}}
                leftIcon={
                  <Icon
                    as={IonIcons}
                    name="ios-heart"
                    size={30}
                    color={'white'}
                  />
                }></Button>
            );
          },
        }}
        name={Texts.favouriteScreen}
        component={FavouriteScreen}
      />
      <BottomStack.Screen
        name={Texts.downloadScreen}
        component={DownloadScreen}
      />
    </BottomStack.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'Main'} component={BottomTabs} />
      <Stack.Screen
        name={'BookReadingScreen'}
        component={BookReadingScreen}
        sharedElements={route => {
          const {bookInfo} = route.params;
          // console.log('BookReadScreen: ', bookInfo);
          return [bookInfo[0]];
        }}
      />
      <Stack.Screen
        sharedElements={route => {
          const {bookInfo} = route.params;
          return [bookInfo[0]];
        }}
        name={'BookScreen'}
        component={BookScreen}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <MainStack />
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
