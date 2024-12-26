import React, { useEffect, useRef, useState } from 'react';

import { Button, Form, Input, Modal } from 'antd';

const BookSideBar = () => {
  const formRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    window.electron.ipcRenderer.invoke('get-columns').then((columns) => {
      setColumns(columns);
    });
  }, []);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    //setIsModalOpen(false);
    formRef.current
      .validateFields()
      .then((values) => {
        // Handle successful validation
        console.log('Values:', values);
        window.electron.ipcRenderer.send('add-column', {
          ...values,
        });
        window.electron.ipcRenderer.invoke('get-columns').then((columns) => {
          setColumns(columns);
          setIsModalOpen(false);
        });
      })
      .catch((info) => {
        console.log('Validation failed:', info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = (values) => {
    console.log('Success:', values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div>
      <div
        style={{
          background: '#D9D9D9',
          padding: 16,
          margin: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button onClick={showModal}>Add New Column</Button>
      </div>

      {columns.map((column, index) => {
        return (
          <div
            key={index}
            style={{
              background: '#D9D9D9',
              padding: 16,
              margin: 8,
            }}
          >
            <h4>{column.name}</h4>
            <hr />

            <p>{column.desc}</p>
          </div>
        );
      })}
      <Modal
        title="Add Column"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          ref={formRef}
        >
          <Form.Item
            label="column name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input  Column Name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="desc"
            rules={[
              {
                required: true,
                message: 'Please input a Description!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookSideBar;
