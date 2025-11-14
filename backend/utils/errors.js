/**
 * Custom error classes for better error handling
 */

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message = 'Validation error', details = {}) {
    super(message);
    this.statusCode = 400;
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class BadRequestError extends Error {
  constructor(message = 'Bad request') {
    super(message);
    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}

