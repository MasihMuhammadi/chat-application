import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("userId");
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL_TEST;

  const url = request.nextUrl.clone();

  if (!cookie) {
    if (url.pathname.includes("dashboard")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } else {
    try {
      const response = await axios.get(`${baseUrl}/api/user/get`, {
        headers: { Authorization: `Bearer ${cookie.value}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        const userData = response.data;

        const responseWithUser = NextResponse.next();
        responseWithUser.headers.set("X-User-Data", JSON.stringify(userData));
        if (url.pathname.includes("login") || url.pathname == "/") {
          url.pathname = `/dashboard/${userData.data._id}`;
          return NextResponse.redirect(url);
        }

        return responseWithUser;
      }
    } catch (error) {
      console.log("Error fetching user data in middleware:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
