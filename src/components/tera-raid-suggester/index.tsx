import { useEffect, useState } from "react";

import { PokemonTypeSchema, TeraRaidPokemon } from "../../schemas";

import { useOptions } from "../../hooks/options-context";
import { TeraRaidArraySchema } from "../../schemas";
import { POKEMON_TYPES } from "../../constants";
import { capFirst } from "../../utils";
import MatchupDetails from "./matchup-details";
import YourPokemon from "./your-pokemon";

const fetchRaidJSON = async (url: string) => {
  try {
    const res6 = await fetch(url);
    const resJSON6 = await res6.json();
    const tempPokemon6 = TeraRaidArraySchema.parse(resJSON6);

    return tempPokemon6;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export default function TeraRaidSuggester() {
  const { options, setOptions } = useOptions();

  const { raidYourPokemon, raidTeraType, raidAttackAdjustment } = options;

  const [raidPokemon, setRaidPokemon] = useState<TeraRaidPokemon[]>([]);
  const [raidFilter, setRaidFilter] = useState("");

  useEffect(() => {
    (async () => {
      const raids = await Promise.all([
        fetchRaidJSON("/serebii-6-star-raid.json"),
        fetchRaidJSON("/serebii-5-star-raid.json"),
        fetchRaidJSON("/serebii-4-star-raid.json"),
      ]);

      setRaidPokemon(raids.flat());
    })();
  }, []);

  return (
    <div>
      <details>
        <summary className="text-xl">Your Pokemon</summary>
        <div>
          {raidYourPokemon.map((yp, i) => (
            <YourPokemon
              key={yp.id}
              yourRaidPokemon={yp}
              onChange={(newPokemon) => {
                const temp = [...raidYourPokemon];
                temp[i] = newPokemon;
                setOptions({ raidYourPokemon: temp });
              }}
              onDelete={() => {
                setOptions({
                  raidYourPokemon: raidYourPokemon.filter(
                    (a) => a.id !== yp.id
                  ),
                });
              }}
            />
          ))}
          <button
            className="m-1 rounded-lg border border-gray-500 p-2 align-top"
            onClick={() => {
              setOptions({
                raidYourPokemon: raidYourPokemon.concat({
                  id: `pokemon-${Date.now()}-${raidYourPokemon.length}`,
                  pokemon: {
                    name: `Pokemon ${raidYourPokemon.length + 1}`,
                    types: ["normal"],
                    teraType: "normal",
                    ability: "n/a",
                    finalStats: {
                      hp: 0,
                      atk: 0,
                      def: 0,
                      spa: 0,
                      spd: 0,
                      spe: 0,
                    },
                  },
                  mainMoves: [
                    {
                      id: `move-${Date.now()}-0`,
                      name: "Move 1",
                      damageClass: "physical",
                      power: 80,
                      type: "normal",
                    },
                  ],
                }),
              });
            }}
          >
            Add Pokemon
          </button>
        </div>
      </details>
      <h2>Raid Pokemon</h2>
      <div className="inline-block">
        <label className="flex justify-between">
          <span className="mr-1">Tera Type:</span>
          <select
            value={raidTeraType}
            onChange={(e) => {
              setOptions({
                raidTeraType: PokemonTypeSchema.parse(e.target.value),
              });
            }}
          >
            {POKEMON_TYPES.map((t) => {
              return (
                <option key={t} value={t}>
                  {capFirst(t)}
                </option>
              );
            })}
          </select>
        </label>
        <label className="flex justify-between">
          <span className="mr-1">Attack Adjustment:</span>
          <input
            className="w-14"
            type="number"
            value={raidAttackAdjustment}
            onChange={(e) => {
              setOptions({ raidAttackAdjustment: parseInt(e.target.value) });
            }}
          />
        </label>
        <label className="flex justify-between">
          <span className="mr-1">Filter:</span>
          <input
            type="text"
            value={raidFilter}
            onChange={(e) => {
              setRaidFilter(e.target.value);
            }}
          />
        </label>
      </div>
      <div>
        {raidPokemon
          .filter(
            (r) =>
              !raidFilter ||
              r.pokemon.toLowerCase().includes(raidFilter.toLowerCase())
          )
          .map((p) => (
            <MatchupDetails
              key={p.id}
              pokemon={p.pokemon}
              moves={p.moves}
              raidStars={p.stars}
              raidTeraType={raidTeraType}
              yourPokemon={raidYourPokemon}
              attackAdjustment={raidAttackAdjustment}
            />
          ))}
      </div>
    </div>
  );
}
