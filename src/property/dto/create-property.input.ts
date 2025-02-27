import { InputType, Field, Int } from "@nestjs/graphql";
import { Matches } from "class-validator";

@InputType()
export class CreatePropertyInput {
  @Field()
  city: string;

  @Field()
  street: string;

  @Field()
  state: string;

  @Field()
  @Matches(/^\d{5}$/, { message: "ZipCode should be 5 digits." })
  zipCode: string;
}
