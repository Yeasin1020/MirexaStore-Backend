// errors/ApiError.ts
class ApiError extends Error {
	statusCode: number;
	isOperational: boolean;
	errorMessages: { path: string; message: string }[];

	constructor(statusCode: number, message: string, errorMessages: { path: string; message: string }[] = []) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = true;
		this.errorMessages = errorMessages;

		Error.captureStackTrace(this, this.constructor);
	}
}

export default ApiError;
