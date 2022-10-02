import React from "react";
import TableViews from "./components/TableViews";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";
import { Breadcrumb } from "antd";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  return {
    props: {},
  };
}

export default function DaftarAkun() {
  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Daftar Akun</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <TableViews />
      </CardMax>
    </div>
  );
}
