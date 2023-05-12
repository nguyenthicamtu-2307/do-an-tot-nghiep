import { Transform } from 'class-transformer';

export function ToBoolean(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string' && value) {
      if (
        value.toLowerCase() === 'y' ||
        value.toLowerCase() === 'yes' ||
        value.toLowerCase() === 'true' ||
        value.toLowerCase() === 't'
      )
        return true;
      if (
        value.toLowerCase() === 'n' ||
        value.toLowerCase() === 'no' ||
        value.toLowerCase() === 'false' ||
        value.toLowerCase() === 'f'
      )
        return false;

      return undefined;
    }
  });
}
