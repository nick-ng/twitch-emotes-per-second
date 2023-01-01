import type { PokemonType } from "./schemas";
import { TYPE_MATCHUP } from "./constants";

export const capFirst = (s: string) => {
  const [firstLetter, ...otherLetters] = [...s];
  return [firstLetter.toUpperCase(), ...otherLetters].join("");
};

export const getTypeEffectiveness = (
  attackType: PokemonType,
  defenderTypes: PokemonType[]
) => {
  if (attackType === "typeless" || attackType === "none") {
    return 1;
  }

  const temp = TYPE_MATCHUP[attackType];

  const temp2 = defenderTypes.map((t) => {
    if (t === "typeless" || t === "none") {
      return 1;
    }

    return temp[t];
  });

  return temp2.reduce((prev, curr) => prev * curr, 1);
};

export const IV_RANGE = Object.freeze(
  new Array(32).fill(null).map((_, i) => i)
);

export const hpStat = (base: number, level = 50, iv = 31, ev = 0) => {
  const a = (2 * base + iv + Math.floor(ev / 4)) * level;
  return Math.floor(a / 100) + level + 10;
};

export const otherStat = (
  base: number,
  level = 50,
  iv = 31,
  ev = 0,
  nature = 1
) => {
  const a = (2 * base + (iv + Math.floor(ev / 4))) * level;
  const b = Math.floor(a / 100) + 5;
  return Math.floor(b * nature);
};

export const getMaxMinStatIV = (base: number, level = 50, nature = 1) => {
  const minStat = otherStat(base, level, 0, 0, nature);
  let maxIV = 0;
  for (const iv of IV_RANGE) {
    const tempStat = otherStat(base, level, iv, 0, nature);
    if (minStat < tempStat) {
      return maxIV;
    }
    maxIV = iv;
  }

  return maxIV;
};

// Taken from https://github.com/smogon/damage-calc
const OF32 = (number: number) => {
  return number;
};

const pokeRound = (num: number) => {
  return num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num);
};

export const getBaseDamage = (
  level: number,
  basePower: number,
  attack: number,
  defense: number
) => {
  return Math.floor(
    OF32(
      Math.floor(
        OF32(OF32(Math.floor((2 * level) / 5 + 2) * basePower) * attack) /
          defense
      ) /
        50 +
        2
    )
  );
};

export const damage = (
  power: number,
  atk: number,
  def: number,
  stab = 1,
  type = 1,
  level = 50,
  targets = 1,
  weather = 1,
  critical = 1,
  burn = 1,
  other = 1
) => {
  const base = getBaseDamage(level, power, atk, def);

  return [85, 100].map((x) => {
    const temp = Math.floor(OF32(base * x) / 100);

    const withStab = OF32(temp * stab);

    return Math.floor(OF32(pokeRound(withStab) * type));
  });
};
