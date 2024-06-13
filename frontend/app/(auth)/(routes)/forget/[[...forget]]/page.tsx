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
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { setEmail } from '@/lib/features/todos/emailSlice';
import { AppDispatch } from '@/lib/store';

const registerSchema = z.object({
  email: z.string().email('Email must be valid.'),
});

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const response = await axios.post(
      `https://intelli-space-v1.azurewebsites.net/api/auth/resetPassword`,
      values,
    );
    dispatch(setEmail(values.email));
    // console.log(response.data);
    router.push('/OTP');
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
            <h3 className="mb-10 text-2xl font-semibold text-center">
              Forget your password
            </h3>
            <Form {...form}>
              <form
                className="flex-col flexCenter drop-shadow-md"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-1">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email@intellispace.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-1/2 mt-4 mb-10 border-2 border-gray-500 border-solid rounded-lg shadow-lg flexCenter hoverScale"
                >
                  Forget
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
