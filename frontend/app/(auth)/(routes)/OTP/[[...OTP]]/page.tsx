"use client";
import React from "react";
import * as z from "zod";
import { Button } from "@/components/auth_ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/auth_ui/form";
import { Input } from "@/components/auth_ui/input";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {useAppSelector} from "@/lib/store";
import { setEmail } from '@/lib/features/todos/emailSlice';
import {AppDispatch} from "@/lib/store";
import {useDispatch} from "react-redux";


const registerSchema = z.object({
  otp: z.string(),
});

const Page = () => {
  const  dispatch=useDispatch<AppDispatch>();
  const email: string | null = useAppSelector(
      (state) => state.emailSlice.email
  );
  const router = useRouter();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const request={
      email: email,
      otp: values.otp
    }
    if (email != null) {
      dispatch(setEmail(email))
    }
    console.log(values)
    const response = await axios.post(
      `http://localhost:8888/api/auth/checkOtp`,
      request
    );
    console.log(response.data);

    router.push("/resetPassword");
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
              Enter your email address and we will send you a one-time-password to reset your password.
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
                    render={({ field }) => (
                        <FormItem className="mb-2 space-y-1">
                          <FormLabel>OTP code</FormLabel>
                          <FormControl>
                            <Input
                                placeholder="Enter OTP"
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
