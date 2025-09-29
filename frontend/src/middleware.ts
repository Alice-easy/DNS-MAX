import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要认证的路径
const protectedPaths = [
  '/dashboard',
  '/providers',
  '/domains',
  '/dns-records',
  '/profile',
];

// 认证相关的路径
const authPaths = ['/auth/login', '/auth/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否有token（从cookie或通过header中的localStorage传递）
  const cookieToken = request.cookies.get('token')?.value;
  // 在服务端无法直接访问localStorage，所以优先检查cookie
  // 如果没有cookie token，则认为未认证（前端应该设置cookie）
  const isAuthenticated = !!cookieToken;

  // 如果是受保护的路径但用户未认证，重定向到登录页
  if (
    protectedPaths.some(path => pathname.startsWith(path)) &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 如果用户已认证但访问认证页面，重定向到仪表盘
  if (authPaths.some(path => pathname.startsWith(path)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
