"use client";
import { Card } from "@heroui/react";
import { useForm } from "react-hook-form";

import { Button, Form, InputOTP, Label, Spinner } from "@heroui/react";

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
  const [isComplete, setIsComplete] = React.useState(false);

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
  const handleComplete = (code: string) => {
    setIsComplete(true);
    console.log("Code complete:", code);
  };

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
    return (
      <Form
        className="flex w-[280px] flex-col gap-2"
        onSubmit={handleVerificationSubmit}
      >
        <Label>Verify account</Label>
        <InputOTP
          maxLength={6}
          value={verificationCode}
          onComplete={handleComplete}
          onChange={(val) => {
            setVerificationCode(val);
            setIsComplete(false);
          }}
        >
          <InputOTP.Group>
            <InputOTP.Slot index={0} />
            <InputOTP.Slot index={1} />
            <InputOTP.Slot index={2} />
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            <InputOTP.Slot index={3} />
            <InputOTP.Slot index={4} />
            <InputOTP.Slot index={5} />
          </InputOTP.Group>
        </InputOTP>
        <Button
          className="mt-2 w-full"
          isDisabled={!isComplete}
          isPending={isSubmitting}
          type="submit"
          variant="primary"
        >
          {isSubmitting ? (
            <>
              <Spinner color="current" size="sm" />
              Verifying...
            </>
          ) : (
            "Verify Code"
          )}
        </Button>
      </Form>
    );
  }
  return <h1>Signup form with email and other fields</h1>;
}
