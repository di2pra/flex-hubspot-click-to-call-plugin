/**
 * Retrieve a random value.
 * @constructor
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 */
export const random: (min: number, max: number) => number = (min: number = 0, max: number = 100) => Math.floor(Math.random() * (max - min)) + min;