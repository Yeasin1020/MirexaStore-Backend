
// /* eslint-disable @typescript-eslint/no-explicit-any */
// class AppError extends Error {
//   public statusCode: number;
//   public data: any;

//   constructor(statusCode: number, message: string, data: any = [], stack = '') {
//     super(message);
//     this.statusCode = statusCode;
//     this.data = data;

//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// export default AppError;

class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public data: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(statusCode: number, message: string, data: any = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Assuming this is an operational error (you can add logic to distinguish between operational and programmer errors)
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
