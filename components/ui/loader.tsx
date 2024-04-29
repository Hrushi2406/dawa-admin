import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="h-screen grid place-items-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
