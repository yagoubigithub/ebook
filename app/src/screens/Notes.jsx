import React, { useContext, useEffect, useState } from 'react';

import MyContext from '../MyContext.js';
import { Flex, Table } from 'antd';
const Notes = () => {
  const [columns, setColumns] = useState([]);

  const { notes, setNotes } = useContext(MyContext);
  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-notes').then((notes) => {
      setNotes(notes);
    });
    window.electron.ipcRenderer.invoke('get-columns').then((columns) => {
      const c = [
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'Text',
          dataIndex: 'text',
          key: 'text',
          width: 300,
        },
        ...columns.map((col) => {
          return {
            title: col.name,
            dataIndex: 'column-' + col.id,
            key: 'column-' + col.id,
          };
        }),
      ];
      console.log(c);
      setColumns(c);
    });
  }, []);

  // const columns = [
  //   {
  //     title: 'ID',
  //     dataIndex: 'id',
  //     key: 'id',
  //   },
  //   {
  //     title: 'Text',
  //     dataIndex: 'text',
  //     key: 'text',
  //     width: 500,
  //   },
  //   {
  //     title: 'Note',
  //     dataIndex: 'note',
  //     key: 'note',
  //   },
  // ];
  return (
    <div>
      <Flex gap="middle" vertical>
        <Table dataSource={notes} columns={columns} />;
      </Flex>
    </div>
  );
};

export default Notes;
