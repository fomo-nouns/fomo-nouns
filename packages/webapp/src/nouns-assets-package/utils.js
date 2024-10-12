"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPartData = exports.getNounSeedFromBlockHash = exports.getPseudorandomPart = exports.shiftRightAndCast = exports.getRandomNounSeed = exports.getNounData = void 0;
const solidity_1 = require("@ethersproject/solidity");
const bignumber_1 = require("@ethersproject/bignumber");
const image_data_json_1 = require("./image-data.json");
const { bodies, accessories, heads, glasses } = image_data_json_1.images;
/**
 * Get encoded part and background information using a Noun seed
 * @param seed The Noun seed
 */
const getNounData = (seed) => {
    return {
        parts: [
            bodies[seed.body],
            accessories[seed.accessory],
            heads[seed.head],
            glasses[seed.glasses],
        ],
        background: image_data_json_1.bgcolors[seed.background],
    };
};
exports.getNounData = getNounData;
/**
 * Generate a random Noun seed
 * @param seed The Noun seed
 */
const getRandomNounSeed = () => {
    return {
        background: Math.floor(Math.random() * image_data_json_1.bgcolors.length),
        body: Math.floor(Math.random() * bodies.length),
        accessory: Math.floor(Math.random() * accessories.length),
        head: Math.floor(Math.random() * heads.length),
        glasses: Math.floor(Math.random() * glasses.length),
    };
};
exports.getRandomNounSeed = getRandomNounSeed;
/**
 * Emulate bitwise right shift and uint cast
 * @param value A Big Number
 * @param shiftAmount The amount to right shift
 * @param uintSize The uint bit size to cast to
 */
const shiftRightAndCast = (value, shiftAmount, uintSize) => {
    const shifted = bignumber_1.BigNumber.from(value).shr(shiftAmount).toHexString();
    return `0x${shifted.substring(shifted.length - uintSize / 4)}`;
};
exports.shiftRightAndCast = shiftRightAndCast;
/**
 * Emulates the NounsSeeder.sol methodology for pseudorandomly selecting a part
 * @param pseudorandomness Hex representation of a number
 * @param partCount The number of parts to pseudorandomly choose from
 * @param shiftAmount The amount to right shift
 * @param uintSize The size of the unsigned integer
 */
const getPseudorandomPart = (pseudorandomness, partCount, shiftAmount, uintSize = 48) => {
    const hex = (0, exports.shiftRightAndCast)(pseudorandomness, shiftAmount, uintSize);
    return bignumber_1.BigNumber.from(hex).mod(partCount).toNumber();
};
exports.getPseudorandomPart = getPseudorandomPart;
/**
 * Emulates the NounsSeeder.sol methodology for generating a Noun seed
 * @param nounId The Noun tokenId used to create pseudorandomness
 * @param blockHash The block hash use to create pseudorandomness
 */
const getNounSeedFromBlockHash = (nounId, blockHash) => {
    const pseudorandomness = (0, solidity_1.keccak256)(['bytes32', 'uint256'], [blockHash, nounId]);
    return {
        background: (0, exports.getPseudorandomPart)(pseudorandomness, image_data_json_1.bgcolors.length, 0),
        body: (0, exports.getPseudorandomPart)(pseudorandomness, bodies.length, 48),
        accessory: (0, exports.getPseudorandomPart)(pseudorandomness, accessories.length, 96),
        head: (0, exports.getPseudorandomPart)(pseudorandomness, heads.length, 144),
        glasses: (0, exports.getPseudorandomPart)(pseudorandomness, glasses.length, 192),
    };
};
exports.getNounSeedFromBlockHash = getNounSeedFromBlockHash;
/**
 * Get encoded part information for one trait
 * @param partType The label of the part type to use
 * @param partIndex The index within the image data array of the part to get
 */
const getPartData = (partType, partIndex) => {
    const part = partType;
    return image_data_json_1.images[part][partIndex].data;
};
exports.getPartData = getPartData;
