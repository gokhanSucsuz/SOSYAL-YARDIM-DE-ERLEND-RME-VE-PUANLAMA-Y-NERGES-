"use client";

import { ReactNode } from "react";
import { DialogProvider } from "@/components/DialogProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DialogProvider>
      {children}
    </DialogProvider>
  );
}
