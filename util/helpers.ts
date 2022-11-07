// Modified from official Lens example:
// https://github.com/lens-protocol/api-examples/blob/master/src/helpers.ts

import omitDeep from "omit-deep";

export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const omit = (object: any, name: string[]) => {
  return omitDeep(object, name);
};
