import { useOptions } from "../../hooks/options-context";

import Stopwatch from "./stopwatch";

export default function Stopwatches() {
  const { options, setOptions } = useOptions();

  const { stopwatches, stopwatchFontSizePt } = options;
  return (
    <div>
      <h2>Stopwatches</h2>
      {stopwatches.map((stopwatch, i) => (
        <Stopwatch
          key={stopwatch.id}
          stopwatch={stopwatch}
          timerFontSize={stopwatchFontSizePt}
          onChange={(newStopwatch) => {
            const temp = [...stopwatches];
            temp.splice(i, 1, newStopwatch);
            setOptions({ stopwatches: temp });
          }}
          onDelete={() => {
            setOptions({
              stopwatches: stopwatches.filter((s) => s.id !== stopwatch.id),
            });
          }}
        />
      ))}
      <button
        className="mx-1 my-2 rounded-lg border border-gray-500 p-1 align-top"
        onClick={() => {
          setOptions({
            stopwatches: stopwatches.concat([
              {
                id: `stopwatch-${Date.now()}-${stopwatches.length}`,
                name: `Stopwatch ${stopwatches.length + 1}`,
                startTimeMS: 0,
                pausedMS: 0,
                isRunning: false,
                bars: [
                  {
                    id: `bar-${Date.now()}-${stopwatches.length}-0`,
                    durationMS: 60 * 1000,
                    name: "1 minute",
                  },
                  {
                    id: `bar-${Date.now()}-${stopwatches.length}-1`,
                    durationMS: 30 * 60 * 1000,
                    name: "30 minutes",
                  },
                ],
              },
            ]),
          });
        }}
      >
        New Stopwatch
      </button>
      <label className="block">
        Timer Size:{" "}
        <input
          className="w-16"
          type="number"
          value={stopwatchFontSizePt}
          onChange={(e) => {
            let temp = parseFloat(e.target.value);

            if (isNaN(temp)) {
              temp = 0;
            }

            setOptions({ stopwatchFontSizePt: temp });
          }}
        />
      </label>
      <button
        className="mx-1 my-2 rounded-lg border border-gray-500 p-1 align-top"
        onClick={() => {
          setOptions({
            stopwatchFontSizePt: Math.floor(stopwatchFontSizePt * 0.9),
          });
        }}
      >
        Smaller
      </button>
      <button
        className="mx-1 my-2 rounded-lg border border-gray-500 p-1 align-top"
        onClick={() => {
          setOptions({
            stopwatchFontSizePt: Math.ceil(stopwatchFontSizePt * 1.1),
          });
        }}
      >
        Bigger
      </button>
    </div>
  );
}
