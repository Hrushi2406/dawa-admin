"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const [email, setemail] = React.useState("");
  const [password, setpassword] = React.useState("");

  const [hasAccess, sethasAccess] = React.useState(false);

  const admin = "dawa247@gmail.com";

  const handleAuth = (e: any) => {
    e.preventDefault();
    const defaultPassword = "wearegonnamakeit";

    if (email === admin && password === defaultPassword) {
      sethasAccess(true);
      localStorage.setItem("user", email);
      toast.success("Login Successful", {});
    } else {
      toast.error("Wrong email or password", {});
      sethasAccess(false);
    }
  };

  React.useEffect(() => {
    const value = localStorage.getItem("user");

    if (value === admin) {
      sethasAccess(true);
    }
  }, []);

  if (!hasAccess) {
    return (
      <div className="grid min-h-screen place-items-center ">
        <form
          onSubmit={handleAuth}
          className="space-y-4 max-w-sm w-full mx-auto"
        >
          <div className="text-xl  text-center font-medium ">
            You don't have access
          </div>
          <Input
            id="user-email"
            type="email"
            required
            placeholder="Admin email"
            className=""
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <Input
            id="user-password"
            type="password"
            required
            placeholder="Password"
            className=""
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </div>
    );
  }
  return <div>{children}</div>;
}
