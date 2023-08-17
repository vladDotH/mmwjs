export class ControllersCollisionError extends Error {
  name: 'ControllersCollisionError';
  constructor(message: string) {
    super(message);
  }
}
