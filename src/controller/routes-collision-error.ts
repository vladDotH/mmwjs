export class RoutesCollisionError extends Error {
  name: 'RoutesCollisionError';
  constructor(message: string) {
    super(message);
  }
}
