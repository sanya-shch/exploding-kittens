import React, { useCallback, useMemo } from "react";

import { ToastContext } from "./toast.context.js";
import Toast from "./Toast";

function ToastProvider({ children }) {
  const setToast = useCallback(
    ({
      text,
      position = "top-right",
      duration,
      type = "",
      pauseOnHover = true,
      pauseOnFocusLoss = true,
    }) => {
      new Toast({
        text,
        position,
        autoClose: duration || 3000,
        type,
        pauseOnHover,
        pauseOnFocusLoss,
      });
    },
    []
  );

  const value = useMemo(
    () => ({
      setToast,
    }),
    [setToast]
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export default ToastProvider;
