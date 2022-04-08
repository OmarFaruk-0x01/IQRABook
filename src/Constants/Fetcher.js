const SHEETID = '1RnVetNff9FEq3F1nA9fHn2XMvSPP_6Bw0gg3jwIodTs';
const APIKEY = '<Your APIKEY>';
export const ADDFORMURL = 'https://forms.gle/qcKd78jr4dbMa4rF9';
const URL = sheetRange =>
  `https://sheets.googleapis.com/v4/spreadsheets/${SHEETID}/values/${sheetRange}?key=${APIKEY}`;

import Axios from 'axios';

export const GetCetagories = async () => {
  try {
    const resp = await Axios.get(URL('Cetagories!A:A'));
    if (resp.status !== 200) {
      throw new Error('Somthing Went Wrong');
    }
    return resp.data.values.map(item => item[0]);
  } catch (e) {
    console.log('Error: ', e);
    return [];
  }
};
export const GetBooks = async () => {
  try {
    const resp = await Axios.get(URL('Books!A2:J'));
    if (resp.status !== 200) {
      throw new Error('Somthing Went Wrong');
    }
    return resp.data.values;
  } catch (e) {
    console.log('Error: ', e);
    return [];
  }
};

export const SinglePDFDownload = async (
  url,
  onProgress,
  OnComplete,
  OnError,
) => {
  try {
  } catch (err) {}
};
