import React, { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/Link";
import jwtDecode from "jwt-decode";
import Cookie from "js-cookie";
import axios from "../libs/axios";

import { Layout, Menu, Dropdown, message } from "antd";
import {
  AuditOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FileTextOutlined,
  HomeOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default function NavSide({ children }) {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const get_token = localStorage.getItem("_4cC3s5");
    setUserInfo(jwtDecode(get_token));
  }, []);

  const handleLogout = () => {
    axios
      .post("/auth/logout", userInfo)
      .then(function (response) {
        Cookie.remove("token");
        localStorage.removeItem("_4cC3s5");
        message.success(response.data.message);
        Router.push("/");
      })
      .catch(function (error) {
        message.error("error");
      });
  };

  const navigationMenu = (
    <Menu
      items={[
        {
          label: (
            <Link href={`/user/update-profile/${userInfo?.id}`}>
              <a>Edit Profile</a>
            </Link>
          ),
          key: "1",
          icon: <UserOutlined />,
        },
        {
          label: <a onClick={handleLogout}>Logout</a>,
          key: "2",
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  return (
    <div>
      <Header style={{ background: "#fff" }} className="fixed z-50 w-full px-5 my-auto text-lg bg-white">
        {/* <div
          className="logo"
          style={{
            float: "left",
            width: "250px",
            height: " 31px",
            margin: "16px 24px 16px 0",
            background: "rgba(255, 255, 255, 0.3)",
          }}
        /> */}
        <div
          style={{
            float: "right",
          }}
        >
          <Dropdown overlay={navigationMenu}>
            <div className="text-neutral-800">Hello, {userInfo?.first_name}</div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Layout>
          <Sider
            collapsed={false}
            width={250}
            breakpoint="lg"
            className="z-50 md:relative"
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 64,
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              // theme="dark"
              style={{
                height: "100%",
                borderRight: 0,
              }}
            >
              <Menu
                mode="inline"
                style={{ height: "100%", borderRight: 0 }}
                // theme="dark"
              >
                <Menu.Item key="/dashboard" icon={<HomeOutlined />}>
                  <Link href="/dashboard">Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="/laporan" icon={<FileTextOutlined />}>
                  <Link href="/laporan">Laporan</Link>
                </Menu.Item>

                <SubMenu key="sub1" icon={<DollarOutlined />} title="Transaction">
                  <Menu.Item key="/jurnal">
                    <Link href="/jurnal">Jurnal</Link>
                  </Menu.Item>
                  <Menu.Item key="/pembelian">
                    <Link href="/pembelian">Pembelian</Link>
                  </Menu.Item>
                  <Menu.Item key="/penjualan">
                    <Link href="/penjualan">Penjualan</Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key="sub2" icon={<DatabaseOutlined />} title="Master Data">
                  <Menu.Item key="/daftar-akun">
                    <Link href="/daftar-akun">Daftar Akun</Link>
                  </Menu.Item>
                  <Menu.Item key="/kontak">
                    <Link href="/kontak">Kontak</Link>
                  </Menu.Item>
                  <Menu.Item key="/pajak">
                    <Link href="/pajak">Pajak</Link>
                  </Menu.Item>
                  <Menu.Item key="/produk">
                    <Link href="/produk">Produk</Link>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key="sub3" icon={<UserOutlined />} title="User & Role">
                  <Menu.Item key="/user">
                    <Link href="/user">User</Link>
                  </Menu.Item>
                  <Menu.Item key="/role">
                    <Link href="/role">Role</Link>
                  </Menu.Item>
                </SubMenu>

                <Menu.Item key="/audit" icon={<AuditOutlined />}>
                  <Link href="/audit">Audit Log</Link>
                </Menu.Item>
              </Menu>
            </Menu>
          </Sider>
          <Layout
            className="h-full mt-16"
            style={{
              marginLeft: 250,
              padding: "0 24px 24px",
            }}
          >
            <div
              style={{
                margin: "16px 0",
                minHeight: "100vh",
              }}
            >
              {children}
            </div>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
