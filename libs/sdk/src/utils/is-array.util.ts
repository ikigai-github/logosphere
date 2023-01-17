/* eslint-disable @typescript-eslint/no-explicit-any */
export const isArray = (input: any[]) => {
  return Array.isArray(input) && input.length > 0;
};

export function isScalarArray(input: any[]): boolean {
  if (Array.isArray(input)) {
    let scalar = true;
    input.map((item: any) => {
      if (typeof item === 'object') scalar = false;
    });
    return scalar;
  } else {
    return false;
  }
}
