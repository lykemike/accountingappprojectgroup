import React from "react";
import Link from "next/link";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";
import { Button, message, Modal, Table, Dropdown, Menu, Input, Row, Col } from "antd";
import { DeleteOutlined, FileTextOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
const { Search } = Input;

export default function tableViewsClient() {
  const { mutate } = useSWRConfig();
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/kontak/get-kontak", fetcher);

  const handleDelete = async (kontak) => {
    Modal.confirm({
      title: `Are you sure, you want to delete ${kontak.nama_perusahaan}?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/kontak/delete-kontak/" + kontak.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/kontak/get-kontak");
          })
          .catch(function (error) {
            message.error(error.response.data.message);
          });
      },
    });
  };

  const columns = [
    {
      title: "Nama",
      dataIndex: "nama",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Nama Perusahaan",
      dataIndex: "nama_perusahaan",
      sorter: (a, b) => a.nama_perusahaan.length - b.nama_perusahaan.length,
      sortDirections: ["descend"],
      width: 200,
      ellipsis: true,
    },
    {
      title: "Alamat Perusahaan",
      dataIndex: "alamat_perusahaan",
      ellipsis: true,
      width: 200,
    },

    {
      title: "Nama Bank",
      dataIndex: "nama_bank",
      width: 200,
      ellipsis: true,
    },
    {
      title: "NPWP",
      dataIndex: "nomor_npwp",
      width: 200,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (kontak) => (
        <div className="space-x-2">
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    label: (
                      <Link href={`/kontak/view/${kontak.id}`}>
                        <a>View Kontak</a>
                      </Link>
                    ),
                    key: "1",
                    icon: <FileTextOutlined />,
                  },
                  {
                    label: (
                      <Link href={`/kontak/update/${kontak.id}`}>
                        <a>Edit Kontak</a>
                      </Link>
                    ),
                    key: "3",
                    icon: <EditOutlined />,
                  },
                  {
                    label: <a onClick={() => handleDelete(kontak)}>Delete Kontak</a>,
                    key: "4",
                    icon: <DeleteOutlined />,
                  },
                ]}
              />
            }
          >
            <Button size="small" type="primary" icon={<MoreOutlined />} />
          </Dropdown>
        </div>
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
        <Col span={20} />
      </Row>
      <Table
        bordered
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data?.getAllClients ? data?.getAllClients : []}
        loading={data?.getAllClients ? false : true}
        onChange={onChange}
      />
    </>
  );
}
