import { IV_RANGE, otherStat } from "../../utils";

const getHighestAcceptableIV = (
  baseStat: number,
  level: number,
  nature: number
) => {
  const minStat = otherStat(baseStat, level, 0, 0, nature);

  for (let iv = 1; iv < 32; iv++) {
    const tempStat = otherStat(baseStat, level, iv, 0, nature);
    if (tempStat > minStat) {
      return iv - 1;
    }
  }

  return 0;
};

interface MinIVProps {
  id: string;
  note: string;
  baseStat: number;
  level: number;
  nature: number;
  catchLevel: number;
  maxIV: number;
  onUpdate: (next: {
    id: string;
    note: string;
    baseStat: number;
    level: number;
    nature: number;
    catchLevel: number;
  }) => void | Promise<void>;
  onRemove: () => void | Promise<void>;
  onDuplicate: (newCatchLevel: number) => void | Promise<void>;
}

export default function OneIV({
  id,
  note,
  baseStat,
  level,
  nature,
  catchLevel,
  maxIV,
  onUpdate,
  onRemove,
  onDuplicate,
}: MinIVProps) {
  const minStat = otherStat(baseStat, level, 0, 0, nature);
  const highestAcceptableIV = getHighestAcceptableIV(baseStat, level, nature);

  const catchDecrease = {
    max: otherStat(baseStat, catchLevel, highestAcceptableIV, 0, 0.9),
    over: otherStat(baseStat, catchLevel, highestAcceptableIV + 1, 0, 0.9),
  };

  const catchDecreaseWarn =
    catchDecrease.max === catchDecrease.over ? catchDecrease.over : -1;

  const catchNeutral = {
    max: otherStat(baseStat, catchLevel, highestAcceptableIV, 0, 1),
    over: otherStat(baseStat, catchLevel, highestAcceptableIV + 1, 0, 1),
  };

  const catchNeutralWarn =
    catchNeutral.max === catchNeutral.over ? catchNeutral.over : -1;

  const catchIncrease = {
    max: otherStat(baseStat, catchLevel, highestAcceptableIV, 0, 1.1),
    over: otherStat(baseStat, catchLevel, highestAcceptableIV + 1, 0, 1.1),
  };

  const catchIncreaseWarn =
    catchIncrease.max === catchIncrease.over ? catchIncrease.over : -1;

  return (
    <div className="m-1 inline-block border border-gray-300 p-1 align-top">
      <input
        className="w-full rounded border border-gray-300 px-1 dark:bg-gray-800"
        type="text"
        value={note}
        onChange={(e) => {
          onUpdate({
            id,
            note: e.target.value,
            baseStat,
            level,
            nature,
            catchLevel,
          });
        }}
      />
      <label className="flex justify-between">
        <span>Base Stat:</span>
        <input
          className="w-14"
          type="number"
          value={baseStat}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              baseStat: parseInt(e.target.value),
              level,
              nature,
              catchLevel,
            });
          }}
        />
      </label>
      <label className="flex justify-between">
        <span>Nature:</span>
        <select
          onChange={(e) => {
            onUpdate({
              id,
              note,
              baseStat,
              level,
              nature: parseFloat(e.target.value),
              catchLevel,
            });
          }}
        >
          <option value={0.9}>Decrease</option>
          <option value={1}>Neutral</option>
          <option value={1.1}>Increase</option>
        </select>
      </label>
      <label className="flex justify-between">
        <span>Final Level:</span>
        <input
          className="w-14"
          type="number"
          value={level}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              baseStat,
              level: parseInt(e.target.value),
              nature,
              catchLevel,
            });
          }}
        />
      </label>
      <label className="flex justify-between">
        <span>Catch Level:</span>
        <input
          className="w-14"
          type="number"
          value={catchLevel}
          onChange={(e) => {
            onUpdate({
              id,
              note,
              baseStat,
              level,
              nature,
              catchLevel: parseInt(e.target.value),
            });
          }}
        />
      </label>
      <div className="flex justify-between">
        <button
          className="my-2 rounded-lg border border-gray-500 p-1"
          onClick={() => {
            if (confirm(`Remove ${note}?`)) {
              onRemove();
            }
          }}
        >
          Remove
        </button>
        <button
          className="my-2 rounded-lg border border-gray-500 p-1"
          onClick={() => {
            onDuplicate(catchLevel + 1);
          }}
        >
          Copy (Level {catchLevel + 1})
        </button>
      </div>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-500 px-1 py-0 text-right">IV</th>
            <th className="border border-gray-500 px-1 py-0 text-right">
              @{level}
            </th>
            <th className="border border-gray-500 px-1 py-0 text-right">
              @{catchLevel}-
            </th>
            <th className="border border-gray-500 px-1 py-0 text-right">
              @{catchLevel}
            </th>
            <th className="border border-gray-500 px-1 py-0 text-right">
              @{catchLevel}+
            </th>
          </tr>
        </thead>
        <tbody>
          {IV_RANGE.filter(
            (iv) => iv <= Math.max(maxIV, highestAcceptableIV + 1)
          ).map((iv) => {
            const stat = otherStat(baseStat, level, iv, 0, nature);
            const decreaseCatchStat = otherStat(
              baseStat,
              catchLevel,
              iv,
              0,
              0.9
            );
            const neutralCatchStat = otherStat(baseStat, catchLevel, iv, 0, 1);
            const increaseCatchStat = otherStat(
              baseStat,
              catchLevel,
              iv,
              0,
              1.1
            );
            return (
              <tr
                className={
                  stat === minStat ? "bg-blue-100 dark:bg-blue-900" : ""
                }
                key={iv}
              >
                <td className="border border-gray-500 px-1 py-0 text-right">
                  {iv}
                </td>
                <td className="border border-gray-500 px-1 py-0 text-right">
                  {stat}
                </td>
                <td
                  className={`border border-gray-500 px-1 py-0 text-right ${
                    decreaseCatchStat === catchDecreaseWarn
                      ? "bg-red-300 dark:bg-red-700"
                      : ""
                  }`}
                >
                  {decreaseCatchStat}
                </td>
                <td
                  className={`border border-gray-500 px-1 py-0 text-right ${
                    neutralCatchStat === catchNeutralWarn
                      ? "bg-red-300 dark:bg-red-700"
                      : ""
                  }`}
                >
                  {neutralCatchStat}
                </td>
                <td
                  className={`border border-gray-500 px-1 py-0 text-right ${
                    increaseCatchStat === catchIncreaseWarn
                      ? "bg-red-300 dark:bg-red-700"
                      : ""
                  }`}
                >
                  {increaseCatchStat}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
