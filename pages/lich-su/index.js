import React from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/react";
import db from "../../utils/db";
import Order from "../../models/Order";

export default function OrderHistory({ orders }) {
  return (
    <>
      <Head>
        <title>Lịch sử đơn hàng</title>
      </Head>
      <div className="max-w-6xl mx-auto p-4">
        <h3 className="text-2xl font-bold mb-4">Lịch sử đặt hàng</h3>
        {orders.length === 0 ? (
          <p className="text-center">
            Bạn chưa có đơn hàng nào.{" "}
            <Link href="/" className="text-blue-500 hover:underline">
             Tiếp tục mua sắm
            </Link>
          </p>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Mã đơn hàng
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Ngày đặt
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phương thức
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phí vận chuyển
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tổng thanh toán
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Chi tiết
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{order._id}</td>
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{order.status}</td>
                    <td className="px-6 py-4">{order.paymentMethod}</td>
                    <td className="px-6 py-4">
                      {order.shippingFee.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {order.finalTotal.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/order/${order._id}`} className="text-blue-600 hover:underline">
                        Xem chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  await db.connectDb();
  const orders = await Order.find({ user: session.user.id }).lean();

  // Làm sạch dữ liệu để đảm bảo JSON-serializable
  const ordersCleaned = orders.map((order) => ({
    ...order,
    _id: order._id.toString(),
    user: order.user ? order.user.toString() : null,
    createdAt: order.createdAt.toString(),
    orderItems: order.orderItems.map((item) => ({
      ...item,
      _id: item._id ? item._id.toString() : null,
      product:
        item.product && typeof item.product === "object" && item.product._id
          ? item.product._id.toString()
          : item.product
          ? item.product.toString()
          : null,
    })),
  }));

  return {
    props: { orders: ordersCleaned },
  };
}
