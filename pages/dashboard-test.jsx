import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

export default function DashboardTest({ serverUser }) {
  const { data: session, status } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Test (No Role Check)</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Client Session:</h2>
          <p>Status: {status}</p>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Server User:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(serverUser, null, 2)}
          </pre>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Access Status:</h2>
          <p>Client Role: {session?.user?.role || "No role"}</p>
          <p>Server Role: {serverUser?.role || "No role"}</p>
          <p>Is Admin: {serverUser?.role === "admin" ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    console.log("Dashboard test - getServerSideProps called");
    
    const session = await getServerSession(context.req, context.res, authOptions);
    console.log("Dashboard test - session:", session);

    if (!session || !session.user) {
      console.log("Dashboard test - No session, redirecting");
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    console.log("Dashboard test - Session found, allowing access");
    
    // Serialize user data
    const userData = {
      id: session.user.id,
      name: session.user.name,
      role: session.user.role,
      email: session.user.email,
      image: session.user.image,
      emailVerified: session.user.emailVerified,
      gender: session.user.gender,
      phone: session.user.phone,
      dateOfBirth: session.user.dateOfBirth,
      hasAddresses: session.user.hasAddresses,
      hasWishlist: session.user.hasWishlist
    };

    return {
      props: {
        serverUser: userData
      }
    };
  } catch (error) {
    console.error("Dashboard test - error:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
