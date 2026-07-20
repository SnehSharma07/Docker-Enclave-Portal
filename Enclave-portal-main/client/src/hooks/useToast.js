import { useCallback, useRef, useState } from "react";

let idCounter = 0;

function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    if (timers.current[id]) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const showToast = useCallback(
    (message, type = "success", duration = 3500) => {
      const id = ++idCounter;

      setToasts((prev) => [...prev, { id, message, type }]);

      timers.current[id] = setTimeout(() => {
        dismissToast(id);
      }, duration);
    },
    [dismissToast]
  );

  return { toasts, showToast, dismissToast };
}

export default useToast;
