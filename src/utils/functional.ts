export const pipe = (...fns: Array<(...args: any[]) => any>) => {
  return (...args: any[]) => {
    return fns.reduce((acc, fn) => fn(acc), args);
  };
};
