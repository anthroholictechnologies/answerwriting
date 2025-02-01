"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "answerwriting/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "answerwriting/components/ui/form";
import { Input } from "answerwriting/components/ui/input";
import { Textarea } from "answerwriting/components/ui/textarea";
import { PhoneInput } from "answerwriting/components/react-common/phone-input";
import {
  CardHeader,
  CardTitle,
  CardContent,
} from "answerwriting/components/ui/card";

import ImpactSpan from "../react-common/impact-span";
import { contactSchema } from "answerwriting/validations/general.schema";
import { SendContactUsEmail } from "answerwriting/actions";
import { useCustomToast } from "../react-common/toast";
import { ErrorCodes } from "answerwriting/types/general.types";
import { ToastAction } from "../ui/toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useCustomToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    mode: "onChange",
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    shouldFocusError: true,
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsSubmitting(true);
    const data = await SendContactUsEmail(values);
    if (data?.errorCode === ErrorCodes.INTERNAL_SERVER_ERROR) {
      toast.error({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem in the registration process.",
        action: (
          <ToastAction
            altText="Try again"
            className="
                  px-4 py-2
                  bg-white/10 
                  hover:bg-white/20 
                  text-white 
                  rounded-lg
                  border border-white/20 
                  hover:border-white/30
                  transition-all
                  backdrop-blur-sm
                  font-medium
                  text-sm
                "
            onClick={() => window.location.reload()}
          >
            Try again
          </ToastAction>
        ),
      });
    }
    setIsSubmitting(false);
    console.log(values);
    toast.info({
      title: "Your response has been submitted",
      description:
        "Thank you for reaching out! We've received your message and will get back to you shortly.",
    });
    form.reset();
  }

  return (
    <div className="lg:shadow lg:border rounded-standard bg-white flex flex-col  w-full max-w-screen-md  mx-auto xl:p-12 xl:mt-4 mb-12">
      <CardHeader>
        <CardTitle className="text-center text-[2rem] xl:text-[3rem] leading-none tracking-tighter font-bold xl:mb-6 mb-2">
          Contact <ImpactSpan text="Us" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
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
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <PhoneInput placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please enter your phone number with country code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your message here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </div>
  );
}
