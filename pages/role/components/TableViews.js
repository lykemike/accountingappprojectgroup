import React from "react";
import Link from "next/link";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";
import { Button, message, Modal, Table, Menu, Dropdown, Row, Col, Input } from "antd";
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
const { Search } = Input;

export default function TableViewsRole() {
  const { mutate } = useSWRConfig();
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/role/get-roles", fetcher);

  const handleDelete = async (role) => {
    Modal.confirm({
      title: `Are you sure, you want to delete "${role.role_name}" role?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/role/delete-role/" + role.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/role/get-roles");
          })
          .catch(function (error) {
            message.error(error.response.data.message);
          });
      },
    });
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "role_name",
      sorter: (a, b) => a.role_name.length - b.role_name.length,
      sortDirections: ["descend"],
      width: 200,
    },
    {
      title: "Role Description",
      dataIndex: "role_desc",
      ellipsis: true,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (role) => (
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  label: (
                    <Link href={`/role/update/${role.id}`}>
                      <a>Edit Role</a>
                    </Link>
                  ),
                  key: "1",
                  icon: <EditOutlined />,
                },
                {
                  label: <a onClick={() => handleDelete(role)}>Delete Role</a>,
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
            <Link href="./role/add-role">
              <Button type="primary" icon={<PlusOutlined />}>
                Add Role
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
        dataSource={data?.getRoles ? data?.getRoles : []}
        loading={data?.getRoles ? false : true}
        onChange={onChange}
      />
    </>
  );
}
