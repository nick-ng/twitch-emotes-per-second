import { useEffect, useState } from "react";

import type {
  MoveInfo,
  PokedexEntry,
  YourRaidPokemon,
  PokemonStats,
  PokemonType,
} from "../../schemas";
import { PokemonTypeSchema } from "../../schemas";
import {
  getMovesByName,
  getPokemonByNameWithCache,
} from "../../services/pokedex";
import {
  capFirst,
  hpStat,
  otherStat,
  damage,
  getTypeEffectiveness,
} from "../../utils";

const getFromStars = (stars: number) => {
  switch (stars) {
    case 7:
      return { hpIncrease: 25, level: 100 };
    case 6:
      return { hpIncrease: 25, level: 90 };
    case 5:
      return { hpIncrease: 20, level: 75 };
    case 4:
    default:
      return { hpIncrease: 12, level: 45 };
  }
};

const moveDamage =
  (
    defenderStats: PokemonStats,
    defenderTypes: PokemonType[],
    attackerStats: PokemonStats,
    attackerTypes: PokemonType[],
    attackerTeraType: PokemonType,
    attackerLevel: number
  ) =>
  (move: MoveInfo) => {
    const { type, power, damageClass } = move;

    const actualType = PokemonTypeSchema.parse(
      (typeof type === "number"
        ? attackerTypes[type]
        : type === "tera"
        ? attackerTeraType
        : type) || "typeless"
    );

    if (damageClass === "status" || !power) {
      return 0;
    }

    let a = attackerStats.atk;
    let d = defenderStats.def;

    if (
      damageClass === "special" ||
      (damageClass === "both" && attackerStats.spa > attackerStats.atk)
    ) {
      a = attackerStats.spa;
      d = defenderStats.spd;
    }

    let stab = 1;
    if (attackerTeraType === type && attackerTypes.includes(attackerTeraType)) {
      stab = 2;
    } else if ([...attackerTypes, attackerTeraType].includes(actualType)) {
      stab = 1.5;
    }

    return Math.max(
      ...damage(
        power,
        a,
        d,
        stab,
        getTypeEffectiveness(actualType, defenderTypes),
        attackerLevel,
        1,
        1,
        1,
        1,
        1
      )
    );
  };

interface MatchupDetailsProps {
  pokemon: string;
  moves: string[];
  raidStars: number;
  raidTeraType: PokemonType;
  yourPokemon: YourRaidPokemon[];
  attackAdjustment?: number;
}

export default function MatchupDetails({
  pokemon,
  moves,
  raidStars,
  raidTeraType,
  yourPokemon,
  attackAdjustment,
}: MatchupDetailsProps) {
  const [moveDetails, setMoveDetails] = useState<MoveInfo[]>([]);
  const [pokemonDexEntry, setPokemonDexEntry] = useState<PokedexEntry | null>(
    null
  );
  const [finalStats, setFinalStats] = useState<PokemonStats>({
    hp: 10,
    atk: 10,
    def: 10,
    spa: 10,
    spd: 10,
    spe: 10,
  });

  const yourPokemonRatings: {
    id: string;
    description: string;
    attackRating: number;
    defenseRating: number;
    totalRating: number;
  }[] = yourPokemon.map((yp) => {
    const {
      id,
      mainMoves,
      pokemon: {
        name,
        finalStats: yFinalStats,
        types: yTypes,
        teraType: yTeraType,
      },
    } = yp;

    const description = `${name} - ${capFirst(yTeraType)}`;

    if (!pokemonDexEntry) {
      return {
        id,
        description,
        attackRating: 0,
        defenseRating: 0,
        totalRating: 0,
      };
    }

    const yourDamage = Math.max(
      ...mainMoves.map(
        moveDamage(
          finalStats,
          [raidTeraType],
          yFinalStats,
          yTypes,
          yTeraType,
          100
        )
      )
    );

    const raidDamage = Math.max(
      ...moveDetails.map(
        moveDamage(
          yFinalStats,
          yTypes,
          finalStats,
          pokemonDexEntry.types,
          raidTeraType,
          getFromStars(raidStars).level
        )
      )
    );

    const attackRating =
      (attackAdjustment || 100) / (finalStats.hp / yourDamage);
    const defenseRating = yFinalStats.hp / raidDamage;

    return {
      id,
      description,
      attackRating,
      defenseRating,
      totalRating: attackRating + defenseRating,
    };
  });

  useEffect(() => {
    (async () => {
      Promise.all([
        setMoveDetails(await getMovesByName(moves)),
        (async () => {
          const tempPokeDexEntry = await getPokemonByNameWithCache(pokemon);
          setPokemonDexEntry(tempPokeDexEntry);
          if (tempPokeDexEntry?.baseStats) {
            const { baseStats } = tempPokeDexEntry;
            const { hpIncrease, level } = getFromStars(raidStars) || 90;
            setFinalStats({
              hp: hpStat(baseStats.hp, level, 31, 0) * hpIncrease,
              atk: otherStat(baseStats.atk, level, 31, 0, 1),
              def: otherStat(baseStats.def, level, 31, 0, 1),
              spa: otherStat(baseStats.spa, level, 31, 0, 1),
              spd: otherStat(baseStats.spd, level, 31, 0, 1),
              spe: otherStat(baseStats.spe, level, 31, 0, 1),
            });
          }
        })(),
      ]);
    })();
  }, [moves.join(",")]);

  return (
    <div className="m-1 inline-block border border-gray-300 p-1 align-top">
      <h3 className="capitalize">
        {raidStars}⭐ {pokemon} - {raidTeraType}
      </h3>
      {pokemonDexEntry && (
        <div>
          {pokemonDexEntry.abilities.length === 1 ? "Ability:" : "Abilities:"}{" "}
          <span className="capitalize">
            {pokemonDexEntry.abilities
              .map((a) => a.replace("-", " "))
              .join(", ")}
          </span>
        </div>
      )}
      {pokemonDexEntry && (
        <div>
          Hidden Ability:{" "}
          <span className="capitalize">
            {pokemonDexEntry.hiddenAbility?.replace("-", " ") || "none"}
          </span>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th className="border border-gray-300 px-1 text-left">
              Your Pokemon
            </th>
            <th className="border border-gray-300 px-1 text-right">Attack</th>
            <th className="border border-gray-300 px-1 text-right">Defense</th>
            <th className="border border-gray-300 px-1 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {yourPokemonRatings
            .sort((a, b) => b.totalRating - a.totalRating)
            .map((yp) => (
              <tr key={yp.id}>
                <td className="border border-gray-300 px-1">
                  {yp.description}
                </td>
                <td className="border border-gray-300 px-1 text-right">
                  {yp.attackRating.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-1 text-right">
                  {yp.defenseRating.toFixed(2)}
                </td>
                <td className="border border-gray-300 px-1 text-right">
                  {(yp.attackRating + yp.defenseRating).toFixed(2)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
