export interface TrafficPoint {
  label: string;
  value: number;
}

interface TrafficChartProps {
  data: TrafficPoint[];
}

const width = 720;
const height = 220;
const padding = { top: 16, right: 12, bottom: 32, left: 38 };
const chartWidth = width - padding.left - padding.right;
const chartHeight = height - padding.top - padding.bottom;

export function TrafficChart({ data }: TrafficChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const points = data.map((point, index) => {
    const x =
      padding.left +
      (data.length > 1 ? (index / (data.length - 1)) * chartWidth : chartWidth / 2);
    const y = padding.top + chartHeight - (point.value / maxValue) * chartHeight;

    return { ...point, x, y };
  });
  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
    : "";
  const labelStep = Math.max(1, Math.ceil(data.length / 6));
  const labelIndexes = data
    .map((_, index) => index)
    .filter((index) => index % labelStep === 0 || index === data.length - 1);

  if (!data.some((point) => point.value > 0)) {
    return (
      <div className="flex h-56 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">
        Aucune visite enregistrée sur cette période.
      </div>
    );
  }

  return (
    <div className="w-full">
      <svg
        className="h-auto w-full overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Graphique du nombre de visites par période"
      >
        <defs>
          <linearGradient id="traffic-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((step) => {
          const y = padding.top + (chartHeight / 3) * step;
          const value = Math.round(maxValue - (maxValue / 3) * step);

          return (
            <g key={step}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeDasharray={step === 3 ? undefined : "4 5"}
              />
              <text
                x={padding.left - 9}
                y={y + 4}
                textAnchor="end"
                className="fill-gray-400"
                fontSize="10"
              >
                {value}
              </text>
            </g>
          );
        })}

        <path d={areaPath} fill="url(#traffic-area)" />
        <path
          d={linePath}
          fill="none"
          stroke="#f97316"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />

        {points.map((point) => (
          <circle
            key={`${point.label}-${point.x}`}
            cx={point.x}
            cy={point.y}
            r="3.5"
            fill="#fff"
            stroke="#f97316"
            strokeWidth="2"
          >
            <title>
              {point.label}: {point.value} visite{point.value > 1 ? "s" : ""}
            </title>
          </circle>
        ))}

        {labelIndexes.map((index) => (
          <text
            key={`${data[index].label}-${index}`}
            x={points[index].x}
            y={height - 7}
            textAnchor="middle"
            className="fill-gray-400"
            fontSize="10"
          >
            {data[index].label}
          </text>
        ))}
      </svg>
    </div>
  );
}
