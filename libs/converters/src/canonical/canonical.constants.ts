// TODO: improve type system in canonical schema
// https://ikigai-technologies.atlassian.net/browse/LOG-190

export const types = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  ANY: 'any',
};

export const constants = {
  URL_REGEX:
    '(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})',
};
