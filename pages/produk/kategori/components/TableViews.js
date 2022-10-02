import React from "react";
import Link from "next/link";
import useSwr, { useSWRConfig } from "swr";
import EditModal from "./EditModal";
import axios from "../../../../libs/axios";
import Buttons from "../../../../components/Buttons";
import { Button, message, Modal, Table, Dropdown, Menu } from "antd";
import { CheckSquareOutlined, DeleteOutlined, FileTextOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";

export default function TableViewsKategoriProduk() {
  const { mutate } = useSWRConfig();
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/produk/get-produks", fetcher);

  const handleDelete = async (kategori) => {
    Modal.confirm({
      title: `Are you sure, you want to delete "${kategori.nama}" kategori?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/produk/delete-kategori/" + kategori.id)
          .then(function (response) {
            message.success(response?.data?.message);
            mutate("/produk/get-produks");
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
      sorter: (a, b) => a.nama.length - b.nama.length,
      sortDirections: ["descend"],
      width: 300,
    },
    {
      title: "Jumlah Produk",
      dataIndex: "jumlah",
      width: 300,
    },

    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (kategori) => (
        <div className="space-x-2">
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    label: <EditModal kategoriId={kategori.id} />,
                    key: "1",
                    icon: <FileTextOutlined />,
                  },
                  {
                    label: <a onClick={() => handleDelete(kategori)}>Delete Kategori</a>,
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
    <div>
      <Table
        bordered
        size="small"
        scroll={{ x: 1000 }}
        columns={columns}
        dataSource={data?.getKategoriProduk ? data?.getKategoriProduk : []}
        loading={data?.getKategoriProduk ? false : true}
        onChange={onChange}
      />
    </div>
  );
}
