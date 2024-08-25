
/* eslint-disable @typescript-eslint/no-explicit-any */
class AppError extends Error {
  public statusCode: number;
  public data: any;

  constructor(statusCode: number, message: string, data: any = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;