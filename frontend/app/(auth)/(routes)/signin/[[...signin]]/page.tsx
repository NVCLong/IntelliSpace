'use client';

import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { CustomButton } from '@/app/(auth)/(routes)/signin/[[...signin]]/CustomButton';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setStorageID } from '@/lib/features/todos/storageSlice';
import BarLoader from 'react-spinners/BarLoader';

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

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://intelli-space-v1.azurewebsites.net/api/auth/login',
        values,
      );

      // console.log(response);

      if (response.data.content.toLowerCase() === 'wrong password') {
        toast.error(<div>Notification: {response.data.content}</div>);
      } else if (response.data.content.toLowerCase().includes('not register')) {
        toast.error(<div>Notification: {response.data.content}</div>);
      } else {
        localStorage.setItem('access_token', response.data.accessToken);
        document.cookie = `refreshToken=${response.data.refreshToken}`;
        localStorage.setItem('userId', response.data.user.id);
        localStorage.setItem('storageID', response.data.storageId);
        // console.log(response.data);
        dispatch(setStorageID(response.data.storageId));
        router.push('/dashboard');
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }

  // const ResponseFolder = await axios.get("http://localhost:8888/api/folder/rootFolders/{storageId}"
  // );
  // localStorage.setItem("storageId", ResponseFolder.data.storageId);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
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
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 space-y-2">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="Enter username"
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
                    <FormItem className="mb-2 space-y-2">
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

                <Link href={'/forget'}>
                  <span className="text-gray-500 hover:underline">
                    Forget password?
                  </span>
                </Link>
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
                    'LOGIN'
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
