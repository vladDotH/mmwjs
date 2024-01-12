import { createPipe, Pipe } from '../index';
import { BadRequest } from 'http-errors';
import { isInteger, toLower, values } from 'lodash';

export function createParseIntPipe(radix = 10) {
  return createPipe(toString)
    .add((val) => parseInt(val, radix))
    .add((val) => {
      if (isInteger(val)) throw new BadRequest('Parse int pipe error');
      return val;
    });
}

export function createParseFloatPipe() {
  return createPipe(toString)
    .add(parseFloat)
    .add((val) => {
      if (!isFinite(val)) throw new BadRequest('Parse float pipe error');
      return val;
    });
}

export function createParseBoolPipe() {
  return createPipe(toString)
    .add((val) => toLower(val.toString()))
    .add((val) => {
      if (val === 'true') return true;
      else if (val === 'false') return false;
      else throw new BadRequest('Parse bool pipe error');
    });
}

export function createDefaultValuePipe<T>(defaultVal: T) {
  return createPipe((val) => val ?? defaultVal) as Pipe<unknown, T>;
}

export function createParseEnumPipe<E>(en: E) {
  return createPipe((val) => {
    if (values(en).includes(val)) return val;
    else throw new BadRequest('Parse enum pipe error');
  }) as Pipe<unknown, E[keyof E]>;
}

export function createParseArrayPipe() {
  /**/
}

export function createParseFilePipe() {
  /**/
}
