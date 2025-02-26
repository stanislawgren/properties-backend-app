import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@ObjectType()
@Schema({ _id: false })
export class Weather {
  @Field()
  @Prop()
  observationTime: string;

  @Field(() => Int)
  @Prop()
  temperature: number;

  @Field()
  @Prop()
  weatherCode: number;

  @Field(() => [String])
  @Prop()
  weatherIcons: string[];

  @Field(() => [String])
  @Prop()
  weatherDescriptions: string[];

  @Field(() => Int)
  @Prop()
  windSpeed: number;

  @Field(() => Int)
  @Prop()
  windDegree: number;

  @Field()
  @Prop()
  windDir: string;

  @Field(() => Int)
  @Prop()
  pressure: number;

  @Field(() => Int)
  @Prop()
  precip: number;

  @Field(() => Int)
  @Prop()
  humidity: number;

  @Field(() => Int)
  @Prop()
  cloudcover: number;

  @Field(() => Int)
  @Prop()
  feelslike: number;

  @Field(() => Int)
  @Prop()
  uvIndex: number;

  @Field(() => Int)
  @Prop()
  visibility: number;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
