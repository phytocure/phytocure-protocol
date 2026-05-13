import { useEffect, type ComponentType } from "react";
import { useLocation } from "wouter";
import { useWallet } from "@/contexts/WalletContext";

interface Props {
  component: ComponentType;
}

export function ProtectedRoute({ component: Component }: Props) {
  const { connected, openModal } = useWallet();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!connected) {
      setLocation("/");
      setTimeout(() => openModal(), 100);
    }
  }, [connected, setLocation, openModal]);

  if (!connected) return null;
  return <Component />;
}
