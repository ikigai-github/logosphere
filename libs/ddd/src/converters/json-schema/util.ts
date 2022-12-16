export const hasKey = <T>(obj: any, key: keyof T, type: string): obj is T => {
  const castObj = obj as T;

  if (castObj[key] !== undefined && typeof castObj[key] === type) {
    return true;
  }

  return false;
};
