'use client';

import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import * as z from 'zod';
import { Button } from '@/components/auth_ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/auth_ui/Form';
import { Input } from '@/components/auth_ui/Input';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import BarLoader from 'react-spinners/BarLoader';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, 'Name should have at least 2 characters.')
      .max(50, 'Name should not exceed 50 characters.')
      .refine(
        (value) => /^[a-zA-Z0-9]+[-'s]?[a-zA-Z0-9 ]+$/.test(value),
        'Name should contain only alphabets and numbers.',
      ),
    email: z.string().email('Email must be valid.'),
    numberPhone: z
      .string()
      .min(10, 'Phone number should have at least 10 characters.'),
    password: z.string().min(6, 'Password should have at least 6 characters.'),
    confirmPassword: z
      .string()
      .min(6, 'Password should have at least 6 characters.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords does not match.',
    path: ['confirmPassword'],
  });

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      numberPhone: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://intelli-space-v1.azurewebsites.net/api/auth/register',
        values,
      );

      if (response.data.content.includes('has been registered')) {
        toast.error(<div>Notification: {response.data.content}</div>);
      } else {
        // console.log(response.data);
        router.push('/signin');
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let userId;
    if (typeof window !== 'undefined') {
      userId = localStorage.getItem('userId');
    }
    if (userId !== null) {
      router.push('/dashboard');
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={8000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="registerWrapper drop-shadow-md"
      >
        <div className="formWrapper ">
          <div className="left">
            <h3 className="title">Welcome back!</h3>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <Link href={'/signin'}>
              <Button className="px-8 text-gray-900 border rounded-full border-zinc-500 hover:border-gray-900 hover:font-bold hoverScale">
                Sign in
              </Button>
            </Link>
          </div>
          <div className="right">
            <h3 className="text-2xl font-semibold text-center">
              Register here
            </h3>
            {/*<div className="socialRegisterOptions drop-shadow-md ">*/}
            {/*  <Button className="socialFormBtn hoverScale">*/}
            {/*    <FcGoogle className="w-10 h-10" />*/}
            {/*  </Button>*/}
            {/*  <Button className="socialFormBtn hoverScale">*/}
            {/*    <SiGithub className="w-10 h-10" />*/}
            {/*  </Button>*/}
            {/*</div>*/}
            {/*<p className="text-center">or use this option</p>*/}
            <Form {...form}>
              <form
                className="flex-col flexCenter drop-shadow-md"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="Your username"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="errorFormat">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="email@intellispace.com"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="errorFormat">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="numberPhone"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="Your phone number"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="errorFormat">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="********"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="errorFormat">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="********"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      {fieldState.error && (
                        <p className="errorFormat">
                          {fieldState.error.message}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-1/3 mt-4 border-1 border-blue-300 text-blue-500 border-solid rounded-lg shadow-lg flexCenter hoverScale hover:border-blue-200 hover:bg-blue-300/50 hover:text-white tracking-wide"
                >
                  {isLoading ? (
                    <div className="flexCenter drop-shadow-md">
                      <BarLoader
                        color="#1351ae"
                        height={8}
                        loading
                        speedMultiplier={1}
                        width={100}
                      />
                    </div>
                  ) : (
                    'REGISTER'
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Page;
