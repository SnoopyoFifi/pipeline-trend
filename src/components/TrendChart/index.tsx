import React from 'react';
import * as echarts from 'echarts/core';
import {
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  GraphicComponent,
} from 'echarts/components';
import { LineChart, BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

import { mockData } from './constants';
import { transformData, usePipelineOption } from './handlers'

echarts.use([
  TooltipComponent,
  GridComponent,
  LineChart,
  BarChart,
  DatasetComponent,
  GraphicComponent,
  CanvasRenderer,
]);

const TrendChart: React.FC = () => {
  const renderData = transformData(mockData)
  const { chartRef} =  usePipelineOption(renderData)

  console.log("renderData: ", renderData)
  
  return (
    <div style={{ width: '100%', height: 420 }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default TrendChart;