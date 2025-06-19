import { useRef, useEffect } from "react";
import { EChartsType, init, graphic } from 'echarts';

import { MONTH_ORDER } from "./constants";
import type { ItemType, TransfromDataType } from "./types";

// 根据节点值返回对应颜色
function getPointColor(val: number, maxVal: number): string {
  if (val === maxVal) return '#4CAF50';
  return val > 300000 ? '#FFA726' : '#F44336';
}


const transformData = (
  data: ItemType[]
): TransfromDataType =>  {
  const sorted = data.slice().sort((a, b) => {
    const yr = a.year.localeCompare(b.year);
    return yr !== 0 ? yr : MONTH_ORDER[a.month] - MONTH_ORDER[b.month];
  });

  const yearCount = sorted.reduce<Record<string, number>>((cnt, cur) => {
    cnt[cur.year] = (cnt[cur.year] || 0) + 1;
    return cnt;
  }, {});

  const yearSeen: Record<string, number> = {};
  const result = sorted.reduce(
    (acc, { year, month, value }) => {
      acc.months.push(month);
      acc.values.push(value);

      yearSeen[year] = (yearSeen[year] || 0) + 1;
      const mid = Math.ceil(yearCount[year] / 2);

      acc.years.push(yearSeen[year] === mid ? year : '');      
      acc.fullYears.push(year);

      return acc;
    },
    { months: [] as string[], values: [] as number[], years: [] as string[], fullYears: [] as string[] }
  );

  console.log('data: ', data, result)

  return result
}

// 专门负责分隔线和年份文本的 Graphic 配置
const getSeparatorGraphics = (
  chart: EChartsType,
  valuesCount: number
) =>  {
  const p11 = chart.convertToPixel({ xAxisIndex: 0 }, 11);
  const p12 = chart.convertToPixel({ xAxisIndex: 0 }, 12);
  const midX = (p11 + p12) / 2;
  const y0 = chart.convertToPixel({ yAxisIndex: 0 }, 0);
  const y1 = y0 + 10;  // 月标签 margin
  const y2 = y0 + 30;  // 年标签 margin
  const labelOffset = 8;
  const textY = y2 + labelOffset;

  const pStart2024 = chart.convertToPixel({ xAxisIndex: 0 }, 0);
  const pEnd2024   = chart.convertToPixel({ xAxisIndex: 0 }, 11);
  const midX2024   = (pStart2024 + pEnd2024) / 2;

  const pStart2025 = chart.convertToPixel({ xAxisIndex: 0 }, 12);
  const pEnd2025   = chart.convertToPixel({ xAxisIndex: 0 }, valuesCount - 1);
  const midX2025   = (pStart2025 + pEnd2025) / 2;

  return [
    {
      type: 'line',
      shape: { x1: midX, y1, x2: midX, y2 },
      style: { stroke: '#ccc', lineWidth: 1 },
      silent: true,
    },
    {
      type: 'text',
      left: midX2024,
      top: textY,
      style: { text: '2024', fill: '#999', font: 'bold 12px sans-serif', textAlign: 'center' },
    },
    {
      type: 'text',
      left: midX2025,
      top: textY,
      style: { text: '2025', fill: '#999', font: 'bold 12px sans-serif', textAlign: 'center' },
    },
  ];
}

const getTooltipOption = (
  months: string[],
  values: number[],
  fullYears: string[]
): echarts.TooltipComponentOption => {
  return {
    trigger: 'item',
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
    padding: [8, 12],
    textStyle: { color: '#333', fontWeight: 'bold' },
    extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.15);',
    formatter: (params: any) => {
      const idx = params.dataIndex;
      return `${fullYears[idx]} ${months[idx]}<br/>Pipeline: $${values[idx].toLocaleString()}`;
    },
  };
}

