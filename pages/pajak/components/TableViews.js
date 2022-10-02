import React from "react";
import Link from "next/link";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";
import Buttons from "../../../components/Buttons";
import { Button, message, Modal, Table, Dropdown, Menu } from "antd";
import { CheckSquareOutlined, DeleteOutlined, FileTextOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";

export default function TableViewsPajak() {
  const { mutate } = useSWRConfig();
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/pajak/get-pajaks", fetcher);

  const handleDelete = async (pajak) => {
    console.log(pajak);
    Modal.confirm({
      title: `Are you sure, you want to delete ${pajak.nama}?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/pajak/delete-pajak/" + pajak.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/pajak/get-pajaks");
          })
          .catch(function (error) {
            message.error(error.response.data.message);
          });
      },
    });
  };

  const columns = [
    {
      title: "Pajak Nama",
      dataIndex: "nama",
      sorter: (a, b) => a.nama.length - b.nama.length,
      sortDirections: ["descend"],
      width: 300,
    },
    {
      title: "Presentase Aktif",
      dataIndex: "presentase_aktif",
      ellipsis: true,
      width: 200,
      render: (pajak) => <span>{pajak}%</span>,
    },
    {
      title: "Pajak Keluaran",
      dataIndex: "pajak_keluaran",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Pajak Masukan",
      dataIndex: "pajak_masukan",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (pajak) => (
        <div className="space-x-2">
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    label: (
                      <Link href={`/pajak/update/${pajak.id}`}>
                        <a>Edit Pajak</a>
                      </Link>
                    ),
                    key: "1",
                    icon: <EditOutlined />,
                  },
                  {
                    label: <a onClick={() => handleDelete(pajak)}>Delete Pajak</a>,
                    key: "2",
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
      <Table
        bordered
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data?.newPajakArray ? data?.newPajakArray : []}
        loading={data?.newPajakArray ? false : true}
        onChange={onChange}
      />
    </>
  );
}
