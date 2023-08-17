export class AsyncServiceError extends Error {
  name: 'AsyncServiceError';
  constructor(message: string) {
    super(message);
  }
}
