import React from "react";
import Link from "next/link";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";
import { message, Modal, Table, Menu, Dropdown, Button, Row, Col, Input } from "antd";
import { PlusOutlined, DeleteOutlined, FileTextOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
const { Search } = Input;

export default function TableViewsJurnal() {
  const { mutate } = useSWRConfig();
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/jurnal/get-jurnals", fetcher);

  const handleDelete = async (jurnal) => {
    Modal.confirm({
      title: `Are you sure, you want to delete "Journal Entry #${jurnal.id}"?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/jurnal/delete-jurnal/" + jurnal.id)
          .then(function (response) {
            console.log(response);
            message.success(response?.data?.message);
            mutate("/jurnal/get-jurnals");
          })
          .catch(function (error) {
            message.error(error.response.data.message);
          });
      },
    });
  };

  const columns = [
    {
      title: "Reference",
      dataIndex: "ref",
      sorter: (a, b) => a.ref.length - b.ref.length,
      width: 200,
    },
    {
      title: "Tanggal Transaksi",
      dataIndex: "tgl_transaksi",
      width: 200,
    },
    {
      title: "Total Debit",
      dataIndex: "total_debit",
      width: 200,
    },
    {
      title: "Total Kredit",
      dataIndex: "total_kredit",
      width: 200,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (jurnal) => (
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  label: (
                    <Link href={`/jurnal/view/${jurnal.id}`}>
                      <a>View Jurnal</a>
                    </Link>
                  ),
                  key: "1",
                  icon: <FileTextOutlined />,
                },
                {
                  label: (
                    <Link href={`/jurnal/update/${jurnal.id}`}>
                      <a>Edit Jurnal</a>
                    </Link>
                  ),
                  key: "2",
                  icon: <EditOutlined />,
                },
                {
                  label: <a onClick={() => handleDelete(jurnal)}>Delete Jurnal</a>,
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
            <Link href="/jurnal/add-jurnal">
              <Button type="primary" icon={<PlusOutlined />}>
                Create Jurnal
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
        dataSource={data?.newJurnalsArray ? data?.newJurnalsArray : []}
        loading={data?.newJurnalsArray ? false : true}
        onChange={onChange}
      />
    </>
  );
}
