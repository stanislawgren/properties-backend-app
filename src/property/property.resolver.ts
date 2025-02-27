import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { PropertyService } from "./property.service";
import { Property } from "./property.schema";
import { CreatePropertyInput } from "./dto/create-property.input";
import { UsePipes, ValidationPipe } from "@nestjs/common";
import { PropertyFilterInput } from "./dto/property-filter.input";

@Resolver(() => Property)
export class PropertyResolver {
  constructor(private readonly propertyService: PropertyService) { }

  @Query(() => [Property])
  @UsePipes(new ValidationPipe())
  async getProperties(@Args("filters", { type: () => PropertyFilterInput, nullable: true }) filters?: PropertyFilterInput) {
    return this.propertyService.getProperties(filters);
  }

  @Query(() => Property)
  async getPropertyById(@Args("id") id: string) {
    return this.propertyService.getPropertyById(id);
  }

  @Mutation(() => Property)
  @UsePipes(new ValidationPipe())
  async createProperty(@Args("createPropertyInput") createPropertyInput: CreatePropertyInput): Promise<Property> {
    return this.propertyService.createProperty(createPropertyInput);
  }

  @Mutation(() => String)
  async deletePropertyById(@Args("id") id: string) {
    return this.propertyService.deletePropertyById(id);
  }
}
