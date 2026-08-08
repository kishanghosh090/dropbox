"use client";

import { useForm } from "react-hook-form";

import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

import { signUpSchema } from "@/schemas/signUpSchema";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationError, seterificationError] = useState<string | null>(
    null,
  );

  const { signUp, isLoaded, setActive } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConformation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) {
      return;
    }
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error: any) {
      console.log("Signup error");
      setAuthError(
        error.errors?.[0]?.message ||
          "an error occured during the signup. please try again",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) {
      return;
    }
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log(result);
      if (result.status == "complete") {
        await setActive({
          session: result.createdSessionId,
        });
        router.replace("");
      } else {
        console.log("Verrification imcomplete");
        setVerifying(false);
        seterificationError("verification could not be complete");
      }
    } catch (error: any) {
      seterificationError(
        error.errors?.[0]?.message ||
          "an error occured during the signup. please try again",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verifying) {
    return <h1>this is OTP entering field</h1>;
  }
  return <h1>Signup form with email and other fields</h1>;
}
