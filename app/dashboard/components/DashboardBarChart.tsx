export interface DashboardBarChartEntry {
  label: string;
  value: number;
}

interface DashboardBarChartProps {
  data: DashboardBarChartEntry[];
  label: string;
  color?: "orange" | "dark";
}

export function DashboardBarChart({
  data,
  label,
  color = "orange",
}: DashboardBarChartProps) {
  const maxValue = Math.max(...data.map((entry) => entry.value), 1);
  const fillClass = color === "orange" ? "from-orange-500 to-amber-300" : "from-neutral-800 to-neutral-500";

  if (data.length === 0) {
    return (
      <p className="rounded-xl bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-400">
        Aucune donnée disponible pour le moment.
      </p>
    );
  }

  return (
    <div role="list" aria-label={label} className="space-y-5">
      {data.map((entry, index) => {
        const percentage = Math.round((entry.value / maxValue) * 100);

        return (
          <div role="listitem" key={entry.label} className="space-y-2">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="w-5 text-xs font-semibold tabular-nums text-neutral-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{entry.label}</span>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-neutral-600">
                {entry.value.toLocaleString("fr-FR")}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${entry.label} : ${entry.value.toLocaleString("fr-FR")}`}
              aria-valuemin={0}
              aria-valuemax={maxValue}
              aria-valuenow={entry.value}
              className="ml-8 h-2.5 overflow-hidden rounded-full bg-neutral-100"
            >
              <div
                className={`h-full rounded-full bg-gradient-to-r ${fillClass} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
      <div aria-hidden="true" className="ml-8 flex justify-between border-t border-neutral-100 pt-2 text-[10px] text-neutral-400">
        <span>0</span>
        <span>{Math.round(maxValue / 2).toLocaleString("fr-FR")}</span>
        <span>{maxValue.toLocaleString("fr-FR")}</span>
      </div>
    </div>
  );
}
