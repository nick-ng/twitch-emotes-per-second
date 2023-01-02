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
      <table>
        <thead>
          <tr>
            <th className="border border-gray-300 px-0.5">Picture</th>
            <th className="border border-gray-300 px-0.5">Emote</th>
            <th className="border border-gray-300 px-0.5">Count</th>
            <th className="border border-gray-300 px-0.5 text-right">
              per Second
            </th>
            <th className="border border-gray-300 px-0.5 text-right">
              per Minute
            </th>
          </tr>
        </thead>
        <tbody>
          {emoteCounts
            .sort((a, b) => b.count - a.count)
            .map(({ count, emote, id, imageUrl }) => {
              const perSecond = count / (timePeriodMS / 1000);
              return (
                <tr key={id}>
                  <td className="border border-gray-300 px-0.5 text-center">
                    <img
                      className="max-h-14"
                      src={imageUrl || ""}
                      title={emote}
                      alt={emote}
                    />
                  </td>
                  <td className="border border-gray-300 px-0.5 text-center">
                    <input className="w-32" value={emote} readOnly />
                  </td>
                  <td className="border border-gray-300 px-0.5 text-center">
                    {count}
                  </td>
                  <td className="border border-gray-300 px-0.5 text-right">
                    {perSecond.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-0.5 text-right">
                    {perSecond * 60}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
