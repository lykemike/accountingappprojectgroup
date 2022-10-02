import React, { useState } from "react";
import Router from "next/router";
import Link from "next/link";
import useSwr, { useSWRConfig } from "swr";
import axios from "../../../libs/axios";
import { Button, message, Modal, Table, Row, Col, Input, Dropdown, Menu, Space } from "antd";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
const { Search } = Input;

export default function TableCoa() {
  const fetcher = (url) => axios.get(url).then((response) => response.data);
  const { data, error } = useSwr("/coa/get-coa", fetcher);

  const [search, setSearch] = useState([]);

  const onSearch = (value) => {
    if (value !== "") {
      setSearch(data?.newCoaArray.filter((i) => i.nama_akun.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSearch([]);
    }
  };

  const handleList = () => {
    return search.length > 0 ? search : data?.newCoaArray;
  };

  const buttonSize = "small";

  //   const handleDelete = async (user) => {
  //     Modal.confirm({
  //       title: `Are you sure, you want to delete "${user.first_name}" user?`,
  //       okText: "Confirm",
  //       okType: "danger",
  //       onOk: () => {
  //         axios
  //           .delete("/user/delete-user/" + user.id)
  //           .then(function (response) {
  //             message.success(response?.data?.message);
  //           })
  //           .catch(function (error) {
  //             message.error(error.response.data.message);
  //           });
  //       },
  //     });
  //   };

  const columns = [
    {
      title: "Kode Akun",
      dataIndex: "kode_akun",
      width: 100,
    },
    {
      title: "Nama Akun",
      dataIndex: "nama_akun",
      width: 300,
    },
    {
      title: "Kategori Akun",
      dataIndex: "kategori_akun",
      width: 100,
    },
    {
      title: "Saldo Awal Debit",
      dataIndex: "detail_saldo_debit",
      width: 100,
      render: (debit) => <span>Rp. {debit}</span>,
    },
    {
      title: "Saldo Awal Kredit",
      dataIndex: "detail_saldo_kredit",
      width: 100,
      render: (kredit) => <span>Rp. {kredit}</span>,
    },
    {
      title: "Saldo Saat Ini",
      dataIndex: "detail_saldo_sisa",
      width: 100,
      render: (sisa_saldo) => <span>Rp. {sisa_saldo}</span>,
    },
    // {
    //   title: "Actions",
    //   width: 100,
    //   render: (user) => (
    //     <div className="space-x-2">
    //       <Link href={`/user/${user.id}`}>
    //         <Button size={buttonSize}>Edit</Button>
    //       </Link>
    //       <Button size={buttonSize} onClick={() => handleDelete(user)}>
    //         Delete
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  const handleMenuClick = (e) => {
    if (e.key == "1") {
      Router.push("/daftar-akun/atur-saldo-awal");
    } else if (e.key == "2") {
      Router.push("/daftar-akun/penutupan-buku");
    }
  };

  const menu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: "Atur Saldo Awal",
          key: "1",
        },
        // {
        //   label: "Penutupan Buku",
        //   key: "2",
        // },
      ]}
    />
  );

  return (
    <>
      <Row gutter={16}>
        <Col span={4}>
          <Search placeholder="search" onSearch={onSearch} enterButton />
        </Col>
        <Col span={20}>
          <div className="flex justify-end mb-4 space-x-2">
            <Dropdown overlay={menu}>
              <Button>
                <Space>
                  Tindakan
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Link href="./daftar-akun/add-coa">
              <Button type="primary" icon={<PlusOutlined />}>
                Add Daftar Akun
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Table
        bordered
        size="small"
        scroll={{ x: 1500, y: 600 }}
        columns={columns}
        dataSource={handleList() ? handleList() : []}
        loading={handleList() ? false : true}
        onChange={onChange}
      />
    </>
  );
}
