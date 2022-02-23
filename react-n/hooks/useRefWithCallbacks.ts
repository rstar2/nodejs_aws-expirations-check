import { useCallback, useRef, MutableRefObject } from "react";

type Func<T> = (t: T) => void;

/**
 * Usage:
 *
 *   const onMouseDown = useCallback(e => console.log('hi!', e.target.clientHeight), []);
 *   const setDivRef = useRefWithCallback(
 *      node => node.addEventListener("mousedown", onMouseDown),
 *      node => node.removeEventListener("mousedown", onMouseDown)
 *   );
 *   <div ref={setDivRef}
 *
 * @param onMount
 * @param onUnmount
 * @returns
 */
export default function useRefWithCallbacks<T>(
  onMount: Func<T>,
  onUnmount: Func<T>
): (node: T | null) => void {
  const ref: MutableRefObject<T | null> = useRef(null);

  // NOTE: The ref function is guaranteed to be called on mounts and unmounts of elements,
  // even on the first mount,
  // and even if the unmount is as a result of the parent element unmounting.
  const setRef = useCallback(
    (node: T | null) => {
      if (ref.current) {
        onUnmount(ref.current);
      }

      ref.current = node;

      if (ref.current) {
        onMount(ref.current);
      }
    },
    [onMount, onUnmount]
  );

  return setRef;
}
