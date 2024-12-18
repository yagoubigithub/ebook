import React, { useContext, useEffect, useRef } from 'react';

import { Tabs, Layout, theme } from 'antd';
import MyContext from '../MyContext.js';

import '../foliate/view.js';

const { Content, Sider } = Layout;
const Book = () => {
  const { notes, setNotes } = useContext(MyContext);

  const oneTime = useRef(true);
  const viewRef = useRef(null);

  useEffect(() => {
    if (oneTime.current) {
      // Handle text selection
      document.addEventListener('selectionchange', () => {
        console.log('select');
      });
      window.electron.ipcRenderer.on(
        'file-to-display',
        async (ev, { filePath }) => {
          const bookEle = document.getElementById('book');
          const { width, height } = bookEle.getBoundingClientRect();
          const view = document.createElement('foliate-view');
          view.style.width = width + 'px';
          view.style.height = height + 'px';

          view.addEventListener('relocate', (e) => {
            // console.log('location changed');
            
            const shadowRoot = view.shadowRoot; // This only works for open shadow roots
            const paginator = shadowRoot.firstElementChild;
            const iframe = paginator.shadowRoot.querySelector('iframe');
            
            handleSelect(iframe);
          });

          bookEle.prepend(view);
          await view.open(filePath);

          await view.goTo(0);

          const shadowRoot = view.shadowRoot; // This only works for open shadow roots
          const paginator = shadowRoot.firstElementChild;
          const iframe = paginator.shadowRoot.querySelector('iframe');
          handleSelect(iframe);
          viewRef.current = view;
        },
      );
      oneTime.current = false;
    }
  });

  const handleSelect = (iframe) => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

   
    // Add a menu container to the iframe (or the parent document if preferred)
    const menu = document.createElement('div');
    menu.id = 'highlightMenu';
    menu.style.position = 'absolute';
    menu.style.display = 'none';
    menu.style.background = 'white';
    menu.style.border = '1px solid black';
    menu.style.padding = '5px';
    iframeDoc.body.appendChild(menu);

    menu.innerHTML = `<div>
    
    <textarea id="textarea"></textarea>
    <br />
    <button id="save">save</button>
     <button id="cancel">cancel</button>
    </div>`;
    // Listen for selection changes
    iframeDoc.addEventListener('mouseup', (e) => {
      console.log("select")
      // If the mouseup event originated from a child, ignore it
      const selection = iframeDoc.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        // Create a highlight span
        const highlightSpan = iframeDoc.createElement('span');
        highlightSpan.style.backgroundColor = 'yellow';
        highlightSpan.classList.add('highlight');
        highlightSpan.textContent = range.toString();

        // Replace the selected text with the highlighted span
        //range.deleteContents();
       // range.insertNode(highlightSpan);

        console.log('Highlighted text:', highlightSpan.textContent);

        // Position the menu near the selection
        const rect = highlightSpan.getBoundingClientRect(); // Get position of the highlighted text
        menu.style.left = `${e.pageX + window.scrollX}px`;
        menu.style.top = `${e.pageY + window.scrollY}px`;
        menu.style.display = 'block';
        menu.querySelector('#save').onclick = () => {
          highlightSpan.replaceWith(
            document.createTextNode(highlightSpan.textContent),
          ); // Remove highlight
          menu.style.display = 'none';

          setNotes([
            ...notes,
            {
              text: highlightSpan.textContent,
              note: menu.querySelector('#textarea').value,
            },
          ]);
        };
        menu.querySelector('#cancel').onclick = () => {
          menu.style.display = 'none';
          highlightSpan.replaceWith(
            document.createTextNode(highlightSpan.textContent),
          ); // Remove highlight

          console.log(menu);
        };
      }
    });
    // // Hide menu if clicked elsewhere
    // iframeDoc.addEventListener('click', (e) => {
    //   if (!menu.contains(e.target)) {
    //     menu.style.display = 'none';
    //   }
    // });
  };
  const items = [
    {
      key: '1',
      label: 'Reading Mode Tab',
      children: (
        <div>
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
              {notes.map((note, index) => {
                return (
                  <ul key={index}>
                    <li>text : {note.text}</li>
                    <li>note : {note.note}</li>
                  </ul>
                );
              })}
            </div>
          </div>
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
