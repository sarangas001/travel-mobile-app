import { useEffect, useState } from "react";

export function useSimulatedLoading(delayMs = 850) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), delayMs);

    return () => clearTimeout(timeout);
  }, [delayMs]);

  return isLoading;
}
