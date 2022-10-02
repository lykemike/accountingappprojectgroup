import React from "react";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";

import { Breadcrumb, Button, Form, Input, message, Row, Col, Select } from "antd";
const { Option } = Select;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/role/get-roles";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const roleInfo = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: roleInfo,
      },
    },
  };
}

function AddUser() {
  const { data, error } = useSWR(API);
  const onFinish = (values) => {
    axios
      .post("/user/create-user", values)
      .then(function (response) {
        message.success(response.data.message);
        Router.push("/user");
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Add User</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 6 }} />
          <Col xs={{ span: 24 }} md={{ span: 10 }}>
            <Form
              name="basic"
              labelAlign="left"
              id="add-user-form"
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
                label="First Name"
                name="first_name"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Last Name" name="last_name">
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role_id"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a role"
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {data?.getRoles?.map((i) => (
                    <Option value={i.id}>{i.role_name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="flex justify-end">
                <Button htmlType="submit" type="primary">
                  Submit
                </Button>
              </div>
            </Form>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 8 }} />
        </Row>
      </CardMax>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <AddUser />
    </SWRConfig>
  );
}
