import { useState, useCallback } from "react";

type Func<T, R> = (t: T | null) => R;

/**
 * Usage:
 *
 *   const [clientHeight, setRef] = useRefWithState(node => (node?.clientHeight || 0));
 *   useEffect(() => {
 *      console.log(`the new clientHeight is: ${clientHeight}`);
 *   }, [clientHeight])
 *   <div ref={setRef}
 *
 * @param processRef
 * @returns
 */
function useRefWithState<T, R>(processRef: Func<T, R>) {
  const [result, setResult] = useState<R | null>(null);

  const setRef = useCallback(
    (node: T | null) => {
      setResult(processRef(node));
    },
    [processRef]
  );

  return [result, setRef];
}

export default useRefWithState;
