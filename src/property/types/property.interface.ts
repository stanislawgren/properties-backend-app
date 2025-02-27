//a separate type defined for data returned from the Weatherstack api

import { CreatePropertyInput } from "../dto/create-property.input";
import { Weather } from "../weather.schema";

export type WeatherDataAPI = {
  success: boolean;
  request?: {
    type: string;
    query: string;
    language: string;
    unit: string;
  };
  location?: {
    name: string;
    country: string;
    region: string;
    lat: string;
    lon: string;
    timezone_id: string;
    localtime: string;
    localtime_epoch: number;
    utc_offset: string;
  };
  current?: {
    observation_time: string;
    temperature: number;
    weather_code: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree: number;
    wind_dir: string;
    pressure: number;
    precip: number;
    humidity: number;
    cloudcover: number;
    feelslike: number;
    uv_index: number;
    visibility: number;
  };
  error?: {
    code: number;
    type: string;
    info: string;
  };
};

export type PropertyInputWithWeather = CreatePropertyInput & { weather: Weather; lat: string; long: string };
