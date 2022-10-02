import React from "react";
import Link from "next/link";
import CardMax from "../../components/CardMax";
import TableViews from "./components/TableViews";
import { authPage } from "../../middlewares/authorizationPage";

import { Breadcrumb, Button, Row, Col, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Search } = Input;
const onSearch = (value) => console.log(value);

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  return {
    props: {},
  };
}

export default function Pajak() {
  return (
    <div>
      <div name="breadcrumb" className="mb-4">
        <Breadcrumb>
          <Breadcrumb.Item>Pajak</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Row gutter={16}>
          <Col span={4}>
            <Search placeholder="search" onSearch={onSearch} enterButton />
          </Col>
          <Col span={20}>
            <div className="flex justify-end mb-4">
              <Link href="./pajak/add-pajak">
                <Button type="primary" icon={<PlusOutlined />}>
                  Add Pajak
                </Button>
              </Link>
            </div>
          </Col>
        </Row>

        <TableViews />
      </CardMax>
    </div>
  );
}
