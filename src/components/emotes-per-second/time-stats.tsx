import type { Emote as EmoteType } from "../../schemas";

type EmoteCounts = EmoteType & { count: number };

interface TimeStatsProps {
  endTime: number;
  emoteCounts: EmoteCounts[];
  timePeriodMS: number;
}

export default function TimeStats({
  emoteCounts,
  endTime,
  timePeriodMS,
}: TimeStatsProps) {
  return (
    <div>
      <span>
        {new Date(endTime).toLocaleTimeString()}, last {timePeriodMS / 1000}{" "}
        seconds
      </span>
      <table className="text-sm">
        <thead>
          <tr>
            <th className="w-44 border border-gray-300 px-0.5">Picture</th>
            <th className="w-36 border border-gray-300 px-0.5">Emote</th>
            <th className="border border-gray-300 px-0.5">Count</th>
            <th className="border border-gray-300 px-0.5 text-right">
              per Second
            </th>
            <th className="w-16 border border-gray-300 px-0.5 text-center">
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          {emoteCounts
            .sort((a, b) => b.count - a.count)
            .map(({ count, emote, id, imageUrl, source }) => {
              const perSecond = count / (timePeriodMS / 1000);
              return (
                <tr key={id}>
                  <td className="flex justify-center border border-gray-300 px-0.5">
                    <img
                      className="max-h-14"
                      src={imageUrl || ""}
                      title={emote}
                      alt={emote}
                    />
                  </td>
                  <td className="border border-gray-300 px-0.5 text-center">
                    <input className="w-32 pl-0.5" value={emote} readOnly />
                  </td>
                  <td className="border border-gray-300 px-0.5 text-center">
                    {count}
                  </td>
                  <td className="border border-gray-300 px-0.5 text-right">
                    {perSecond.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-0.5 text-center">
                    {source}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
