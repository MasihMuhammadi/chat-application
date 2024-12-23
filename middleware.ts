import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import axios from "axios";

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get("userId");
  const baseUrl = "https://chat-backend-qvhb.onrender.com";

  const url = request.nextUrl.clone();

  if (!cookie) {
    // If no userId cookie, redirect to login page if accessing dashboard
    if (url.pathname.includes("dashboard")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } else {
    // If userId cookie exists, attempt to fetch user data from the backend using axios
    try {
      const response = await axios.get(
        `${baseUrl}/api/user/get/${cookie.value}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        // Assuming the user data is returned in response.data
        const userData = response.data;

        // You can attach the user data in the response if needed, like setting cookies or headers
        const responseWithUser = NextResponse.next();
        responseWithUser.headers.set("X-User-Data", JSON.stringify(userData));

        // Redirect logged-in users to their dashboard if accessing login or homepage
        if (url.pathname.includes("login") || url.pathname == "/") {
          url.pathname = `/dashboard/${cookie.value}`;
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

// Middleware matcher to apply to all routes
export const config = {
  matcher: "/:path*",
};
