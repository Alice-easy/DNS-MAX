'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: api.register,
    onSuccess: async data => {
      try {
        // 获取用户信息
        const user = await api.getCurrentUser();
        setAuth(user, data.access_token);
        router.push('/dashboard');
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        setError('注册成功但获取用户信息失败');
      }
    },
    onError: (error: unknown) => {
      console.error('Registration failed:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 400) {
          setError('用户名已存在，请选择其他用户名');
        } else {
          setError('注册失败，请稍后重试');
        }
      } else {
        setError('注册失败，请稍后重试');
      }
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">DNS Max</h1>
          <p className="text-gray-600">域名二次分发管理系统</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>创建账户</CardTitle>
            <CardDescription>注册新账户以开始管理您的域名DNS</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700"
                >
                  用户名
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  {...register('username')}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-red-600 text-sm">
                    {errors.username.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  用户名只能包含字母、数字、下划线和短横线
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  密码
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  确认密码
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="请再次输入密码"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || registerMutation.isPending}
              >
                {isSubmitting || registerMutation.isPending
                  ? '注册中...'
                  : '注册'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                已有账户？{' '}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  立即登录
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
