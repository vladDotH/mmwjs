export class AsyncServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AsyncServiceError';
  }
}
