import 'ag-charts-community';

// Generate some realistic Time Series Dummy Data
const generateTimeData = (count: number) => {
  const data = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (count - i) * 60000 * 60); // Hourly steps
    data.push({
      time: time,
      value: Math.floor(Math.random() * 100) + 50, // Random value 50-150
      category: `Cat ${i % 5}`
    });
  }
  return data;
};

// Generate Category Data for Bar Charts
const generateCategoryData = () => {
  return [
    { label: 'Sensor A', value: 450 },
    { label: 'Sensor B', value: 320 },
    { label: 'Sensor C', value: 550 },
    { label: 'Sensor D', value: 210 },
  ]
}

export const createChartConfig = (type: string, title: string) => {
  const timeData = generateTimeData(24); // 24 hours of data
  const catData = generateCategoryData();

  const commonOptions = {
    title: { text: title || 'Untitled Chart' },
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
  };

  switch (type) {
    case 'Time series':
      return {
        ...commonOptions,
        data: timeData,
        series: [
          {
            type: 'line',
            xKey: 'time',
            yKey: 'value',
            stroke: '#3b82f6',
            marker: { enabled: false }
          }
        ],
        axes: [
          {
            type: 'time',
            position: 'bottom',
            // Nice time formatting for axes
            tick: { count: 6 },
            label: { format: '%H:%M' }
          },
          {
            type: 'number',
            position: 'left',
            title: { text: 'Values (kWh)' }
          }
        ]
      };

    case 'Bar chart':
      return {
        ...commonOptions,
        data: catData,
        series: [
          {
            type: 'bar',
            xKey: 'label',
            yKey: 'value',
            fill: '#10b981'
          }
        ],
        axes: [
          { type: 'category', position: 'bottom' },
          { type: 'number', position: 'left' }
        ]
      };

    case 'Stat':
    case 'Gauge':
      // Using a Donut chart to simulate a Gauge/Stat for now
      return {
        ...commonOptions,
        data: [{ label: 'Usage', value: 75 }, { label: 'Free', value: 25 }],
        series: [
          {
            type: 'pie',
            angleKey: 'value',
            calloutLabelKey: 'label',
            innerRadiusRatio: 0.7, // Donut style
            fills: ['#6366f1', '#e5e7eb']
          }
        ]
      };

    default:
      return commonOptions;
  }
};