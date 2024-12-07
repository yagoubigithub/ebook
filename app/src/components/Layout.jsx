// Layout.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Button, Layout, Menu, theme, Typography } from 'antd';

import { MenuOutlined, HomeOutlined, AlertOutlined } from '@ant-design/icons';
const { Header, Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Button
          type="text"
          icon={
            <MenuOutlined
              style={{
                fontSize: 25,
              }}
            />
          }
          onClick={() => setCollapsed(!collapsed)}
          style={{
            borderRadius: '100%',
            width: 64,
            height: 64,
          }}
        />
        <Typography.Title
          level={2}
          style={{
            color: 'black',
            margin: 0,
            marginLeft: 25,
          }}
        >
          eBook
        </Typography.Title>

        <Button
          color="default"
          variant="solid"
          style={{ marginLeft: 'auto' }}
          shape="round"
          size="large"
        >
          Import
        </Button>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{ background: colorBgContainer }}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          trigger={null}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            className={`custom-menu ${collapsed ? 'collapsed-menu' : ''}`}
            items={[
              {
                key: '1',
                icon: <HomeOutlined />,
                label: 'Books',
              },
              {
                key: '2',
                icon: <AlertOutlined />,
                label: 'Notes',
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,

              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
