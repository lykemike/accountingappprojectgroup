import { Form, Input, message } from "antd";
import Cookie from "js-cookie";
import Router from "next/router";
import React from "react";
import axios from "../../libs/axios";

export default function Login() {
  const onFinish = (values) => {
    axios
      .post("/auth/login", values)
      .then(function (response) {
        Cookie.set("token", response.data.access_token);
        localStorage.setItem("_4cC3s5", response.data.access_token);
        // localStorage.setItem("_2eF2e5h")
        message.success(response.data.message);
        Router.push("/dashboard");
      })
      .catch(function (error) {
        message.error(error.response.data.message);
      });
  };

  return (
    <div className="p-40">
      <div className="p-10 mx-auto xs:p-0 md:w-full md:max-w-md">
        {/* <h1 className="mb-6 text-2xl font-bold text-center">PT. Hexaon Business Mitrasindo</h1> */}
        <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
        <div className="w-full bg-white divide-y divide-gray-200 rounded-lg shadow-2xl">
          <div className="px-5 py-7">
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              initialValues={{
                remember: true,
              }}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
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
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                {/* <Button type="primary" htmlType="submit">
                  Submit
                </Button> */}

                <button
                  htmlType="submit"
                  className="mt-4 transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                >
                  <span className="inline-block mr-2">Login</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="inline-block w-4 h-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
