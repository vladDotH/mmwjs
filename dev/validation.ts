import { IsNumber, IsString } from 'class-validator';
import Joi from 'joi';

export class ClassSchema {
  @IsNumber()
  a: number;
  @IsString()
  b: string;
}

export interface JoiType {
  a: number;
  b: string;
}

export const JoiSchema = Joi.object({
  a: Joi.number().required(),
  b: Joi.string().required(),
});
