export class ControllersCollisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ControllersCollisionError';
  }
}
