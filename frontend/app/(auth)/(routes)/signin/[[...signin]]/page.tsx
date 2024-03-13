"use client";
import React from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FaFacebook, FaGithub, FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import axios from "axios";

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
    const response = await axios.post("http://localhost:8888/api/auth/login",values)
     localStorage.setItem("access_token", response.data.accessToken);
     document.cookie=`refreshToken=${response.data.refreshToken}`;
    console.log(response.data);
  }
  return (
    <>
      <div className="signUpWrapper">
        <div className="formWrapper">
          <div className="left">
            <h3 className="title">Hello, friends!</h3>
            <p>Enter your personal details and start journey with us</p>
            <Link href={"/signup"}>
              <Button className="px-8 transition-colors border rounded-full border-zinc-500 text-zinc-300 hover:border-zinc-200 hover:text-zinc-100">
                Sign Up
              </Button>
            </Link>
          </div>
          <div className="right">
            <h3 className="text-2xl font-semibold text-center">Sign In Here</h3>
            <div className="socialSignUpOptions">
              <Button variant={"outline"} className="socialFormBtn">
                <FaGoogle className="w-5 h-5" />
              </Button>
              <Button variant={"outline"} className="socialFormBtn">
                <FaFacebook className="w-5 h-5" />
              </Button>
              <Button variant={"outline"} className="socialFormBtn">
                <FaGithub className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-center">or use this option</p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-0">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-0">
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
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
