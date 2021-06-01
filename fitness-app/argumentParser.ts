export const parseArguments = (args: Array<string>, minLength = 2): Array<number> => {
  if (args.length < minLength) throw new Error('Too few arguments');

  for (const arg of args) {
    if (isNaN(Number(arg))) {
      throw new Error('Arguments are not numbers!');
    }
  }

  return args.map(num => Number(num));
};
