import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import CustomDataTable from "../../components/backend/dashboard/CustomDataTable";
import AdminLayout from "../../components/layout/AdminLayout";
import Heading from "../../components/backend/Heading";
import { GetServerSidePropsContext } from "next";
import OrderStats from '../../components/ecobacgiang/OrderStats';

export default function Dashboard({ user }: { user: { role: string } }) {
  return (
    <AdminLayout title="Dashboard">
      <Heading title="Dashboard" />
      <div className="p-8 bg-white dark:bg-slate-900  min-h-screen">
        <OrderStats />
        <CustomDataTable />
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { user: session.user as { role: string } } };
}