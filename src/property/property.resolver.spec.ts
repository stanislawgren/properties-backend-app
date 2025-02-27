import { Test, TestingModule } from "@nestjs/testing";
import { PropertyResolver } from "./property.resolver";
import { PropertyService } from "./property.service";
import { ValidationPipe } from "@nestjs/common";
import { CreatePropertyInput } from "./dto/create-property.input";
import { PropertyFilterInput } from "./dto/property-filter.input";
import { SortOrder } from "src/enums/sort-order.enum";

describe("PropertyResolver", () => {
  let resolver: PropertyResolver;

  const mockProperty = {
    _id: "1",
    street: "284 5th Ave",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  };

  const mockPropertyService = {
    createProperty: jest.fn().mockImplementation(input => ({
      id: "1",
      ...input,
    })),
    getPropertyById: jest.fn().mockResolvedValue(mockProperty),
    getProperties: jest.fn().mockResolvedValue([mockProperty]),
    deletePropertyById: jest.fn().mockImplementation((id: string) => {
      return id === "1" ? "Property deleted" : "Property not found";
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyResolver,
        {
          provide: PropertyService,
          useValue: mockPropertyService,
        },
      ],
    }).compile();

    resolver = module.get<PropertyResolver>(PropertyResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should return all properties with valid filters", async () => {
    const filters: PropertyFilterInput = {
      city: "New York",
      zipCode: "10001",
      state: "NY",
      sortByDate: SortOrder.ASC,
    };

    const result = await resolver.getProperties(filters);
    expect(result).toEqual([mockProperty]);
    expect(mockPropertyService.getProperties).toHaveBeenCalledWith(filters);
  });

  it("should return a single property by ID", async () => {
    const result = await resolver.getPropertyById("1");
    expect(result).toEqual(mockProperty);
    expect(mockPropertyService.getPropertyById).toHaveBeenCalledWith("1");
  });

  it("should create a property with valid input", async () => {
    const validInput: CreatePropertyInput = {
      city: "New York",
      street: "284 5th Ave",
      state: "NY",
      zipCode: "10001",
    };

    const result = await resolver.createProperty(validInput);
    expect(result).toEqual({
      id: "1",
      ...validInput,
    });
    expect(mockPropertyService.createProperty).toHaveBeenCalledWith(validInput);
  });

  it("should throw an error for invalid zipCode", async () => {
    const invalidInput: CreatePropertyInput = {
      city: "New York",
      street: "284 5th Ave",
      state: "NY",
      zipCode: "1234",
    };

    try {
      const validationPipe = new ValidationPipe();
      await validationPipe.transform(invalidInput, {
        type: "body",
        metatype: CreatePropertyInput,
      });
      await resolver.createProperty(invalidInput);
    } catch (error) {
      expect(error.getResponse().message).toContain("ZipCode should be 5 digits.");
    }
  });

  it("should delete a property by ID", async () => {
    const result = await resolver.deletePropertyById("1");
    expect(result).toBe("Property deleted");
    expect(mockPropertyService.deletePropertyById).toHaveBeenCalledWith("1");
  });

  it("should return 'Property not found' when id doesn't exist", async () => {
    const result = await resolver.deletePropertyById("2");
    expect(result).toBe("Property not found");
    expect(mockPropertyService.deletePropertyById).toHaveBeenCalledWith("2");
  });
});
