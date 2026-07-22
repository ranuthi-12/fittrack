import React from "react";

/**
 * LineChart Component (Pure SVG Weight Progress Chart)
 */
export function LineChart({ data, title, height = 220 }) {
  if (!data || data.length === 0) return null;

  const padding = 40;
  const chartWidth = 600;
  const chartHeight = height;

  const values = data.map((d) => d.val);
  const minVal = Math.floor(Math.min(...values) - 2);
  const maxVal = Math.ceil(Math.max(...values) + 2);

  const getX = (index) => padding + (index / (data.length - 1)) * (chartWidth - padding * 2);
  const getY = (val) => chartHeight - padding - ((val - minVal) / (maxVal - minVal)) * (chartHeight - padding * 2);

  const points = data.map((d, i) => `${getX(i)},${getY(d.val)}`).join(" ");

  return (
    <div className="chart-wrapper">
      {title && <h4 className="chart-title">{title}</h4>}
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * (chartHeight - padding * 2);
          const valLabel = Math.round(maxVal - ratio * (maxVal - minVal));
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#64748B">{valLabel}</text>
            </g>
          );
        })}

        {/* Gradient fill area below line */}
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon
          points={`${padding},${chartHeight - padding} ${points} ${chartWidth - padding},${chartHeight - padding}`}
          fill="url(#lineGrad)"
        />

        {/* Polyline */}
        <polyline points={points} fill="none" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {data.map((d, i) => (
          <g key={i} className="chart-point-group">
            <circle cx={getX(i)} cy={getY(d.val)} r="5" fill="#6366F1" stroke="white" strokeWidth="2" />
            <text x={getX(i)} y={chartHeight - 12} textAnchor="middle" fontSize="11" fill="#64748B">{d.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * BarChart Component (Pure SVG Attendance / Progress Logs)
 */
export function BarChart({ data, title, height = 220 }) {
  if (!data || data.length === 0) return null;

  const padding = 40;
  const chartWidth = 600;
  const chartHeight = height;

  const values = data.map((d) => d.val);
  const maxVal = Math.max(...values, 10);

  const barWidth = 36;
  const availableWidth = chartWidth - padding * 2;
  const step = availableWidth / data.length;

  return (
    <div className="chart-wrapper">
      {title && <h4 className="chart-title">{title}</h4>}
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="svg-chart">
        {/* Grid lines */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = padding + ratio * (chartHeight - padding * 2);
          const valLabel = Math.round(maxVal * (1 - ratio));
          return (
            <g key={i}>
              <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#E2E8F0" strokeDasharray="4 4" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#64748B">{valLabel}</text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = padding + i * step + (step - barWidth) / 2;
          const barH = (d.val / maxVal) * (chartHeight - padding * 2);
          const y = chartHeight - padding - barH;
          return (
            <g key={i} className="chart-bar-group">
              <rect x={x} y={y} width={barWidth} height={barH} rx="6" fill="#4F46E5" />
              <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="#4F46E5">
                {d.val}
              </text>
              <text x={x + barWidth / 2} y={chartHeight - 12} textAnchor="middle" fontSize="11" fill="#64748B">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * AreaChart Component (Revenue analytics)
 */
export function AreaChart({ data, title, height = 220 }) {
  return <LineChart data={data} title={title} height={height} />;
}
