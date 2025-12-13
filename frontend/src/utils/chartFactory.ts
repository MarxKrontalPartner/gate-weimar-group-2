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
 */
export const createChartConfig = (
  type: string,
  title: string,
  realData: ChartDataPoint[] | null = null,
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

  // C. COMMON CONFIGURATION
  const commonOptions = {
    title: { text: title || 'Untitled Panel' },
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
            label: { format: '%H:%M' }, // Hour:Minute format
            tick: { count: 6 },
          },
          {
            type: 'number',
            position: 'left',
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
            label: { rotation: -45 }, // Rotate labels to fit timestamps
          },
          {
            type: 'number',
            position: 'left',
          },
        ],
      }

    case 'Stat':
    case 'Gauge':
      /**
       * STAT/GAUGE LOGIC:
       * These charts show a SINGLE value (Snapshot).
       * If we have a history array (realData), we take the LAST item (most recent).
       */
      let currentValue = 0
      let maxValue = 200 // Arbitrary visualization max

      if (isUsingRealData && chartData && chartData.length > 0) {
        // Take the most recent value from the API array
        const lastItem = chartData[chartData.length - 1]
        if (lastItem) {
          currentValue = Number(lastItem.value)
          // Set visual max to 1.5x of current (or fixed if you prefer)
          maxValue = currentValue > 0 ? currentValue * 1.5 : 100
        }
      } else if (chartData && Array.isArray(chartData) && chartData.length > 0) {
        // Dummy data fallback
        const lastItem = chartData[chartData.length - 1]
        if (lastItem && typeof lastItem === 'object' && 'value' in lastItem) {
          currentValue = Number(lastItem.value)
        }
      }

      // Create specific data structure for the Donut/Gauge
      const gaugeData = [
        { label: 'Current', value: currentValue },
        { label: 'Remaining', value: Math.max(0, maxValue - currentValue) },
      ]

      return {
        ...commonOptions,
        data: gaugeData, // Override the history data with the computed snapshot
        series: [
          {
            type: 'pie',
            angleKey: 'value',
            innerRadiusRatio: 0.7, // Makes it a Donut
            fills: ['#6366f1', '#f3f4f6'], // Indigo-500 vs Gray-100
            strokeWidth: 0,
            // Show the Value in the center
            title: {
              text: currentValue.toFixed(1), // 1 decimal place
              fontSize: 24,
              fontWeight: 'bold',
              color: '#1f2937',
            },
          },
        ],
        legend: { enabled: false }, // Hide legend for cleaner look
      }

    default:
      return commonOptions
  }
}
