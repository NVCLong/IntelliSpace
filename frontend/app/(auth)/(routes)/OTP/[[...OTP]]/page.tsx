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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppDispatch, useAppSelector } from '@/lib/store';
import { setEmail } from '@/lib/features/todos/emailSlice';
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

const registerSchema = z.object({
  otp: z.string(),
});

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const email: string | null = useAppSelector(
    (state) => state.emailSlice.email,
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      otp: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const request = {
      email: email,
      otp: values.otp,
    };
    if (email != null) {
      dispatch(setEmail(email));
    }
    // console.log(values)
    try {
      setIsLoading(true);
      const response = await axios.post(
        `https://intelli-space-v1.azurewebsites.net/api/auth/checkOtp`,
        request,
      );
      if (response.data.status === false) {
        toast.error(<div>Notification: {response.data.message}</div>);
      } else {
        router.push('/resetPassword');
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  }

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
        className="h-full registerWrapper drop-shadow-md"
      >
        <div className="formWrapper">
          <div className="left">
            <h3 className="mb-3 title">Recovery your password</h3>
            <p>
              Enter your email address and we will send you a one-time-password
              to reset your password.
            </p>
          </div>
          <div className="right">
            <h3 className="mb-10 text-2xl font-semibold text-center">
              One-Time-Password
            </h3>
            <Form {...form}>
              <form
                className="flex-col flexCenter drop-shadow-md"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>OTP code</FormLabel>
                      <FormControl>
                        <Input
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="Enter OTP"
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
                  type="submit"
                  className="w-1/2 mt-4 mb-10 border-2 border-gray-500 border-solid rounded-lg shadow-lg flexCenter hoverScale"
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
