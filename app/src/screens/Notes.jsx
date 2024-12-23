import React, { useContext, useEffect } from 'react';

import MyContext from '../MyContext.js';
import { Flex, Table } from 'antd';
const Notes = () => {
  const { notes, setNotes } = useContext(MyContext);
  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-notes').then((notes) => {
      setNotes(notes);
    });
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Text',
      dataIndex: 'text',
      key: 'text',
      width: 500,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
  ];
  return (
    <div>
      <Flex gap="middle" vertical>
        <Table dataSource={notes} columns={columns} />;
      </Flex>
    </div>
  );
};

export default Notes;
