import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Property } from "./property.schema";
import { CreatePropertyInput } from "./dto/create-property.input";
import { Weather } from "./weather.schema";
import { GraphQLError } from "graphql";
import axios from "axios";
import { PropertyFilterInput } from "./dto/property-filter.input";
import { SortOrder } from "src/enums/sort-order.enum";
import { WeatherDataAPI } from "src/types/weather-data-api.interface";

@Injectable()
export class PropertyService {
  constructor(@InjectModel(Property.name) private propertyModel: Model<Property>) { }

  async getProperties(filters: PropertyFilterInput): Promise<Property[]> {
    const { city, zipCode, state, sortByDate } = filters || {};
    let filter = {};

    if (city) filter["city"] = city;
    if (zipCode) filter["zipCode"] = zipCode;
    if (state) filter["state"] = state;

    let sort = {};

    if (sortByDate) sort = sortByDate === SortOrder.ASC ? { createdAt: 1 } : { createdAt: -1 };

    return await this.propertyModel.find(filter).sort(sort).collation({ locale: "en", strength: 2 }).exec();
  }

  async getPropertyById(id: string): Promise<Property> {
    return await this.propertyModel.findById(id).exec();
  }

  async create(createPropertyInput: CreatePropertyInput): Promise<Property> {
    const { lat, lon, ...weatherData } = await this.getWeather(`${createPropertyInput.zipCode}, United States of America`);

    const propertyWithWeather: CreatePropertyInput & { weather: Weather, lat: string, long: string } = { ...createPropertyInput, weather: weatherData, lat: lat, long: lon };
    const createdProperty = new this.propertyModel(propertyWithWeather);

    return await createdProperty.save();
  }

  async deletePropertyById(id: string): Promise<String> {
    const result = await this.propertyModel.findByIdAndDelete(id).exec();
    return result !== null ? "Property deleted" : "Property not found";
  }

  private async getWeather(address: string): Promise<Weather & { lat: string, lon: string }> {
    const API_KEY = process.env.WEATHERSTACK_API_KEY;
    const response = await axios.get<WeatherDataAPI>(`http://api.weatherstack.com/current`, {
      params: {
        access_key: API_KEY,
        query: address,
      },
    });

    if (response?.data.success === false) {
      throw new GraphQLError("Weatherstack API error - code: " + response?.data.error.code)
    }

    return {
      observationTime: response?.data.current.observation_time,
      temperature: response?.data.current.temperature,
      weatherCode: response?.data.current.weather_code,
      weatherIcons: response?.data.current.weather_icons,
      weatherDescriptions: response?.data.current.weather_descriptions,
      windSpeed: response?.data.current.wind_speed,
      windDegree: response?.data.current.wind_degree,
      windDir: response?.data.current.wind_dir,
      pressure: response?.data.current.pressure,
      precip: response?.data.current.precip,
      humidity: response?.data.current.humidity,
      cloudcover: response?.data.current.cloudcover,
      feelslike: response?.data.current.feelslike,
      uvIndex: response?.data.current.uv_index,
      visibility: response?.data.current.visibility,
      lat: response?.data.location.lat,
      lon: response?.data.location.lon,
    }
  }
}
