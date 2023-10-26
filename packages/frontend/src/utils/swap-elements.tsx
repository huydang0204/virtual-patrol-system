type ArrayElement<T> = T extends (infer U)[] ? U : never;

type UpdateOrder<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Array<infer U> ? UpdateOrder<U>[] : T[K];
};

export const swapElements = <T extends Array<any>, P extends keyof ArrayElement<T>>(
  arr: T,
  index1: number,
  index2: number,
  sortPath?: P
): T => {
  if (index1 < 0 || index1 >= arr.length || index2 < 0 || index2 >= arr.length) {
    // Invalid indices, return the original array
    return arr;
  }

  const newArr = [...arr];
  [newArr[index1],
    newArr[index2]] = [newArr[index2],
    newArr[index1]];

  if (!!sortPath) {
    newArr.forEach((item, index) => {
      item[sortPath] = index + 1;
    });
  }

  return newArr as T;
};
