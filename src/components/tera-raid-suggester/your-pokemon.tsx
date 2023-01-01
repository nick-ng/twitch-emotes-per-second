import type { YourRaidPokemon } from "../../schemas";
import { PokemonTypeSchema } from "../../schemas";
import { POKEMON_TYPES } from "../../constants";
import { capFirst } from "../../utils";

interface YourPokemonProps {
  yourRaidPokemon: YourRaidPokemon;
  onChange: (newRaidPokemon: YourRaidPokemon) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

export default function YourPokemon({
  yourRaidPokemon,
  onChange,
  onDelete,
}: YourPokemonProps) {
  const { pokemon } = yourRaidPokemon;
  const { name, finalStats, teraType, types } = pokemon;
  return (
    <div className="m-1 inline-block border border-gray-300 p-1 align-top">
      <div>
        <input
          className="inline-block rounded-r-none"
          type="text"
          value={name}
          onChange={(e) => {
            onChange({
              id: yourRaidPokemon.id,
              pokemon: {
                ...yourRaidPokemon.pokemon,
                name: e.target.value,
              },
              mainMoves: yourRaidPokemon.mainMoves,
            });
          }}
        />
        <button
          className="my-0.5 inline-block rounded-r border border-gray-300 bg-white px-2 dark:bg-gray-800"
          onClick={() => {
            if (confirm(`Really remove ${name}?`)) {
              onDelete();
            }
          }}
        >
          X
        </button>
      </div>
      <label className="flex justify-between">
        Type 1:{" "}
        <select
          value={types[0]}
          onChange={(e) => {
            const temp = [...yourRaidPokemon.pokemon.types];
            temp[0] = PokemonTypeSchema.parse(e.target.value);
            onChange({
              id: yourRaidPokemon.id,
              pokemon: {
                ...yourRaidPokemon.pokemon,
                types: temp,
              },
              mainMoves: yourRaidPokemon.mainMoves,
            });
          }}
        >
          {POKEMON_TYPES.map((t) => (
            <option key={t} value={t}>
              {capFirst(t)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex justify-between">
        Type 2:{" "}
        <select
          value={types.length > 1 ? types[1] : "none"}
          onChange={(e) => {
            let temp = [...yourRaidPokemon.pokemon.types];
            if (e.target.value === "none") {
              temp = [temp[0]];
            } else {
              if (temp.length === 1) {
                temp.push(PokemonTypeSchema.parse(e.target.value));
              } else {
                temp[1] = PokemonTypeSchema.parse(e.target.value);
              }
            }

            onChange({
              id: yourRaidPokemon.id,
              pokemon: {
                ...yourRaidPokemon.pokemon,
                types: temp,
              },
              mainMoves: yourRaidPokemon.mainMoves,
            });
          }}
        >
          {["none", ...POKEMON_TYPES].map((t) => (
            <option key={t} value={t}>
              {capFirst(t)}
            </option>
          ))}
        </select>
      </label>
      <label className="flex justify-between">
        Tera Type:{" "}
        <select
          value={teraType}
          onChange={(e) => {
            onChange({
              id: yourRaidPokemon.id,
              pokemon: {
                ...yourRaidPokemon.pokemon,
                teraType: PokemonTypeSchema.parse(e.target.value),
              },
              mainMoves: yourRaidPokemon.mainMoves,
            });
          }}
        >
          {POKEMON_TYPES.map((t) => (
            <option key={t} value={t}>
              {capFirst(t)}
            </option>
          ))}
        </select>
      </label>
      <div className="-mx-1 mt-1 block border-t border-t-gray-300 px-1 pt-1">
        <label className="flex justify-between">
          HP:{" "}
          <input
            className="w-14"
            type="number"
            value={finalStats.hp}
            onChange={(e) => {
              const temp = parseInt(e.target.value);
              if (isNaN(temp)) {
                return;
              }

              onChange({
                id: yourRaidPokemon.id,
                pokemon: {
                  ...yourRaidPokemon.pokemon,
                  finalStats: {
                    ...yourRaidPokemon.pokemon.finalStats,
                    hp: temp,
                  },
                },
                mainMoves: yourRaidPokemon.mainMoves,
              });
            }}
          />
        </label>
        <label className="flex justify-between">
          Atk:{" "}
          <input
            className="w-14 "
            type="number"
            value={finalStats.atk}
            onChange={(e) => {
              const temp = parseInt(e.target.value);
              if (isNaN(temp)) {
                return;
              }

              onChange({
                id: yourRaidPokemon.id,
                pokemon: {
                  ...yourRaidPokemon.pokemon,
                  finalStats: {
                    ...yourRaidPokemon.pokemon.finalStats,
                    atk: temp,
                  },
                },
                mainMoves: yourRaidPokemon.mainMoves,
              });
            }}
          />
        </label>
        <label className="flex justify-between">
          Def:{" "}
          <input
            className="w-14"
            type="number"
            value={finalStats.def}
            onChange={(e) => {
              const temp = parseInt(e.target.value);
              if (isNaN(temp)) {
                return;
              }

              onChange({
                id: yourRaidPokemon.id,
                pokemon: {
                  ...yourRaidPokemon.pokemon,
                  finalStats: {
                    ...yourRaidPokemon.pokemon.finalStats,
                    def: temp,
                  },
                },
                mainMoves: yourRaidPokemon.mainMoves,
              });
            }}
          />
        </label>
        <label className="flex justify-between">
          SpA:{" "}
          <input
            className="w-14"
            type="number"
            value={finalStats.spa}
            onChange={(e) => {
              const temp = parseInt(e.target.value);
              if (isNaN(temp)) {
                return;
              }

              onChange({
                id: yourRaidPokemon.id,
                pokemon: {
                  ...yourRaidPokemon.pokemon,
                  finalStats: {
                    ...yourRaidPokemon.pokemon.finalStats,
                    spa: temp,
                  },
                },
                mainMoves: yourRaidPokemon.mainMoves,
              });
            }}
          />
        </label>
        <label className="flex justify-between">
          SpD:{" "}
          <input
            className="w-14"
            type="number"
            value={finalStats.spd}
            onChange={(e) => {
              const temp = parseInt(e.target.value);
              if (isNaN(temp)) {
                return;
              }

              onChange({
                id: yourRaidPokemon.id,
                pokemon: {
                  ...yourRaidPokemon.pokemon,
                  finalStats: {
                    ...yourRaidPokemon.pokemon.finalStats,
                    spd: temp,
                  },
                },
                mainMoves: yourRaidPokemon.mainMoves,
              });
            }}
          />
        </label>
        <label className="flex justify-between">
          Spe:{" "}
          <input
            className="w-14"
            type="number"
            value={finalStats.spe}
            onChange={(e) => {
              const temp = parseInt(e.target.value);
              if (isNaN(temp)) {
                return;
              }

              onChange({
                id: yourRaidPokemon.id,
                pokemon: {
                  ...yourRaidPokemon.pokemon,
                  finalStats: {
                    ...yourRaidPokemon.pokemon.finalStats,
                    spe: temp,
                  },
                },
                mainMoves: yourRaidPokemon.mainMoves,
              });
            }}
          />
        </label>
      </div>
      <div className="-mx-1 mt-1 block border-t border-t-gray-300 px-1">
        <header>Moves</header>
        {yourRaidPokemon.mainMoves
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((move) => (
            <div
              className="-ml-1 mt-1 block border-t border-t-gray-300 px-1 pt-1"
              key={move.id}
            >
              <div>
                <input
                  className="inline-block rounded-r-none"
                  type="text"
                  value={move.name}
                  onChange={(e) => {
                    onChange({
                      id: yourRaidPokemon.id,
                      pokemon: yourRaidPokemon.pokemon,
                      mainMoves: yourRaidPokemon.mainMoves
                        .filter((mm) => mm.id !== move.id)
                        .concat({ ...move, name: e.target.value }),
                    });
                  }}
                />
                <button
                  className=" my-0.5 inline-block rounded-r border border-gray-300 bg-white px-2 dark:bg-gray-800"
                  onClick={() => {
                    onChange({
                      id: yourRaidPokemon.id,
                      pokemon: yourRaidPokemon.pokemon,
                      mainMoves: yourRaidPokemon.mainMoves.filter(
                        (mm) => mm.id !== move.id
                      ),
                    });
                  }}
                >
                  X
                </button>
              </div>
              <label className="flex justify-between">
                Power:{" "}
                <input
                  className="w-14"
                  type="number"
                  value={move.power || 0}
                  onChange={(e) => {
                    const temp = parseInt(e.target.value);
                    if (isNaN(temp)) {
                      return;
                    }

                    onChange({
                      id: yourRaidPokemon.id,
                      pokemon: yourRaidPokemon.pokemon,
                      mainMoves: yourRaidPokemon.mainMoves
                        .filter((mm) => mm.id !== move.id)
                        .concat({ ...move, power: temp }),
                    });
                  }}
                />
              </label>
              <label className="flex justify-between">
                Category:{" "}
                <select
                  value={move.damageClass}
                  onChange={(e) => {
                    onChange({
                      id: yourRaidPokemon.id,
                      pokemon: yourRaidPokemon.pokemon,
                      mainMoves: yourRaidPokemon.mainMoves
                        .filter((mm) => mm.id !== move.id)
                        .concat({
                          ...move,
                          damageClass: e.target.value as "physical" | "special",
                        }),
                    });
                  }}
                >
                  <option value="physical">Physical</option>
                  <option value="special">Special</option>
                </select>
              </label>
              <label className="flex justify-between">
                Type:{" "}
                <select
                  value={move.type}
                  onChange={(e) => {
                    onChange({
                      id: yourRaidPokemon.id,
                      pokemon: yourRaidPokemon.pokemon,
                      mainMoves: yourRaidPokemon.mainMoves
                        .filter((mm) => mm.id !== move.id)
                        .concat({
                          ...move,
                          type: PokemonTypeSchema.parse(e.target.value),
                        }),
                    });
                  }}
                >
                  {["none", ...POKEMON_TYPES].map((t) => (
                    <option key={t} value={t}>
                      {capFirst(t)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        <button
          className="mt-1 w-full rounded-lg border border-gray-500 p-2"
          onClick={() => {
            onChange({
              id: yourRaidPokemon.id,
              pokemon: yourRaidPokemon.pokemon,
              mainMoves: yourRaidPokemon.mainMoves.concat({
                id: `move-${Date.now()}-${yourRaidPokemon.mainMoves.length}`,
                damageClass:
                  finalStats.atk > finalStats.spa ? "physical" : "special",
                name: `Move ${yourRaidPokemon.mainMoves.length + 1}`,
                power: 80,
                type: "normal",
              }),
            });
          }}
        >
          Add Move
        </button>
      </div>
    </div>
  );
}
