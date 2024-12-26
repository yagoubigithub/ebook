import React, { useContext, useEffect, useRef, useState } from 'react';

import { Tabs, Layout, theme, Tree } from 'antd';
import MyContext from '../MyContext.js';

import '../foliate/view.js';
import Notes from './Notes.jsx';
import BookSideBar from '../components/BookSideBar.jsx';

const { Content, Sider } = Layout;
const Book = () => {
  const { setNotes } = useContext(MyContext);

  
  const [toc, setToc] = useState([]);
  const oneTime = useRef(true);
  const viewRef = useRef(null);

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

          view.addEventListener('load', () => {
            console.log('load');
            const shadowRoot = view.shadowRoot; // This only works for open shadow roots
            const paginator = shadowRoot.firstElementChild;
            const iframes = paginator.shadowRoot.querySelectorAll('iframe');

            console.log('iframe numb', iframes.length);
            iframes.forEach((iframe) => {
              handleSelect(iframe);
            });
          });
          bookEle.prepend(view);
          await view.open(filePath);

          await view.goTo(0);
          const { book } = view;

          if (book.toc) {
            console.log(book.toc);
            setToc(book.toc);
          }
          // eslint-disable-next-line no-undef
          Promise.resolve(book.getCover?.())?.then((blob) => {
            document.getElementById('side-bar-cover').src = blob
              ? URL.createObjectURL(blob)
              : null;
          });
          const title =
            formatLanguageMap(book.metadata?.title) || 'Untitled Book';
          document.getElementById('side-bar-title').innerHTML = title;
          const shadowRoot = view.shadowRoot; // This only works for open shadow roots
          const paginator = shadowRoot.firstElementChild;
          const iframe = paginator.shadowRoot.querySelector('iframe');
          handleSelect(iframe);
          viewRef.current = view;
        },
      );

      window.electron.ipcRenderer.invoke('get-notes').then((notes) => {
        setNotes(notes);
      });
      oneTime.current = false;
    }
  });

  const handleSelect = (iframe) => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // iframeDoc.removeEventListener('selectionchange', (e) => {
    //   return selectionchange(e, menu, iframeDoc);
    // });
    iframeDoc.addEventListener('mouseup', (e) => {
      return selectionchange(e, iframeDoc);
    });
  };

  const selectionchange = async (e, iframeDoc) => {
    console.log('selection change');
    // Add a menu container to the iframe (or the parent document if preferred)
    const menu = document.createElement('div');
    menu.id = 'highlightMenu';
    menu.style.position = 'absolute';
    menu.style.display = 'none';
    menu.style.background = 'white';
    menu.style.border = '1px solid black';
    menu.style.padding = '5px';

    let html = `<div>`;

    const columns = await window.electron.ipcRenderer.invoke('get-columns');
    columns.map((column) => {
      html =
        html +
        `<textarea id="textarea-${column.id}" placeholder="${column.name}"></textarea>`;
    });
    html =
      html +
      `    
     <br />
     <button id="save">save</button>
      <button id="cancel">cancel</button>
     </div>`;

    menu.innerHTML = html;
    const selection = iframeDoc.getSelection();

    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      // Create a highlight span
      const highlightSpan = iframeDoc.createElement('span');
      highlightSpan.style.backgroundColor = 'yellow';
      highlightSpan.classList.add('highlight');
      highlightSpan.textContent = range.toString();
      // Replace the selected text with the highlighted span
      range.deleteContents();
      range.insertNode(highlightSpan);

      console.log('Highlighted text:', highlightSpan.textContent);
      iframeDoc.body.appendChild(menu);
      // Position the menu near the selection
      const rect = highlightSpan.getBoundingClientRect(); // Get position of the highlighted text
      console.log(rect);
      menu.style.left = `${rect.x}px`;
      menu.style.top = `${rect.y}px`;
      menu.style.display = 'block';
      menu.querySelector('#save').onclick = () => {
        window.electron.ipcRenderer.send('add-note', {
          text: highlightSpan.textContent,
          note: Array.from(menu.querySelectorAll('textarea')).map(
            (textarea) => {
              return {
                note: textarea.value,
                columnId: textarea.id.split('-')[1],
              };
            },
          ),
        });
        window.electron.ipcRenderer.invoke('get-notes').then((notes) => {
          setNotes(notes);
        });
        highlightSpan.replaceWith(
          document.createTextNode(highlightSpan.textContent),
        );
        // Remove highlight
        menu.style.display = 'none';
      };
      menu.querySelector('#cancel').onclick = () => {
        menu.style.display = 'none';
        highlightSpan.replaceWith(
          document.createTextNode(highlightSpan.textContent),
        ); // Remove highlight

        console.log(menu);
      };
    }
  };

  const items = [
    {
      key: '1',
      label: 'Reading Mode Tab',
      children: (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 400,
              height: 54,
              border: '1px solid rgba(0,0,0,0.1)',
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 15,
            }}
          >
            ToolBar Setting for reader
          </div>
          <div id="book-container">
            <div id="book">
              <button
                id="prev"
                onClick={() => {
                  if (viewRef.current) {
                    viewRef.current.prev();
                  }
                }}
              >
                prev
              </button>
              <button
                id="next"
                onClick={() => {
                  if (viewRef.current) {
                    viewRef.current.next();
                  }
                }}
              >
                next
              </button>
            </div>
            <div id="book-sidebar">
              <BookSideBar />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Tabular Notes Tab',
      children: (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 400,
              height: 54,
              border: '1px solid rgba(0,0,0,0.1)',
              color: 'black',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 15,
            }}
          >
            ToolBar Setting for reader
          </div>
          <Notes />
        </div>
      ),
    },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onSelect = (selectedKeys, info) => {
    viewRef.current.goTo(info.node.href);
    console.log('selected', selectedKeys, info.node.href);
  };
  const formatLanguageMap = (x) => {
    if (!x) return '';
    if (typeof x === 'string') return x;
    const keys = Object.keys(x);
    return x[keys[0]];
  };
  return (
    <Layout>
      <Layout>
        <Sider
          width={200}
          style={{ background: 'white', height: '100vh' }}
          collapsible
          trigger={null}
        >
          <div id="side-bar-header">
            <img id="side-bar-cover" />
            <div>
              <h1 id="side-bar-title"></h1>
              <p id="side-bar-author"></p>
            </div>
          </div>
          <h4>Table Of Content</h4>
          <Tree
            checkable={false}
            onSelect={onSelect}
            treeData={toc.map((t) => {
              return {
                title: t.label,
                key: t.id,
                href: t.href,
                children: t.subitems.map((s) => {
                  return {
                    title: s.label,
                    key: s.id,
                    href: s.href,
                  };
                }),
              };
            })}
          />
        </Sider>
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
