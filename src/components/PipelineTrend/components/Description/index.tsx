import React from 'react';
import { Card, Typography, List } from 'antd';

import styles from './index.module.less'

const data = [
  "Focus on High Pipeline Months: For 2024, continue leveraging strategies that led to high pipeline values in July, October, November, and December.For 2025, focus on maintaining the momentum from January and February."
];

const {Title, Text} = Typography
const {Item} = List

const Description = () => (
  <Card className={styles.card}>
    <Title className={styles.title} level={5}>Next best actions:</Title>
    <List className={styles.list}
      dataSource={data}
      renderItem={item => <Item className={styles.item}><div className={styles.dot}/> <Text className={styles.text}>{item}</Text></Item>}
    />
  </Card>
);

export default Description;