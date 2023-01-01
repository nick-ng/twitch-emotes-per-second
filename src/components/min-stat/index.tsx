import { useOptions } from "../../hooks/options-context";

import OneStat from "./one-stat";

export default function MinIV() {
  const {
    options: { minIVs, minIVMaxShow },
    setOptions,
  } = useOptions();

  return (
    <div>
      <h2>Minimum Stat</h2>
      <label>
        Max IV to Show:{" "}
        <input
          className="w-12 rounded border border-gray-300 text-right dark:bg-gray-800"
          value={minIVMaxShow}
          min={0}
          max={31}
          type="number"
          onChange={(e) => {
            const temp = parseInt(e.target.value, 10);
            setOptions({
              minIVMaxShow: Math.min(Math.max(0, temp), 31),
            });
          }}
        />
      </label>
      <div>
        {minIVs.map(({ id, note, baseStat, level, nature, catchLevel }, i) => (
          <OneStat
            key={id}
            id={id}
            note={note}
            baseStat={baseStat}
            level={level}
            nature={nature}
            catchLevel={catchLevel}
            maxIV={minIVMaxShow}
            onUpdate={(newPokemon) => {
              const temp = [...minIVs];
              temp[i] = newPokemon;
              setOptions({ minIVs: temp });
            }}
            onRemove={() => {
              setOptions({
                minIVs: minIVs.filter((pokemon) => pokemon.id !== id),
              });
            }}
            onDuplicate={(newCatchLevel) => {
              const temp = [...minIVs];
              temp.splice(i + 1, 0, {
                id: `${Date.now()}-${minIVs.length}`,
                note: `${note} (${newCatchLevel})`,
                baseStat,
                level,
                nature,
                catchLevel: newCatchLevel,
              });
              setOptions({ minIVs: temp });
            }}
          />
        ))}
        <button
          className="my-1 rounded-lg border border-gray-500 p-2 align-top"
          onClick={() => {
            setOptions({
              minIVs: [
                ...minIVs,
                {
                  id: `${Date.now()}-${minIVs.length}`,
                  note: `New ${minIVs.length + 1}`,
                  baseStat: 50,
                  level: 50,
                  nature: 0.9,
                  catchLevel: 50,
                },
              ],
            });
          }}
        >
          New Pokemon
        </button>
      </div>
      <p className="max-w-2xl">
        Since Pokemon are leveled to 50 for VGC battles, you often don't need
        your Pokemon's Speed or Attack IV to be exactly 0.
      </p>
      <p className="max-w-2xl">
        This shows you what stat range your caught Pokemon need to have in order
        to have the minimum Atk/Spe/etc. stat at level 50.
      </p>
      <details>
        <summary>Tips</summary>
        <p>
          If the Pokemon you're catching have a range of levels, you can create
          multiple Pokemon with different catch levels.
        </p>
      </details>
    </div>
  );
}
