"use client";

import React, { createContext, useContext, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertContextType {
  showAlert: (message: string, title?: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("Pemberitahuan");

  const showAlert = (msg: string, t?: string) => {
    setMessage(msg);
    setTitle(t || "Notifikasi");
    setIsOpen(true);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-stone-900 text-base">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500 text-xs mt-1">
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setIsOpen(false)}
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer active:scale-95"
            >
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
