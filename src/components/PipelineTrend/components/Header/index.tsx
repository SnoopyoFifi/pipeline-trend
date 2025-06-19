
import React from 'react';
import { Flex, Typography } from 'antd';
import { AreaChartOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const Header: React.FC = () => (
  <Flex gap={8} align='center'>
    <AreaChartOutlined style={{ fontSize: 24, color: '#FF4D4F' }} />
    <Title level={4} style={{ margin: 0 }}>Pipeline Trend ($)</Title>
    <Text type="secondary">Last 12 months</Text>
  </Flex>
);

export default Header;