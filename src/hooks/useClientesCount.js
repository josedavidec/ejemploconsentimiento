import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useClientesCount() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchCount() {
      setLoading(true);
      const { count, error } = await supabase
        .from("clientes")
        .select("id", { count: "exact", head: true });
      if (mounted && !error) setCount(count);
      setLoading(false);
    }
    fetchCount();
    return () => {
      mounted = false;
    };
  }, []);

  return { count, loading };
}
