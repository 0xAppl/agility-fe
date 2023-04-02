export const shortenWalletAddress = (address: string = '') => {
  return address.slice(0, 6) + '...' + address.slice(-4);
};

export const addingOnGoingAffix = (verb: string) => {
  return `${verb.endsWith('e') ? verb.slice(0, -1) : verb}ing`;
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
