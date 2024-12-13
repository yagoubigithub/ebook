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

  const handleChangeImport = (event) => {
    const file = event.target.files[0];

    window.electron.ipcRenderer.send('import', {
      name: file.name,
      path: file.path,
      size: file.size,
      type: file.type,
    });
    event.target.value = '';
  };
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

        <label
          htmlFor="import"
          className="ant-btn css-dev-only-do-not-override-1wwf28x ant-btn-round ant-btn-default ant-btn-color-default ant-btn-variant-solid ant-btn-lg"
          style={{ marginLeft: 'auto' }}
        >
          <span>Import</span>
        </label>
        <input
          type="file"
          id="import"
          name="import"
          hidden
          accept=".epub,.mobi,.azw3,.fb2,.cbz,.pdf"
          onChange={handleChangeImport}
          multiple={false}
        />
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
