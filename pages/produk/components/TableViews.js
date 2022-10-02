import React, { useState } from "react";
import Link from "next/link";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";
import Buttons from "../../../components/Buttons";
import * as XLSX from "xlsx";

import { Button, message, Modal, Table, Dropdown, Menu, Input, Row, Col } from "antd";
import { PlusOutlined, DeleteOutlined, FileTextOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";

const { Search } = Input;

export default function TableViewsProduk() {
  const { mutate } = useSWRConfig();
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/produk/get-produks", fetcher);

  const [search, setSearch] = useState([]);

  const onSearch = (value) => {
    if (value !== "") {
      setSearch(data?.newProduksArray.filter((i) => i.nama.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSearch([]);
    }
  };

  const handleList = () => {
    return search.length > 0 ? search : data?.newProduksArray;
  };

  function exportProduk() {
    let produks = [];
    data?.newProduksArray.map((i) => {
      produks.push({
        "Nama Produk": i.nama,
        Kategori: i.kategori,
        Harga: i.harga,
        "Akun Penjualan": i.akun,
      });
    });
    const header_excel = produks;
    var ws = XLSX.utils.json_to_sheet(header_excel);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "List Produk");
    XLSX.writeFile(wb, "list_produk.xlsx");
  }

  const handleDelete = async (produk) => {
    Modal.confirm({
      title: `Are you sure, you want to delete ${produk.nama}?`,
      okText: "Confirm",
      okType: "danger",
      onOk: () => {
        axios
          .delete("/produk/delete-produk/" + produk.id)
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
      title: "Nama Produk",
      dataIndex: "nama",
      sorter: (a, b) => a.nama.length - b.nama.length,
      sortDirections: ["descend"],
      width: 300,
    },
    {
      title: "Deskripsi",
      dataIndex: "deskripsi",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Harga",
      dataIndex: "harga",
      width: 200,
    },
    {
      title: "Kategori",
      dataIndex: "kategori",
      width: 200,
    },
    {
      title: "Akun Penjualan",
      dataIndex: "akun",
      width: 300,
    },
    {
      title: "Actions",
      width: 100,
      align: "center",
      render: (produk) => (
        <div className="space-x-2">
          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    label: (
                      <Link href={`/produk/view/${produk.id}`}>
                        <a>View Produk</a>
                      </Link>
                    ),
                    key: "1",
                    icon: <FileTextOutlined />,
                  },
                  {
                    label: (
                      <Link href={`/produk/update/${produk.id}`}>
                        <a>Edit Produk</a>
                      </Link>
                    ),
                    key: "2",
                    icon: <EditOutlined />,
                  },
                  {
                    label: <a onClick={() => handleDelete(produk)}>Delete Produk</a>,
                    key: "3",
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
      <Row gutter={16} className="mb-4">
        <Col span={4}>
          <Search placeholder="search" onSearch={onSearch} enterButton />
        </Col>
        <Col span={20}>
          <div className="flex justify-end space-x-2">
            <Button onClick={exportProduk}>Ekspor</Button>
            <Link href="./produk/kategori">
              <Button type="primary">Kategori</Button>
            </Link>
            <Link href="./produk/add-produk">
              <Button type="primary" icon={<PlusOutlined />}>
                Add Produk
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
        dataSource={handleList() ? handleList() : []}
        loading={handleList() ? false : true}
        onChange={onChange}
      />
    </div>
  );
}
