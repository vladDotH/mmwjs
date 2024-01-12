import { Controller } from './controller.interface';
import { Route } from '../route';
import { isString } from 'lodash';

export function pathExists(controller: Controller, route: Route): boolean;
export function pathExists(controller: Controller, path: string): boolean;
export function pathExists(
  controller: Controller,
  path: string,
  method: string,
): boolean;

export function pathExists(
  controller: Controller,
  routeOrPath: Route | string,
  method?: string,
): boolean {
  if (isString(routeOrPath)) {
    if (isString(method))
      return !!controller.router.match(routeOrPath, method).pathAndMethod
        .length;
    else return !!controller.router.match(routeOrPath, undefined).path.length;
  } else if ('method' in routeOrPath) {
    return !!controller.router.match(
      `${controller.path}${routeOrPath.path}`,
      routeOrPath.method.toUpperCase(),
    ).pathAndMethod.length;
  }
}
