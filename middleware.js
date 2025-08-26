import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/dang-nhap") || 
                      req.nextUrl.pathname.startsWith("/dang-ky");
    const isAdminPage = req.nextUrl.pathname.startsWith("/dashboard") ||
                       req.nextUrl.pathname.startsWith("/admin");
    const isSetupPage = req.nextUrl.pathname.startsWith("/admin/setup");

    // Nếu đang truy cập trang setup admin
    if (isSetupPage) {
      return NextResponse.next();
    }

    // Nếu đang truy cập trang đăng nhập/đăng ký và đã đăng nhập
    if (isAuthPage) {
      if (isAuth) {
        // Nếu là admin, chuyển đến dashboard
        if (token.role === "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        // Nếu là user thường, chuyển về trang chủ
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

    // Nếu đang truy cập trang admin mà chưa đăng nhập
    if (isAdminPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL("/dang-nhap", req.url));
      }
      
      // Nếu đã đăng nhập nhưng không phải admin
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*", 
    "/dang-nhap",
    "/dang-ky"
  ],
};
