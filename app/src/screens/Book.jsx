import React, { useEffect, useRef } from 'react';

import { Tabs, Layout, Menu, theme, Typography } from 'antd';
import '../foliate/view.js';

import { createTOCView } from '../foliate/ui/tree.js';
import { createMenu } from '../foliate/ui/menu.js';
import { Overlayer } from '../foliate/overlayer.js';

const { Header, Content, Sider } = Layout;
const Book = () => {
  const oneTime = useRef(true);

  useEffect(() => {
    if (oneTime.current) {
      window.electron.ipcRenderer.on(
        'file-to-display',
        async (ev, { filePath }) => {
          const bookEle = document.getElementById('book');
          const { width, height } = bookEle.getBoundingClientRect();
          const view = document.createElement('foliate-view');
          view.style.width = width + 'px';
          view.style.height = height + 'px';

          view.addEventListener('relocate', () => {
            console.log('location changed');
            // console.log(e);
          });

          bookEle.prepend(view);
          await view.open(filePath);

          const { book } = view;
          console.log('book : ', book);
          await view.goTo(1);
        },
      );
      oneTime.current = false;
    }
  });
  const items = [
    {
      key: '1',
      label: 'Reading Mode Tab',
      children: (
        <div id="book-container">
          <div id="book"></div>
          <div id="book-sidebar">side bare</div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Tabular Notes Tab',
      children: 'Content of Tab Pane 2',
    },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Layout>
        <Sider
          width={200}
          style={{ background: 'gray', height: '100vh' }}
          collapsible
          trigger={null}
        ></Sider>
        <Layout>
          <Content
            style={{
              margin: 0,

              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Tabs defaultActiveKey="1" centered items={items} />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Book;
