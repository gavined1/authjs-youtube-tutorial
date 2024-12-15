"use client";

import { forwardRef } from "react";
import { handleSignOut } from "@/src/lib/auth/signOutServerAction";

export const SignOutButton = forwardRef<
  HTMLButtonElement,
  {
    children?: React.ReactNode;
    className?: string;
  }
>((props, ref) => {
  // Remove the default classes since we'll use the provided className
  return (
    <button
      ref={ref}
      className={props.className}
      onClick={() => handleSignOut()}
    >
      {props.children || "Sign Out"}
    </button>
  );
});
