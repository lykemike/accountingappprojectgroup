import React from "react";
import Link from "next/link";
import CardMax from "../../components/CardMax";
import { authPage } from "../../middlewares/authorizationPage";
import { Breadcrumb, Button, Row, Col, Card } from "antd";

export async function getServerSideProps(context) {
  const { token } = await authPage(context);

  return {
    props: {},
  };
}

export default function Laporan() {
  return (
    <div>
      <div name="breadcrumb" className="mb-2">
        <Breadcrumb>
          <Breadcrumb.Item>Laporan</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <CardMax>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <div className="space-y-4 font-sans">
              <Card className="shadow-sm hover:shadow-lg transform transition duration-500 hover:scale-105">
                <div className="text-2xl font-semibold text-sky-600">Jurnal Umum</div>
                <p className="text-sm ">menampilkan semua transaksi yang dilakukan</p>
                <Link href="../laporan/jurnal-umum">
                  <a>
                    <Button type="primary">Lihat Laporan</Button>
                  </a>
                </Link>
              </Card>

              <Card className="shadow-sm hover:shadow-lg transform transition duration-500 hover:scale-105">
                <div className="text-2xl font-semibold text-sky-600">Trial Balance</div>
                <p className="text-sm ">
                  menampilkan saldo dari setiap akun, termasuk saldo awal, pengerakan, dan saldo akhir dari periode yang ditentukan
                </p>
                <Link href="../laporan/trial-balance">
                  <a>
                    <Button type="primary">Lihat Laporan</Button>
                  </a>
                </Link>
              </Card>

              <Card className="shadow-sm hover:shadow-lg transform transition duration-500 hover:scale-105">
                <div className="text-2xl font-semibold text-sky-600">Neraca</div>
                <p className="text-sm ">
                  menampilkan apa yang anda miliki (aset), apa yang anda hutang (liabilitas), dan apa yang anda sudah investasikan pada
                  perusahaan anda (ekuitas)
                </p>
                <Link href="../laporan/neraca">
                  <a>
                    <Button type="primary">Lihat Laporan</Button>
                  </a>
                </Link>
              </Card>
            </div>
          </Col>

          <Col span={12}>
            <div className="space-y-4 font-sans">
              <Card className="shadow-sm hover:shadow-lg transform transition duration-500 hover:scale-105">
                <div className="text-2xl font-semibold text-sky-600">Buku Besar</div>
                <p className="text-sm ">menampilkan semua transaksi sesuai pengelompokan</p>
                <Link href="../laporan/buku-besar">
                  <a>
                    <Button type="primary">Lihat Laporan</Button>
                  </a>
                </Link>
              </Card>

              <Card className="shadow-sm hover:shadow-lg transform transition duration-500 hover:scale-105">
                <div className="text-2xl font-semibold text-sky-600">Laba Rugi</div>
                <p className="text-sm ">menampilkan setiap tipe transaksi dan jumlah total untuk pendapatan dan pengeluaran anda</p>
                <Link href="../laporan/laba-rugi">
                  <a>
                    <Button type="primary">Lihat Laporan</Button>
                  </a>
                </Link>
              </Card>

              <Card className="shadow-sm hover:shadow-lg transform transition duration-500 hover:scale-105">
                <div className="text-2xl font-semibold text-sky-600">Arus Kas</div>
                <p className="text-sm ">
                  laporan ini mengukur kas yang telah dihasilkan atau digunakan oleh suatu perusahaan dan menunjukkan detail pergerakannya
                  dalam suatu periode
                </p>
                <Link href="../laporan/arus-kas">
                  <a>
                    <Button type="primary">Lihat Laporan</Button>
                  </a>
                </Link>
              </Card>
            </div>
          </Col>
        </Row>
      </CardMax>
    </div>
  );
}
