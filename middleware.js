import { NextResponse } from "next/server";

export const middleware = (request) => {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login";
  const isAdminPath = path.startsWith("/admin");

  const cookie = request.cookies.get("accessToken")?.value || "";
  // console.log(cookie);


if (isAdminPath && !cookie) {
  return NextResponse.redirect(new URL("/login", request.nextUrl));
}
if (isPublicPath && cookie) {
  return NextResponse.redirect(new URL("/admin", request.nextUrl));
  
}
if (path === "/productlist" && !cookie) {
  return NextResponse.redirect(new URL("/login", request.nextUrl));
  
}
}


  // if (isPublicPath) {
  //   if (role === "accessToken") {
  //     return NextResponse.redirect(new URL("/", request.nextUrl));
  //   }
  //   else{
  //     return NextResponse.redirect(new URL("/login", request.nextUrl));
  //   }
  // }

  // if (isAdminPath) {
  //   if (isLoggedIn) {
  //     return NextResponse.redirect(new URL("/Login", request.nextUrl));
  //   }else if (role !== "accessToken") {
  //         return NextResponse.redirect(new URL("/", request.nextUrl));
  //       }

  // }

//   if (isPublicPath && isLoggedIn) {
//     if (role === "accessToken") {
//       return NextResponse.redirect(new URL("/", request.nextUrl));
//     } else {
//       return NextResponse.redirect(new URL("/", request.nextUrl));
//     }
//   }
//   if (isAdminPath) {
//     if (!isLoggedIn) {
//       // role === "" role blank
//       return NextResponse.redirect(new URL("/Login", request.nextUrl));
//     } else if (role !== "accessToken") {
//       return NextResponse.redirect(new URL("/", request.nextUrl));
//     }
//   }
//   if (path === "/Profile" && role == "") {
//     return NextResponse.redirect(new URL("/Login", request.nextUrl));
//   }
// };
