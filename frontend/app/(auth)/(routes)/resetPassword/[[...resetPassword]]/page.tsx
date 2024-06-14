'use client';
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
import BarLoader from 'react-spinners/BarLoader';

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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://intelli-space-v1.azurewebsites.net/api/auth/newPassword`,
        request,
      );
      // console.log(response.data);

      router.push('/signin');
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
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
              Enter new password
            </h3>
            <Form {...form}>
              <form
                className="flex-col flexCenter drop-shadow-md"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="Enter new password"
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
                          type="password"
                          className={`InputFormat ${fieldState.error ? 'ring-pink-500 text-pink-600 ring-2' : ''}`}
                          placeholder="Confirm your password"
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
                    'SUBMIT'
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
