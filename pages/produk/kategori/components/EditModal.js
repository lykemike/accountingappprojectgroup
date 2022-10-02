import React, { useState } from "react";
import useSwr, { useSWRConfig } from "swr";
import { Router } from "react-router-dom";
import axios from "../../../../libs/axios";
import Buttons from "../../../../components/Buttons";

import { Button, Modal, Form, Input, message } from "antd";

export default function EditModal({ kategoriId }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate } = useSWRConfig();
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/produk/read-kategori/" + kategoriId, fetcher);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onReset = () => {
    form.setFields(data?.fields);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    onReset();
  };

  const onFinish = (values) => {
    axios
      .put("/produk/update-kategori/" + kategoriId, values)
      .then(function (response) {
        message.success(response.data.message);
        mutate("/produk/get-produks");
        onReset();
        handleCancel();
        Router.push("/produks/kategori");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <a onClick={showModal}>Edit Kategori</a>
      <Modal
        title="Update Kategori"
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
          fields={data?.fields}
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
