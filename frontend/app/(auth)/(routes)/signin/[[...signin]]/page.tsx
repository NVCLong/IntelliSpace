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
import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";

import {GoogleLogin, GoogleOAuthProvider, useGoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import {CustomButton} from "@/app/(auth)/(routes)/signin/[[...signin]]/CustomButton";



const signInSchema = z.object({
  username: z.string(),
  password: z.string().min(6, "Password should have at least 6 characters."),
});

const Page = () => {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });



  async function onSubmit(values: z.infer<typeof signInSchema>) {
    const response = await axios.post(
      "http://localhost:8888/api/auth/login",
      values
    );
    localStorage.setItem("access_token", response.data.accessToken);
    document.cookie = `refreshToken=${response.data.refreshToken}`;
    console.log(response.data);
  }
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01]
        }}
        className="registerWrapper drop-shadow-md">
        <div className="formWrapper">
          <div className="left">
            <h3 className="title">Hello, friends!</h3>
            <p>Enter your personal details and start journey with us</p>
            <Link href={"/register"}>
              <Button className="px-8 text-gray-900 border rounded-full border-zinc-500 hover:border-gray-900 hover:font-bold hoverScale">
                Register
              </Button>
            </Link>
          </div>
          <div className="right">
            <h3 className="text-2xl font-semibold text-center">Sign in</h3>
            <div className="socialRegisterOptions drop-shadow-md ">
              <GoogleOAuthProvider clientId="470811894525-o22pdoqo14q0f6r91140rno6grdr5eqs.apps.googleusercontent.com">
                <CustomButton/>
              </GoogleOAuthProvider>
              <Button className="socialFormBtn hoverScale">
                <SiGithub  className="w-10 h-10" />
              </Button>
            </div>
            <p className="text-center">or use this option</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex-col flexCenter drop-shadow-md">
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
                <Button
                  type="submit"
                  className="w-1/2 mt-4 border-2 border-gray-500 border-solid rounded-lg shadow-lg flexCenter hoverScale"
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
