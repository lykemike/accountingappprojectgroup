import React from "react";
import Router from "next/router";
import useSWR, { SWRConfig } from "swr";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";

import { Breadcrumb, Button, Form, Input, Checkbox, message, Row, Col } from "antd";
const CheckboxGroup = Checkbox.Group;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/role/get-menu";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const menuInfo = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: menuInfo,
      },
    },
  };
}

function AddRole() {
  const { data, error } = useSWR(API);

  const onFinish = (values) => {
    axios
      .post("/role/create-role", values)
      .then(function (response) {
        message.success(response.data.message);
        Router.push("/role");
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Role</Breadcrumb.Item>
          <Breadcrumb.Item>Add Role</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 6 }} />
          <Col xs={{ span: 24 }} md={{ span: 10 }}>
            <Form
              name="basic"
              labelAlign="left"
              id="add-roles-form"
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
                label="Role Name"
                name="role_name"
                rules={[
                  {
                    required: true,
                    message: "required!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Role Description" name="role_description">
                <Input.TextArea showCount maxLength={100} />
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
      <AddRole />
    </SWRConfig>
  );
}
