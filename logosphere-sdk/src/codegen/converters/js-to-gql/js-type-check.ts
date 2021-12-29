/**
 * check that an unknown object has a required field of type string[]
 */
export const has_required = (obj: unknown): obj is { required: string[] } => {
  const castObj = obj as { required: string[] };
  if (castObj) {
    return (
      typeof castObj.required === "object" &&
      castObj.required.every((item) => typeof item === "string")
    );
  }

  return false;
};

export const has_minItems = (obj: unknown): obj is { minItems: number } =>
  has_key(obj, "minItems", "number");

export const has_maxItems = (obj: unknown): obj is { maxItems: number } =>
  has_key(obj, "maxItems", "number");

export const has_primaryKey = (obj: unknown): obj is { primaryKey: string } =>
  has_key(obj, "primaryKey", "boolean");

export const has_examples = (obj: unknown): obj is { examples: unknown } =>
  has_key(obj, "examples", "object");

export const has_properties = (obj: unknown): obj is { properties: unknown } =>
  has_key(obj, "properties", "object");

export const has_enum = (obj: unknown): obj is { enum: string[] } =>
  has_key(obj, "enum", "object");

export const has_id = (obj: unknown): obj is { id: unknown } =>
  has_key(obj, "id", "object");

export const has_items = (obj: unknown): obj is { items: unknown } =>
  has_key(obj, "items", "object");

export const has_type = (obj: unknown): obj is { type: string } =>
  has_key(obj, "type", "string");

export const has_$ref = (obj: unknown): obj is { $ref: string } =>
  has_key(obj, "$ref", "string");

export const has_key = <T>(
  obj: unknown,
  key: keyof T,
  type: string
): obj is T => {
  const castObj = obj as T;

  if (castObj[key] !== undefined && typeof castObj[key] === type) {
    return true;
  }

  return false;
};
