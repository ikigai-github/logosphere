export class LogosphereError extends Error {
  constructor(message: string, error?: any) {
    super(message);

    const messageDetails =
      error && error.data && error.data.message
        ? error.data.message
        : error && error.message
        ? error.message
        : '';
    this.message = `${message}${messageDetails ? ': ' + messageDetails : ''}`;
  }
}
