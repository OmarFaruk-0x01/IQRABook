import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStorage = () => {
  async function setItem(key, value) {
    try {
      const storageResp = await AsyncStorage.setItem(
        key,
        JSON.stringify(value),
      );
      return {ok: true, error: null, data: {key, value}};
    } catch (err) {
      return {ok: false, error: err, data: {key, value}};
    }
  }

  async function getItem(key) {
    try {
      const storageResp = await AsyncStorage.getItem(key);
      let resp;
      try {
        resp = JSON.parse(storageResp);
      } catch (err) {
        resp = storageResp;
      }
      return {ok: true, error: null, data: resp};
    } catch (err) {
      return {ok: false, error: err, data: null};
    }
  }

  return {getItem, setItem};
};
