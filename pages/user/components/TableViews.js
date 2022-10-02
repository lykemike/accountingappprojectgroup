import React from "react";
import Link from "next/link";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";
import { Button, message, Modal, Table, Menu, Dropdown, Row, Col, Input } from "antd";
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
const { Search } = Input;

export default function TableViewsUser() {
  const { mutate } = useSWRConfig();
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/user/get-users", fetcher);

  const handleDelete = async (user) => {
    Modal.confirm({
      title: `Are you sure, you want to delete "${user.first_name}" user?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/user/delete-user/" + user.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/user/get-users");
          })
          .catch(function (error) {
            message.error(error.response.data.message);
          });
      },
    });
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      sorter: (a, b) => a.first_name.length - b.first_name.length,
      sortDirections: ["descend"],
      width: 200,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Role",
      dataIndex: "role_name",
      width: 200,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (user) => (
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  label: (
                    <Link href={`/user/update/${user.id}`}>
                      <a>Edit User</a>
                    </Link>
                  ),
                  key: "1",
                  icon: <EditOutlined />,
                },
                {
                  label: <a onClick={() => handleDelete(user)}>Delete User</a>,
                  key: "2",
                  icon: <DeleteOutlined />,
                },
              ]}
            />
          }
        >
          <Button size="small" type="primary" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <>
      <Row gutter={16} className="mb-4">
        <Col span={4}>
          <Search
            placeholder="search"
            // onSearch={onSearch}
            enterButton
          />
        </Col>
        <Col span={20}>
          <div name="primary-button" className="flex justify-end mb-4">
            <Link href="./user/add-user">
              <Button type="primary" icon={<PlusOutlined />}>
                Add User
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Table
        bordered
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data?.newUsersArray ? data?.newUsersArray : []}
        loading={data?.newUsersArray ? false : true}
        onChange={onChange}
      />
    </>
  );
}
