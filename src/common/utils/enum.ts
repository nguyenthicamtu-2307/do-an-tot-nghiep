export const isEnumKey = <T>(enumType: T, key: string): boolean => {
  return Object.keys(enumType as object).includes(key);
};

export const isEnumValue = <T>(enumType: T, value: string): boolean => {
  return Object.values(enumType as object).includes(value);
};

export const keyToEnum = <T>(enumType: T, key: string): T[keyof T] => {
  const entry = Object.entries(enumType as object).find((x) => x[0] === key);

  if (!entry) {
    throw new Error(`invalid enum key ${key} of ${enumType}`);
  }

  return enumType[entry[0] as keyof T];
};

export const valueToEnum = <T>(enumType: T, value: string): T[keyof T] => {
  const entry = Object.entries(enumType as object).find((x) => x[1] === value);

  if (!entry) {
    throw new Error(`invalid enum value ${value} of  ${enumType}`);
  }

  return enumType[entry[0] as keyof T];
};
