'use client';
import React from 'react';
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
  FormMessage,
} from '@/components/auth_ui/Form';
import { Input } from '@/components/auth_ui/Input';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';

import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { CustomButton } from '@/app/(auth)/(routes)/signin/[[...signin]]/CustomButton';
import { router } from 'next/client';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setStorageID } from '@/lib/features/todos/storageSlice';

const signInSchema = z.object({
  username: z.string(),
  password: z.string().min(6, 'Password should have at least 6 characters.'),
});

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const response = await axios.post(
      'http://localhost:8888/api/auth/login',
      values,
    );
    localStorage.setItem('access_token', response.data.accessToken);
    document.cookie = `refreshToken=${response.data.refreshToken}`;
    localStorage.setItem('userId', response.data.user.id);
    localStorage.setItem('storageID', response.data.storageId);
    // console.log(response.data);
    dispatch(setStorageID(response.data.storageId));
    router.push('/dashboard');
  }

  // const ResponseFolder = await axios.get("http://localhost:8888/api/folder/rootFolders/{storageId}"
  // );
  // localStorage.setItem("storageId", ResponseFolder.data.storageId);

  return (
    <>
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
        <div className="formWrapper">
          <div className="space-y-5 left">
            <h3 className="title">Hello, friends!</h3>
            <p>Enter your personal details and start journey with us</p>
            <Link href={'/register'}>
              <Button className="px-8 text-gray-900 border rounded-full border-zinc-500 hover:border-gray-900 hover:font-bold hoverScale">
                Register
              </Button>
            </Link>
          </div>
          <div className="right">
            <h3 className="text-2xl font-semibold text-center">Sign in</h3>
            <div className="socialRegisterOptions drop-shadow-md ">
              <GoogleOAuthProvider clientId="221707522416-c5ac904abilmbldbpq7m75t0kpekigjm.apps.googleusercontent.com">
                <CustomButton />
              </GoogleOAuthProvider>
            </div>
            <p className="text-center">or use this option</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex-col flexCenter drop-shadow-md"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-2">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-2">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="********"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Link href={'/forget'}>
                  <span className="text-gray-500 hover:underline">
                    Forget password?
                  </span>
                </Link>
                <Button
                  type="submit"
                  className="w-1/2 mt-4 border-2 border-gray-800 border-solid rounded-lg shadow-lg flexCenter hoverScale"
                >
                  Submit
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
