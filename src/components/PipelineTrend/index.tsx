import React from 'react';

import Header from './components/Header';
import TrendChart from '../TrendChart';
import Description from './components/Description';

import styles from './index.module.less'

const PipelineTrend: React.FC = () => (
  <div className={styles.container}>
    <Header />
    <TrendChart />
    <Description />
  </div>
);

export default PipelineTrend;
