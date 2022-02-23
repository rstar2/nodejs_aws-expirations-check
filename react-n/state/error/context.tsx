import React, { useMemo, useContext, useState } from "react";
import { ToastAndroid } from "react-native";

type ToastContextValue = {
  show: (message: string, isLong?: boolean) => void;
};
const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
);

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = useMemo<ToastContextValue>(() => {
    const show = (message: string, isLong = false): void => {
      ToastAndroid.show(message, isLong ? ToastAndroid.LONG : ToastAndroid.SHORT);
    };

    return { show };
  }, []);

  return (
    <ToastContext.Provider value={context}>{children}</ToastContext.Provider>
  );
}

export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error(
      "useToastContext must be used within a ToastContextProvider"
    );
  }
  return context;
}
