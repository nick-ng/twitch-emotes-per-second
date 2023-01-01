import localforage from "localforage";

import { MoveInfo, PokedexEntry, PokedexEntrySchema } from "../../schemas";
import {
  MoveInfoSchema,
  RawMoveInfoSchema,
  RawPokemonInfoSchema,
} from "../../schemas";
import { getMove } from "./moves";
import { getPokemon } from "./pokemon";

const getSafeName = (moveName: string) =>
  moveName.replace(" ", "-").toLowerCase();

export const getMoveByName = async (
  moveName: string
): Promise<MoveInfo | null> => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/move/${getSafeName(moveName)}`
    );

    if (res.status !== 200) {
      console.warn(`Error when looking for move ${moveName}`, res.status);
      return null;
    }

    const rawMoveInfo = await res.json();

    const result = RawMoveInfoSchema.safeParse(rawMoveInfo);

    if (!result.success) {
      return null;
    }

    const { damage_class, power, type } = result.data;

    return {
      name: moveName,
      damageClass: damage_class.name,
      power,
      type: type.name,
    };
  } catch (e: any) {
    console.error(e);
  }

  return null;
};

export const getMoveByNameWithCache = async (
  moveName: string
): Promise<MoveInfo | null> => {
  const tempMove = getMove(moveName);

  if (tempMove) {
    return tempMove;
  }

  const moveDBKey = `move-${getSafeName(moveName)}`;
  try {
    const tempMove = await localforage.getItem(moveDBKey);

    const result = MoveInfoSchema.safeParse(tempMove);

    if (result.success) {
      return result.data;
    }
  } catch (e) {
    console.error(`error when fetching move ${moveName}`, e);
  }

  const moveInfo = await getMoveByName(moveName);

  localforage.setItem(moveDBKey, moveInfo);

  return moveInfo;
};

export const getMovesByName = async (
  movesArray: string[]
): Promise<MoveInfo[]> => {
  const moves: MoveInfo[] = [];
  for (const moveName of movesArray) {
    const moveInfo = await getMoveByNameWithCache(moveName);

    if (moveInfo) {
      moves.push(moveInfo);
    }
  }

  return moves;
};

export const getPokemonByName = async (
  name: string
): Promise<PokedexEntry | null> => {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${getSafeName(name)}`
    );

    if (res.status !== 200) {
      console.warn(`Error when looking for Pokemon ${name}`, res.status);
      return null;
    }

    const rawPokemonInfo = await res.json();

    const result = RawPokemonInfoSchema.safeParse(rawPokemonInfo);

    if (!result.success) {
      return null;
    }

    const { abilities, stats, types } = result.data;

    const pokemon: PokedexEntry = {
      name,
      abilities: [],
      hiddenAbility: null,
      types: [],
      baseStats: {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0,
      },
    };

    abilities
      .sort((a, b) => a.slot - b.slot)
      .forEach((ability) => {
        if (ability.is_hidden) {
          pokemon.hiddenAbility = ability.ability.name;
          return;
        }

        pokemon.abilities.push(ability.ability.name);
      });

    types
      .sort((a, b) => a.slot - b.slot)
      .forEach((type) => {
        pokemon.types.push(type.type.name);
      });

    stats.forEach((stat) => {
      switch (stat.stat.name) {
        case "hp":
          pokemon.baseStats.hp = stat.base_stat;
          return;
        case "attack":
          pokemon.baseStats.atk = stat.base_stat;
          return;
        case "defense":
          pokemon.baseStats.def = stat.base_stat;
          return;
        case "special-attack":
          pokemon.baseStats.spa = stat.base_stat;
          return;
        case "special-defense":
          pokemon.baseStats.spd = stat.base_stat;
          return;
        case "speed":
          pokemon.baseStats.spe = stat.base_stat;
      }
    });

    return pokemon;
  } catch (e: any) {
    console.error(e);
  }

  return null;
};

export const getPokemonByNameWithCache = async (
  name: string
): Promise<PokedexEntry | null> => {
  const tempPokemon = getPokemon(name);

  if (tempPokemon) {
    return tempPokemon;
  }

  const pokemonDBKey = `pokemon-${getSafeName(name)}`;
  try {
    const tempPokemon = await localforage.getItem(pokemonDBKey);

    const result = PokedexEntrySchema.safeParse(tempPokemon);

    if (result.success) {
      return result.data;
    }
  } catch (e) {
    console.error(`error when fetching Pokemon ${name}`, e);
  }

  const pokemonInfo = await getPokemonByName(name);

  localforage.setItem(pokemonDBKey, pokemonInfo);

  return pokemonInfo;
};
