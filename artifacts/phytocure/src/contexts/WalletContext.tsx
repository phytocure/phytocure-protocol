import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export type WalletName = "Phantom" | "Solflare";

const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
const connection = new Connection(RPC_ENDPOINT, "confirmed");

interface WalletState {
  connected: boolean;
  address: string | null;
  walletName: WalletName | null;
  balance: number | null;
}

interface WalletContextValue extends WalletState {
  connect: (wallet: WalletName) => Promise<void>;
  disconnect: () => void;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  phantomInstalled: boolean;
  solflareInstalled: boolean;
  refreshBalance: () => Promise<void>;
  connection: Connection;
}

const WalletContext = createContext<WalletContextValue | null>(null);

function getPhantomProvider() {
  if (typeof window === "undefined") return null;
  if ("phantom" in window) {
    const phantom = (window as Window & { phantom?: { solana?: { isPhantom?: boolean; connect: () => Promise<{ publicKey: { toBase58: () => string } }>; disconnect: () => Promise<void>; on: (event: string, cb: () => void) => void; off: (event: string, cb: () => void) => void } } }).phantom;
    if (phantom?.solana?.isPhantom) return phantom.solana;
  }
  const w = window as Window & { solana?: { isPhantom?: boolean; connect: () => Promise<{ publicKey: { toBase58: () => string } }>; disconnect: () => Promise<void>; on: (event: string, cb: () => void) => void; off: (event: string, cb: () => void) => void } };
  if (w.solana?.isPhantom) return w.solana;
  return null;
}

function getSolflareProvider() {
  if (typeof window === "undefined") return null;
  const w = window as Window & { solflare?: { isSolflare?: boolean; connect: () => Promise<void>; disconnect: () => Promise<void>; publicKey?: { toBase58: () => string }; on: (event: string, cb: () => void) => void; off: (event: string, cb: () => void) => void } };
  if (w.solflare?.isSolflare) return w.solflare;
  return null;
}

const STORAGE_KEY = "phytocure_wallet_v2";

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    address: null,
    walletName: null,
    balance: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [phantomInstalled, setPhantomInstalled] = useState(false);
  const [solflareInstalled, setSolflareInstalled] = useState(false);

  useEffect(() => {
    setPhantomInstalled(!!getPhantomProvider());
    setSolflareInstalled(!!getSolflareProvider());
  }, []);

  const fetchBalance = useCallback(async (address: string): Promise<number | null> => {
    try {
      const pubKey = new PublicKey(address);
      const lamports = await connection.getBalance(pubKey);
      return lamports / LAMPORTS_PER_SOL;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: WalletState = JSON.parse(saved);
        if (parsed.connected && parsed.address) {
          setState(parsed);
          fetchBalance(parsed.address).then((balance) => {
            if (balance !== null) {
              setState((s) => ({ ...s, balance }));
            }
          });
        }
      }
    } catch {
      // ignore
    }
  }, [fetchBalance]);

  const refreshBalance = useCallback(async () => {
    if (!state.address) return;
    const balance = await fetchBalance(state.address);
    if (balance !== null) setState((s) => ({ ...s, balance }));
  }, [state.address, fetchBalance]);

  const connect = useCallback(async (walletName: WalletName) => {
    try {
      let address: string;

      if (walletName === "Phantom") {
        const provider = getPhantomProvider();
        if (!provider) {
          window.open("https://phantom.app/", "_blank");
          return;
        }
        const resp = await provider.connect();
        address = resp.publicKey.toBase58();
      } else {
        const provider = getSolflareProvider();
        if (!provider) {
          window.open("https://solflare.com/", "_blank");
          return;
        }
        await provider.connect();
        if (!provider.publicKey) throw new Error("No public key after connect");
        address = provider.publicKey.toBase58();
      }

      const balance = await fetchBalance(address);
      const next: WalletState = { connected: true, address, walletName, balance };
      setState(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setShowModal(false);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "code" in err && (err as { code: number }).code === 4001) {
        return;
      }
      throw err;
    }
  }, [fetchBalance]);

  const disconnect = useCallback(async () => {
    try {
      if (state.walletName === "Phantom") {
        const provider = getPhantomProvider();
        if (provider) await provider.disconnect();
      } else if (state.walletName === "Solflare") {
        const provider = getSolflareProvider();
        if (provider) await provider.disconnect();
      }
    } catch {
      // ignore disconnect errors
    }
    const next: WalletState = { connected: false, address: null, walletName: null, balance: null };
    setState(next);
    localStorage.removeItem(STORAGE_KEY);
  }, [state.walletName]);

  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <WalletContext.Provider value={{
      ...state,
      connect,
      disconnect,
      showModal,
      openModal,
      closeModal,
      phantomInstalled,
      solflareInstalled,
      refreshBalance,
      connection,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}

export { connection as solanaConnection };
