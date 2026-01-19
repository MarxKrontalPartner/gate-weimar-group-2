import 'ag-charts-community'
import type { ChartDataPoint } from '@/types/project.types'

/**
 * 1. DUMMY DATA GENERATORS
 * Used when no real data source is connected yet.
 */

// Generates { time, value } for Time Series & Gauge
const generateTimeData = (count: number) => {
  const data = []
  const now = new Date()
  for (let i = 0; i < count; i++) {
    // Generate data for the last 'count' hours
    const time = new Date(now.getTime() - (count - i) * 60000 * 60)
    data.push({
      time: time,
      value: Math.floor(Math.random() * 100) + 50, // Random value between 50 and 150
    })
  }
  return data
}

// Generates { label, value } for generic Bar Charts (if not using time)
const generateCategoryData = () => {
  return [
    { label: 'Sensor A', value: 450 },
    { label: 'Sensor B', value: 320 },
    { label: 'Sensor C', value: 550 },
    { label: 'Sensor D', value: 210 },
  ]
}

/**
 * 2. MAIN FACTORY FUNCTION
 * @param type - The type of chart selected in the dropdown ('Time series', 'Bar chart', etc.)
 * @param title - The user-defined title
 * @param realData - The array returned from useDataFetcher [{time: Date, value: number}, ...] or null
 * @param isDark - Whether dark mode is active (for theming text colors)
 */
export const createChartConfig = (
  type: string,
  title: string,
  realData: ChartDataPoint[] | null = null,
  isDark: boolean = false,
) => {
  // A. DETERMINE DATA SOURCE
  // If realData is provided from the API/JSON, use it.
  // Otherwise, fallback to generated dummy data.
  let chartData = realData
  const isUsingRealData = realData && realData.length > 0

  // B. HANDLE DUMMY FALLBACK
  if (!isUsingRealData) {
    if (type === 'Bar chart') {
      chartData = generateCategoryData() // Default categories
    } else {
      chartData = generateTimeData(24) // Default 24h history
    }
  }

  // Theme-aware colors
  const textColor = isDark ? '#e5e7eb' : '#374151' // gray-200 for dark, gray-700 for light
  const secondaryTextColor = isDark ? '#9ca3af' : '#6b7280' // gray-400 for dark, gray-500 for light
  const gridColor = isDark ? '#4b5563' : '#e5e7eb' // gray-600 for dark, gray-200 for light

  // C. COMMON CONFIGURATION
  const commonOptions = {
    title: { text: title || 'Untitled Panel', color: textColor },
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
    data: chartData,
    background: { fill: 'transparent' }, // Ensures it blends with cards
  }

  // D. SWITCH CONFIGURATION BASED ON CHART TYPE
  switch (type) {
    case 'Time series':
      return {
        ...commonOptions,
        series: [
          {
            type: 'line',
            // useDataFetcher returns 'time' and 'value'. Dummy data also uses 'time' and 'value'.
            xKey: 'time',
            yKey: 'value',
            stroke: '#3b82f6', // Tailwind Blue-500
            strokeWidth: 2,
            marker: { enabled: false }, // Clean look
            tooltip: {
              renderer: ({ datum, yKey }: { datum: ChartDataPoint; yKey: string }) => ({
                content: `${datum[yKey]}`,
              }),
            },
          },
        ],
        axes: [
          {
            type: 'time',
            position: 'bottom',
            label: { format: '%H:%M', color: secondaryTextColor }, // Hour:Minute format
            tick: { count: 6 },
            line: { color: gridColor },
          },
          {
            type: 'number',
            position: 'left',
            label: { color: secondaryTextColor },
            line: { color: gridColor },
            gridLine: { style: [{ stroke: gridColor, lineDash: [4, 2] }] },
          },
        ],
      }

    case 'Bar chart':
      // Logic: If using Real Data (from API), x-axis is Time. If Dummy, x-axis is 'label'.
      const xKeyBar = isUsingRealData ? 'time' : 'label'
      const xAxisType = isUsingRealData ? 'time' : 'category'

      return {
        ...commonOptions,
        series: [
          {
            type: 'bar',
            xKey: xKeyBar,
            yKey: 'value',
            fill: '#10b981', // Tailwind Emerald-500
            tooltip: {
              renderer: ({ datum, yKey }: { datum: ChartDataPoint; yKey: string }) => ({
                content: `${datum[yKey]}`,
              }),
            },
          },
        ],
        axes: [
          {
            type: xAxisType,
            position: 'bottom',
            label: { rotation: -45, color: secondaryTextColor }, // Rotate labels to fit timestamps
            line: { color: gridColor },
          },
          {
            type: 'number',
            position: 'left',
            label: { color: secondaryTextColor },
            line: { color: gridColor },
            gridLine: { style: [{ stroke: gridColor, lineDash: [4, 2] }] },
          },
        ],
      }

    default:
      return commonOptions
  }
}
