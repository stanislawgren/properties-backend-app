import { Field, InputType } from "@nestjs/graphql";
import { SortOrder } from "src/enums/sort-order.enum";

@InputType()
export class PropertyFilterInput {
  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  zipCode?: string;

  @Field({ nullable: true })
  state?: string;

  @Field(() => SortOrder, { nullable: true })
  sortByDate?: SortOrder;
}
