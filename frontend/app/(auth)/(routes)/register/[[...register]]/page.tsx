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
import { FaGithub, FaGoogle } from "react-icons/fa6";
import Link from "next/link";
import axios from "axios";
import dotenv from "dotenv";

dotenv.configDotenv({ path: "/env.local" });
const registerSchema = z
  .object({
    username: z
      .string()
      .min(2, "Name should have at least 2 characters.")
      .max(50, "Name should not exceed 50 characters.")
      .refine(
        (value) => /^[a-zA-Z]+[-'s]?[a-zA-Z ]+$/.test(value),
        "Name should contain only alphabets."
      ),
    email: z.string().email("Email must be valid."),
    phone: z
      .string()
      .min(10, "Phone number should have at least 10 characters."),
    password: z.string().min(6, "Password Should have at least 6 characters."),
    confirmPassword: z
      .string()
      .min(6, "Password Should have at least 6 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match.",
    path: ["confirmPassword"],
  });

const Page = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    const response = await axios.post(
      `http://localhost:8888/api/auth/register`,
      values
    );
    console.log(response.data);
  }

  return (
    <>
      <div className="registerWrapper">
        <div className="formWrapper">
          <div className="left">
            <h3 className="title">Welcome back!</h3>
            <p>
              To keep connected with us please login with your personal info
            </p>
            <Link href={"/register"}>
              <Button className="px-8 transition-colors border rounded-full border-zinc-500 text-zinc-300 hover:border-zinc-200 hover:text-zinc-100">
                Sign in
              </Button>
            </Link>
          </div>
          <div className="right">
            <h3 className="text-2xl font-semibold text-center">
              Register here
            </h3>
            <div className="socialRegisterOptions">
              <Button variant={"outline"} className="socialFormBtn">
                <FaGoogle className="w-5 h-5" />
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyen Duy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-0">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@intellispace.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-0">
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your phone number" {...field} />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mb-2 space-y-0">
                      <FormLabel>Confirm password</FormLabel>
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
