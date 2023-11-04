/* eslint-disable consistent-return */
import axios from 'axios';

export const getPlacesData = async (bl_lat, bl_lng, tr_lat, tr_lng, type) => {
  try {
    const { data: { data } } = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`, {
      params: {
        bl_latitude: bl_lat ? bl_lat : "25.15543993776612",
        tr_latitude: tr_lat ? tr_lat : "25.41257834546226",
        bl_longitude: bl_lng ? bl_lng : "51.39587210719369",
        tr_longitude: tr_lng ? tr_lng : "51.62812119686502",

      },
      headers: {
        'X-RapidAPI-Key': "Api_Key",
        'X-RapidAPI-Host': "travel-advisor.p.rapidapi.com",
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getWeatherData = async (lat, lng) => {
  try {
    if (lat && lng) {
      const { data } = await axios.get('https://community-open-weather-map.p.rapidapi.com/find', {
        params: { lat, lon: lng },
        headers: {
          'x-rapidapi-key': "Your_api_key",
          'x-rapidapi-host': "open-weather13.p.rapidapi.com",
        },
      });

      return data;
    }
  } catch (error) {
    console.log(error);
  }
};