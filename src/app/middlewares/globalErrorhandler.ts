
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { ErrorRequestHandler } from 'express';
import { TErrorSources } from '../interface/error';
import { ZodError } from 'zod';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import AppError from '../errors/AppError';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let data: any[] = [];
  let errorMessages: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];

  try {
    if (err instanceof ZodError) {
      const simplifiedError = handleZodError(err);
      statusCode = 400;
      message = simplifiedError?.message;
      errorMessages = simplifiedError?.errorSources;
    } else if (err?.name === 'ValidationError') {
      const simplifiedError = handleValidationError(err);
      statusCode = 400;
      message = simplifiedError?.message || 'Validation error';
      errorMessages = simplifiedError?.errorSources || [
        { path: '', message: 'Validation error' },
      ];
    } else if (err?.name === 'CastError') {
      const simplifiedError = handleCastError(err);
      statusCode = 400;
      message = simplifiedError?.message || 'Cast error';
      errorMessages = simplifiedError?.errorSources || [
        { path: '', message: 'Cast error' },
      ];
    } else if (err?.code === 11000) {
      const simplifiedError = handleDuplicateError(err);
      statusCode = 400;
      message =
        simplifiedError?.message ||
        `E11000 duplicate key error collection: ${err?.collection?.name} index: ${Object.keys(err?.keyPattern).join('_')} dup key: ${JSON.stringify(err?.keyValue)}`;
      errorMessages = simplifiedError?.errorSources || [
        { path: '', message: message },
      ];
    } else if (err instanceof AppError) {
      statusCode = err?.statusCode;
      message = err?.message;

      if (message === 'No Data Found') {
        return res.status(statusCode).json({
          success: false,
          statusCode,
          message: 'No Data Found',
          data: [],
        });
      }
    } else if (err instanceof Error) {
      message = err.message;
      errorMessages = [
        {
          path: '',
          message: err?.message,
        },
      ];
    }
  } catch (error) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  const response: any = {
    success: false,
    message,
    errorMessages,
  };

  if (config.NODE_ENV === 'development' || config.NODE_ENV === 'production') {
    response.stack = err.stack;
  }

  // Send response
  return res.status(statusCode).json(response);
};
export default globalErrorHandler;