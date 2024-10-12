import { BigNumberish } from '@ethersproject/bignumber';
import { NounSeed, NounData } from './types';
/**
 * Get encoded part and background information using a Noun seed
 * @param seed The Noun seed
 */
export declare const getNounData: (seed: NounSeed) => NounData;
/**
 * Generate a random Noun seed
 * @param seed The Noun seed
 */
export declare const getRandomNounSeed: () => NounSeed;
/**
 * Emulate bitwise right shift and uint cast
 * @param value A Big Number
 * @param shiftAmount The amount to right shift
 * @param uintSize The uint bit size to cast to
 */
export declare const shiftRightAndCast: (value: BigNumberish, shiftAmount: number, uintSize: number) => string;
/**
 * Emulates the NounsSeeder.sol methodology for pseudorandomly selecting a part
 * @param pseudorandomness Hex representation of a number
 * @param partCount The number of parts to pseudorandomly choose from
 * @param shiftAmount The amount to right shift
 * @param uintSize The size of the unsigned integer
 */
export declare const getPseudorandomPart: (pseudorandomness: string, partCount: number, shiftAmount: number, uintSize?: number) => number;
/**
 * Emulates the NounsSeeder.sol methodology for generating a Noun seed
 * @param nounId The Noun tokenId used to create pseudorandomness
 * @param blockHash The block hash use to create pseudorandomness
 */
export declare const getNounSeedFromBlockHash: (nounId: BigNumberish, blockHash: string) => NounSeed;
/**
 * Get encoded part information for one trait
 * @param partType The label of the part type to use
 * @param partIndex The index within the image data array of the part to get
 */
export declare const getPartData: (partType: string, partIndex: number) => string;