const getXAxisOption = (months: string[], years: string[]): echarts.XAXisComponentOption[] =>  {
  return [
    {
      type: 'category',
      data: months,
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { fontSize: 12, color: '#333', margin: 15, fontWeight: 'bold' },
    },
    {
      type: 'category',
      data: years,
      axisTick: {
        show: false,
        alignWithLabel: true,
        length: 6,
        lineStyle: { color: '#ccc' },
        interval: (idx: number) => years[idx] !== '',
      },
      axisLine: { show: false },
      axisLabel: { show: false, fontSize: 12, color: '#999', margin: 40, fontWeight: 'bold' },
      position: 'bottom',
    },
  ];
}

const getSeriesOption = (values: number[]): echarts.SeriesOption[] => {
  const maxVal = Math.max(...values);

  // 灰色柱状图
  const barSeries: echarts.SeriesOption = {
    type: 'bar',
    data: values,
    barWidth: '60%',
    barCategoryGap: '20%',
    itemStyle: {
      color: '#E9E9E9',
      borderRadius: [6, 6, 6, 6],
      shadowColor: 'rgba(0,0,0,0.05)',
      shadowBlur: 5,
    },
    emphasis: {
      itemStyle: { color: '#C0C0C0' }
    },
    z: 1,
  };

  // 按段绘制折线，每段渐变色
  const lineSegments: echarts.SeriesOption[] = [];
  for (let i = 0; i < values.length - 1; i++) {
    const startColor = getPointColor(values[i], maxVal);
    const endColor   = getPointColor(values[i + 1], maxVal);

    lineSegments.push({
      type: 'line',
      data: [
        [i, values[i]],
        [i + 1, values[i + 1]],
      ],
      showSymbol: false,
      lineStyle: {
        width: 3,
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: startColor },
          { offset: 1, color: endColor },
        ])
      },
      z: 2,
    });
  }

  // 圆点
  lineSegments.push({
    type: 'scatter',
    data: values.map((v, idx) => [idx, v]),
    symbol: 'circle',
    symbolSize: 16,
    itemStyle: {
      color: (p: any) => getPointColor(p.value[1], maxVal),
      borderColor: '#fff',
      borderWidth: 0,
    },
    z: 3,
    label: {
      show: true,
      position: 'top',
      fontSize: 12,
      fontWeight: 'bold',
      formatter: (p: any) => p.value[1].toLocaleString(),
    },
  });

  // 数值
  lineSegments.push({
    type: 'scatter',
    data: values.map((v, idx) => ({
      value: [idx, v],
      label: {
        show: true,
        position: 'top',
        fontSize: 12,
        fontWeight: 'bold',
        formatter: () => (v > 0 ? v.toLocaleString() : ''),
      },
    })),
    symbol: 'none',
    z: 4,
  });

  return [barSeries, ...lineSegments];
}

const getBaseOption = ({ months, values, years, fullYears}: TransfromDataType) => ({
  yAxis: { type: 'value', show: false },
  grid: { top: 40, left: 10, right: 10, bottom: 80, containLabel: true },
  xAxis: getXAxisOption(months, years),
  tooltip: getTooltipOption(months, values, fullYears),
  series: getSeriesOption(values),
})

const usePipelineOption = ({
  years,
  months,
  values,
  fullYears
}: TransfromDataType) =>{ 
  const chartRef = useRef<HTMLDivElement>(null);
  const chart = useRef<EChartsType | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    chart.current = init(chartRef.current);
    const chartIns = chart.current!;
  
    const baseOption = getBaseOption({ months, values, years, fullYears });
  
    chartIns.setOption(baseOption);
    chartIns.setOption({ graphic: getSeparatorGraphics(chartIns, values.length) });

    const drawGraphics = () => {
      chartIns.setOption({
        ...baseOption,
        graphic: getSeparatorGraphics(chartIns, values.length),
      });
    };

    const handleWindowResize = () => {
      chartIns.resize()
      drawGraphics()
    };

    window.addEventListener('resize', handleWindowResize);
  
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      chartIns.dispose();
    };
  }, [months, values, years, fullYears]);

  return {
    chartRef
  }
}

export {
  transformData,
  usePipelineOption
}