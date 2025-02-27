import { Test, TestingModule } from "@nestjs/testing";
import { PropertyService } from "./property.service";
import { getModelToken } from "@nestjs/mongoose";
import { CreatePropertyInput } from "./dto/create-property.input";
import { GraphQLError } from "graphql";
import axios from "axios";
import { WeatherDataAPI } from "./types/property.interface";
import { Property } from "./property.schema";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

type Location = Pick<WeatherDataAPI["location"], "lat" | "lon">;

describe("PropertyService", () => {
  let service: PropertyService;

  const mockWeatherData: { data: Pick<WeatherDataAPI, "current"> & { location: Location } } = {
    data: {
      current: {
        observation_time: "09:58 PM",
        temperature: 7,
        weather_code: 116,
        weather_icons: ["https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"],
        weather_descriptions: ["Partly cloudy"],
        wind_speed: 13,
        wind_degree: 111,
        wind_dir: "ESE",
        pressure: 1013,
        precip: 0,
        humidity: 61,
        cloudcover: 50,
        feelslike: 5,
        uv_index: 0,
        visibility: 16,
      },
      location: {
        lat: "40.752",
        lon: "-73.995",
      },
    },
  };

  const mockProperty = {
    _id: "1",
    street: "284 5th Ave",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    weather: {
      observationTime: "09:58 PM",
      temperature: 7,
      weatherCode: 116,
      weatherIcons: ["https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"],
      weatherDescriptions: ["Partly cloudy"],
      windSpeed: 13,
      windDegree: 111,
      windDir: "ESE",
      pressure: 1013,
      precip: 0,
      humidity: 61,
      cloudcover: 50,
      feelslike: 5,
      uvIndex: 0,
      visibility: 16,
    },
    lat: "40.752",
    long: "-73.995",
  };

  let mockPropertyModel;

  beforeEach(async () => {
    process.env.WEATHERSTACK_API_KEY = "test_api_key";

    mockPropertyModel = jest.fn().mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(mockProperty),
    }));

    mockPropertyModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockProperty),
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        {
          provide: getModelToken("Property"),
          useValue: mockPropertyModel,
        },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createProperty", () => {
    it("should create a property with weather data", async () => {
      const createPropertyInput: CreatePropertyInput = {
        street: "284 5th Ave",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      };

      mockedAxios.get.mockResolvedValueOnce(mockWeatherData);

      const result = await service.createProperty(createPropertyInput);

      expect(mockedAxios.get).toHaveBeenCalledWith("http://api.weatherstack.com/current", {
        params: {
          access_key: "test_api_key",
          query: "10001, United States of America",
        },
      });

      expect(mockPropertyModel).toHaveBeenCalledWith({
        ...createPropertyInput,
        weather: {
          observationTime: "09:58 PM",
          temperature: 7,
          weatherCode: 116,
          weatherIcons: ["https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png"],
          weatherDescriptions: ["Partly cloudy"],
          windSpeed: 13,
          windDegree: 111,
          windDir: "ESE",
          pressure: 1013,
          precip: 0,
          humidity: 61,
          cloudcover: 50,
          feelslike: 5,
          uvIndex: 0,
          visibility: 16,
        },
        lat: "40.752",
        long: "-73.995",
      });

      expect(result).toEqual(mockProperty);
    });

    it("should throw error when Weatherstack API returns error", async () => {
      const createPropertyInput: CreatePropertyInput = {
        street: "284 5th Ave",
        city: "New York",
        state: "NY",
        zipCode: "10001",
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: false,
          error: {
            code: 400,
          },
        },
      });

      await expect(service.createProperty(createPropertyInput)).rejects.toThrow(new GraphQLError("Weatherstack API error - code: 400"));
    });
  });

  describe("deletePropertyById", () => {
    it("should delete a property by id and return success message", async () => {
      mockPropertyModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(mockProperty),
      });

      const result = await service.deletePropertyById("1");

      expect(mockPropertyModel.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(result).toBe("Property deleted");
    });

    it("should return not found message when property does not exist", async () => {
      mockPropertyModel.findByIdAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await service.deletePropertyById("2");

      expect(mockPropertyModel.findByIdAndDelete).toHaveBeenCalledWith("2");
      expect(result).toBe("Property not found");
    });
  });
});
