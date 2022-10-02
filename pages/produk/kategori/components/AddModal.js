import React, { useState } from "react";
import { Button, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "../../../../libs/axios";
import useSwr, { useSWRConfig } from "swr";
import { Breadcrumb, Form, Input, InputNumber, message, Row, Upload, Col, Select } from "antd";

export default function AddModal() {
  const [form] = Form.useForm();
  const { mutate } = useSWRConfig();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    axios
      .post("/produk/add-kategori", values)
      .then(function (response) {
        message.success(response.data.message);
        mutate("/produk/get-produks");
        onReset();
        setIsModalVisible(false);
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Add Kategori
      </Button>
      <Modal
        title="Add Kategori"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" form="myForm" key="submit" htmlType="submit">
              Submit
            </Button>
          </>,
        ]}
      >
        <Form
          form={form}
          name="basic"
          labelAlign="left"
          id="myForm"
          labelCol={{
            span: 6,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Nama Kategori"
            name="nama_kategori"
            rules={[
              {
                required: true,
                message: "required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
