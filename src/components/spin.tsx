import React from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: '1em' }} spin />;

const CustomSpin: React.FC<any> = props => <Spin indicator={antIcon} {...props} />;

export default CustomSpin;
