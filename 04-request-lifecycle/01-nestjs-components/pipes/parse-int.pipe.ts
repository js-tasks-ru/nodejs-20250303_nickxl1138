import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const valueToNumber = parseInt(value, 10);
    if (isNaN(valueToNumber)) {
      throw new BadRequestException(`"${value}" не является числом`);
    }
    return valueToNumber;
  }
}
