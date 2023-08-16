export class RoutesCollisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoutesCollisionError';
  }
}
