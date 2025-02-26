import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { ObjectType, Field, Int, ID } from "@nestjs/graphql";
import { Matches } from "class-validator";
import { Weather, WeatherSchema } from "./weather.schema";

export type PropertyDocument = HydratedDocument<Property>;

@ObjectType()
@Schema({ timestamps: true })
export class Property {
  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop()
  city: string;

  @Field()
  @Prop()
  street: string;

  @Field()
  @Prop()
  state: string;

  @Field()
  @Prop()
  zipCode: string;

  @Field(() => Weather)
  @Prop({
    type: WeatherSchema,
  })
  weather: Weather;

  @Field()
  @Prop()
  lat: string;

  @Field()
  @Prop()
  long: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);
