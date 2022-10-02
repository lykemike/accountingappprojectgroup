import React from "react";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import axios from "../../../libs/axios";
import CardMax from "../../../components/CardMax";
import { authPage } from "../../../middlewares/authorizationPage";
import { Breadcrumb, Button, Checkbox, Divider, Form, Input, message, Skeleton, Select, Typography } from "antd";
import { BankOutlined, FileOutlined, InfoCircleOutlined, ProfileOutlined } from "@ant-design/icons";
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;
const { Title } = Typography;

const fetcher = (url) => axios.get(url).then((response) => response.data);
const API = "/kontak/read-kontak/";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);
  const { kontakId } = context.params;
  const kontakInfo = await fetcher(API + kontakId);

  return {
    props: {
      fallback: {
        [API]: kontakInfo,
      },
    },
  };
}

function ViewKontak() {
  const { data } = useSWR(API);

  const inputWidth = "80%";
  return (
    <div>
      <div className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Kontak</Breadcrumb.Item>
          <Breadcrumb.Item>View Kontak</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Form
          fields={data?.fields}
          name="basic"
          labelAlign="left"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete="off"
        >
          <div class="flex">
            <div class="flex-1">
              <div className="flex space-x-2">
                <InfoCircleOutlined style={{ fontSize: "26px" }} />
                <Title level={3}>Informasi Kontak</Title>
              </div>
            </div>
            <div class="flex-none">
              <Link href={`/kontak/update/${data.viewKontak.id}`}>
                <Button type="primary">Edit</Button>
              </Link>
            </div>
          </div>

          <Form.Item
            label="Tipe Kontak (dapat pilih lebih dari 1)"
            name="kategori_kontak"
            rules={[
              {
                required: true,
                message: "must select atleast 1 tipe kontak",
              },
            ]}
          >
            <CheckboxGroup disabled options={data?.kategoriOptions} />
          </Form.Item>

          <Divider />
          <div className="flex space-x-2">
            <ProfileOutlined style={{ fontSize: "26px" }} />
            <Title level={3}>Informasi Umum</Title>
          </div>

          <Form.Item label="Nama Kontak">
            <Input.Group compact>
              <Form.Item name={["info_kontak", "gelar_id"]} noStyle>
                <Select
                  disabled
                  placeholder="Select title"
                  style={{
                    width: "20%",
                  }}
                >
                  {data?.getGelar?.map((i) => (
                    <Option value={i.id}>{i.nama}</Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name={["info_kontak", "nama_kontak"]} noStyle>
                <Input
                  disabled
                  style={{
                    width: "60%",
                  }}
                  placeholder="Input nama kontak"
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item label="No. Handphone" name="nomor_hp">
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "required",
              },
            ]}
          >
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item label="Jabatan" name="jabatan">
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item
            label="Nama Perusahaan"
            name="nama_perusahaan"
            rules={[
              {
                required: true,
                message: "required",
              },
            ]}
          >
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item
            label="Telepon"
            name="nomor_telepon"
            rules={[
              {
                required: true,
                message: "required",
              },
            ]}
          >
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item label="Fax" name="nomor_fax">
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item
            label="NPWP"
            name="nomor_npwp"
            rules={[
              {
                required: true,
                message: "required",
              },
            ]}
          >
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item
            label="Alamat Perusahaan"
            name="alamat_perusahaan"
            rules={[
              {
                required: true,
                message: "required",
              },
            ]}
          >
            <Input.TextArea
              disabled
              showCount
              maxLength={200}
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Divider />
          <div className="flex space-x-2">
            <BankOutlined style={{ fontSize: "26px" }} />
            <Title level={3}>Daftar Bank</Title>
          </div>

          <Form.Item
            label="Nama Bank"
            name="nama_bank"
            rules={[
              {
                required: true,
                message: "required",
              },
            ]}
          >
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item
            label="Kantor Cabang Bank"
            name="kantor_cabang_bank"
            rules={[
              {
                required: true,
                message: "required",
              },
            ]}
          >
            <Input.TextArea
              disabled
              showCount
              maxLength={200}
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item label="Nomor Rekening" name="nomor_rekening">
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Form.Item label="Atas Nama" name="atas_nama">
            <Input
              disabled
              style={{
                width: inputWidth,
              }}
            />
          </Form.Item>

          <Divider />
          <div className="flex space-x-2">
            <FileOutlined style={{ fontSize: "26px" }} />
            <Title level={3}>Informasi Kontak</Title>
          </div>

          <Form.Item
            label="Akun Piutang"
            name="akun_piutang_id"
            rules={[
              {
                required: true,
                message: "required!",
              },
            ]}
          >
            <Select
              disabled
              showSearch
              placeholder="Select a akun piutang"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              style={{
                width: inputWidth,
              }}
            >
              {data?.getAkunPiutang?.map((i) => (
                <Option value={i.id}>
                  {i.kode_akun} - {i.nama_akun}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Akun Hutang"
            name="akun_hutang_id"
            rules={[
              {
                required: true,
                message: "required!",
              },
            ]}
          >
            <Select
              disabled
              showSearch
              placeholder="Select a akun hutang"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              style={{
                width: inputWidth,
              }}
            >
              {data?.getAkunHutang?.map((i) => (
                <Option value={i.id}>
                  {i.kode_akun} - {i.nama_akun}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Syarat Pembayaran"
            name="syarat_pembayaran_id"
            rules={[
              {
                required: true,
                message: "required!",
              },
            ]}
          >
            <Select
              disabled
              showSearch
              placeholder="Select a syarat pembayaran"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              style={{
                width: inputWidth,
              }}
            >
              {data?.getSyaratPembayaran?.map((i) => (
                <Option value={i.id}>{i.nama}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </CardMax>
    </div>
  );
}

export default function App({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <ViewKontak />
    </SWRConfig>
  );
}
