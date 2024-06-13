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
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppDispatch, useAppSelector } from '@/lib/store';
import { setEmail } from '@/lib/features/todos/emailSlice';
import { useDispatch } from 'react-redux';

const resetSchema = z
  .object({
    newPassword: z.string().min(6, 'Password should have at least 6'),
    confirmPassword: z.string().min(6, 'Password should have at least 6'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords does not match.',
    path: ['confirmPassword'],
  });

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const email: string | null = useAppSelector(
    (state) => state.emailSlice.email,
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof resetSchema>) {
    const request = {
      email: email,
      password: values.newPassword,
    };
    if (email != null) {
      dispatch(setEmail(email));
    }
    // console.log(values)
    const response = await axios.post(
      `https://intelli-space-v1.azurewebsites.net/api/auth/newPassword`,
      request,
    );
    // console.log(response.data);

    router.push('/signin');
  }

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
              Enter New Password
            </h3>
            <Form {...form}>
              <form
                className="flex-col flexCenter drop-shadow-md"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter New Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Confirm Your Password" {...field} />
                      </FormControl>
                      <FormMessage />
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
