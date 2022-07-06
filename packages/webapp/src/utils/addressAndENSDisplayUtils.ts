export const veryShortENS = (ens: string) => {
    return [ens.substring(0, 1), ens.substring(ens.length - 3, ens.length)].join('...');
};
  
export const veryShortAddress = (address: string) => {
    return [address.substring(0, 3), address.substring(address.length - 1, address.length)].join('...');
};
  
export const shortENS = (ens: string) => {
    if (ens.length < 15 || window.innerWidth > 480) {
      return ens;
    }
    return [ens.substring(0, 4), ens.substring(ens.length - 8, ens.length)].join('...');
};
  
export const shortAddress = (address: string) => {
    return address && [address.substring(0, 4), address.substring(address.length - 4, address.length)].join('...');
};