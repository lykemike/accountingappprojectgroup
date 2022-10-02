import React from "react";
import useSWR, { SWRConfig } from "swr";
import axios from "../../libs/axios";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";
import { Breadcrumb, Button, Table } from "antd";

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/audit/get-audits";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const auditLogInfo = await fetcher(API);

  return {
    props: {
      fallback: {
        [API]: auditLogInfo,
      },
    },
  };
}

function AuditLog() {
  const { data, error } = useSWR(API);

  const columns = [
    {
      title: "User",
      key: "user",
      width: 400,
      render: (audit) => (
        <>
          <span className="text-sm">{audit.user}</span>
          <br />
          <span className="text-sm text-gray-400">{audit.role}</span>
        </>
      ),
    },
    {
      title: "Method",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (action) => {
        if (action == "UPDATE") {
          return <span className="text-blue-600 font-sans font-semibold ">{action}</span>;
        } else if (action == "CREATE" || action == "LOGIN") {
          return <span className="text-green-600 font-sans font-semibold ">{action}</span>;
        } else if (action == "DELETE" || action == "LOGOUT") {
          return <span className="text-red-600 font-sans font-semibold ">{action}</span>;
        }
      },
    },
    {
      title: "Timestamp",
      key: "time",
      width: 100,
      render: (audit) => (
        <>
          <span className="text-sm">{audit.date}</span>
          <br />
          <span className="text-sm text-gray-400">{audit.time}</span>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Audit Log</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Table
          size="small"
          columns={columns}
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: (record) => (
              <p
                className="font-mono italic "
                style={{
                  margin: 0,
                }}
              >
                {record.description}
              </p>
            ),
            rowExpandable: (record) => record.user !== "Not Expandable",
          }}
          dataSource={data?.newAuditArray ? data?.newAuditArray : []}
        />
      </CardMax>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <AuditLog />
    </SWRConfig>
  );
}
