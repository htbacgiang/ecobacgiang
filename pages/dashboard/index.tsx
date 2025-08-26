import { useRouter } from "next/router";
import CustomDataTable from "../../components/backend/dashboard/CustomDataTable";
import AdminLayout from "../../components/layout/AdminLayout";
import Heading from "../../components/backend/Heading";
import OrderStats from '../../components/ecobacgiang/OrderStats';
import ConversationStats from '../../components/backend/ConversationStats';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import OrderList from "../../components/ecobacgiang/OrderList";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/dang-nhap");
      return;
    }

    if ((session.user as any)?.role !== "admin") {
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [session, status, router]);

  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Đang tải Dashboard...</div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold">Vui lòng đăng nhập...</div>
      </div>
    );
  }

  // Not admin
  if ((session.user as any)?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-red-600">Bạn không có quyền truy cập trang này</div>
      </div>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <Heading title="Dashboard" />
      <div className="p-8 bg-white dark:bg-slate-900 min-h-screen overflow-x-hidden max-w-full">
        <OrderStats />
        <ConversationStats />
        <OrderList />
        <CustomDataTable />
      </div>
    </AdminLayout>
  );
}