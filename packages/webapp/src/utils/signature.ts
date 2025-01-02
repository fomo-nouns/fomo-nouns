import { ethers } from 'ethers';

/**
 * Creates a simple message for the user to sign that can be easily verified server-side
 * The server can recover the signer's address from this signature using ecrecover
 * @param address The voter's Ethereum address
 * @param nounId The ID of the Noun being voted on
 */
export const createSignatureMessage = (address: string, nounId: string): string => {
  return `Authenticate FOMO Nouns voting for ${nounId} with ${address.toLowerCase()}`;
}; 