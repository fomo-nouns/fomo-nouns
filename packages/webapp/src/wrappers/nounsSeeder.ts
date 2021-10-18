import { provider } from '../config';
import { Contract } from 'ethers';

const address: string = '0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515';

const abi: string = '[{"inputs":[{"internalType":"uint256","name":"nounId","type":"uint256"},{"internalType":"contract INounsDescriptor","name":"descriptor","type":"address"}],"name":"generateSeed","outputs":[{"components":[{"internalType":"uint48","name":"background","type":"uint48"},{"internalType":"uint48","name":"body","type":"uint48"},{"internalType":"uint48","name":"accessory","type":"uint48"},{"internalType":"uint48","name":"head","type":"uint48"},{"internalType":"uint48","name":"glasses","type":"uint48"}],"internalType":"struct INounsSeeder.Seed","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}]';

export const contract = new Contract(address, abi, provider);