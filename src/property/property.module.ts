import { Module } from "@nestjs/common";
import { PropertyResolver } from "./property.resolver";
import { PropertyService } from "./property.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Property, PropertySchema } from "./property.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: Property.name, schema: PropertySchema }])],
  providers: [PropertyResolver, PropertyService],
})
export class PropertyModule {}
