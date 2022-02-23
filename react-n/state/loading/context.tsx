import React, { useMemo, useContext, useState } from "react";

type LoadingContextValue = {
  isLoading: boolean;
  text?: string;
  setLoading: (isLoading: boolean, text?: string) => void;
};
const LoadingContext = React.createContext<LoadingContextValue | undefined>(
  undefined
);

export function LoadingContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState(undefined as (string | undefined));

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const context = useMemo<LoadingContextValue>(() => {
	const setLoading_ = (isLoading_: boolean, text_?: string): void =>  {
		setLoading(isLoading_);
		setText(text_);
	};
	
	return { isLoading, text, setLoading: setLoading_};
  }, [isLoading, text, setLoading, setText]);

  return (
    <LoadingContext.Provider value={context}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext(): LoadingContextValue {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error(
      "useLoadingContext must be used within a LoadingContextProvider"
    );
  }
  return context;
}
