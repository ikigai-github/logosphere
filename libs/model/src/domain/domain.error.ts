/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogosphereError } from '../errors';

export const messages = Object.freeze({
  RESULT_SUCCESS_AND_ERROR:
    'InvalidOperation: A result cannot be successful and contain an error',
  RESULT_FAILURE_NO_ERROR:
    'InvalidOperation: A failing result needs to contain an error message',
  RESULT_FAILURE_AND_VALUE:
    "Can't get the value of an error result. Use 'errorValue' instead.",
});

export class DomainError extends LogosphereError {}
