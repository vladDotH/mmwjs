import { createPipe } from '../index';
import createHttpError from 'http-errors';
import { isInteger, toLower } from 'lodash';

export function parseIntPipe(radix = 10) {
  return createPipe((val: string) => parseInt(val, radix)).add((val) => {
    if (isInteger(val)) throw createHttpError(400, 'Parse int pipe error');
    return val;
  });
}

export function parseFloatPipe() {
  return createPipe(parseFloat).add((val) => {
    if (!isFinite(val)) throw createHttpError(400, 'Parse float pipe error');
    return val;
  });
}

export function parseBoolPipe() {
  return createPipe(toLower).add((val) => {
    if (val === 'true') return true;
    else if (val === 'false') return false;
    else throw createHttpError(400, 'Parse bool pipe error');
  });
}

export function parseArrayPipe() {
  /**/
}

export function parseUUIDPipe() {
  /**/
}

export function parseEnumPipe() {
  /**/
}

export function parseFilePipe() {
  /**/
}

export function defaultValuePipe() {
  /**/
}
