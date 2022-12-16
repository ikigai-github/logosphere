import { LogosphereError } from '../errors';

export const messages = Object.freeze({
  INVALID_FORMAT: 'Invalid configuration file format',
  INCORRECT_MODULE_NAME:
    'Incorrect module name in the module configuration file',
});

export class ConfigurationError extends LogosphereError {}
