import { LogosphereError } from '../errors';

export const messages = Object.freeze({
  INVALID_FORMAT: 'Invalid configuration file format'
});

export class ConfigurationError extends LogosphereError {}