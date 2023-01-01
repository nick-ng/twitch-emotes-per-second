import { useEffect, useRef, useState } from "react";

import type { Stopwatch as StopwatchType } from "../../schemas";

import { msToString } from "./utils";

type StopwatchProps = {
  stopwatch: StopwatchType;
  timerFontSize: number;
  onChange: (newStopwatch: StopwatchType) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
};

export default function Stopwatch({
  stopwatch,
  timerFontSize,
  onChange,
  onDelete,
}: StopwatchProps) {
  const { id, name, startTimeMS, pausedMS, isRunning, bars } = stopwatch;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [displayMS, setDisplayMS] = useState(pausedMS);

  useEffect(() => {
    if (typeof timeoutRef.current === "number") {
      clearTimeout(timeoutRef.current);
    }

    const updateDisplay = () => {
      setDisplayMS(Date.now() - startTimeMS);

      timeoutRef.current = setTimeout(updateDisplay, 33);
    };

    if (isRunning) {
      updateDisplay();
    }

    return () => {
      if (typeof timeoutRef.current === "number") {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startTimeMS, isRunning]);

  const displayString = msToString(displayMS);
  const [firstDisplayCharacter, ...otherCharacters] = [...displayString];

  return (
    <div className="relative m-1 inline-block border border-gray-300 p-1">
      <div className="flex flex-row">
        <input
          className="inline-block flex-grow rounded-r-none"
          type="text"
          value={name}
          onChange={(e) => {
            onChange({
              id,
              name: e.target.value,
              startTimeMS,
              pausedMS,
              isRunning,
              bars,
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
      <div
        className="font-mono"
        style={{
          fontSize: `${timerFontSize * (7 / displayString.length)}pt`,
        }}
      >
        <span
          className={
            firstDisplayCharacter === "0"
              ? "text-gray-200 dark:text-gray-600"
              : ""
          }
        >
          {firstDisplayCharacter}
        </span>
        <span>{otherCharacters.join("")}</span>
      </div>
      <div>
        {bars.map((bar) => {
          const times = displayMS / bar.durationMS;
          const barWidth = `${((times % 1) * 100).toFixed(2)}%`;

          const barText =
            times < 1 ? bar.name : `${bar.name} (+${Math.floor(times)})`;

          return (
            <div
              key={bar.id}
              className="relative mb-1 border border-gray-500 dark:border-gray-300"
            >
              <div
                className="bg:text-white absolute left-0 top-0 overflow-hidden whitespace-nowrap bg-gray-300 dark:bg-gray-500"
                style={{ width: barWidth }}
              >
                <span className="mx-1">{barText}</span>
              </div>
              <span className="mx-1">{barText}</span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-row">
        <button
          className="rounded-lg border border-gray-500 p-1 disabled:opacity-50"
          disabled={isRunning}
          onClick={() => {
            if (!isRunning) {
              onChange({
                id,
                name,
                startTimeMS: Date.now() - pausedMS,
                pausedMS: 0,
                isRunning: true,
                bars,
              });
            }
          }}
        >
          Start
        </button>
        <button
          className="rounded-lg border border-gray-500 p-1 disabled:opacity-50"
          disabled={!isRunning}
          onClick={() => {
            if (isRunning) {
              if (typeof timeoutRef.current === "number") {
                clearTimeout(timeoutRef.current);
              }
              onChange({
                id,
                name,
                startTimeMS,
                pausedMS: displayMS,
                isRunning: false,
                bars,
              });
            }
          }}
        >
          Pause
        </button>
        <button
          className="rounded-lg border border-gray-500 p-1  disabled:opacity-50"
          disabled={displayMS === 0}
          onClick={() => {
            if (typeof timeoutRef.current === "number") {
              clearTimeout(timeoutRef.current);
            }
            setDisplayMS(0);
            onChange({
              id,
              name,
              startTimeMS,
              pausedMS: 0,
              isRunning: false,
              bars,
            });
          }}
        >
          Reset
        </button>
        <div className="flex-grow"></div>
      </div>
    </div>
  );
}
