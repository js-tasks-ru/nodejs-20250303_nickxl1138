import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinDate,
  MinLength,
} from "class-validator";
import getDefaultDeadline from "../../helpers/get-default-deadline";
import { Transform } from "class-transformer";

const MIN_DESCRIPTION_LENGTH = 4;
const MIN_PRIORITY_VALUE = 1;
const MAX_PRIORITY_VALUE = 3;
const MIN_DEADLINE_DATE = 2;

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_DESCRIPTION_LENGTH)
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  @Min(MIN_PRIORITY_VALUE)
  @Max(MAX_PRIORITY_VALUE)
  priority: number;

  @Transform(({ value }) => new Date(value))
  @IsOptional()
  @MinDate(getDefaultDeadline(MIN_DEADLINE_DATE))
  deadline: Date;
}
