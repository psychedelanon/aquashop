// Minimal EIP-1193 helpers for Base (8453) + ETH payment from USD price
// No deps. Works with MetaMask + compatible wallets.

export const BASE_PARAMS = {
  chainId: "0x2105", // 8453
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

type PayArgs = {
  to: `0x${string}`;
  usdAmount: number;          // sticker price in USD
  ethUsd?: number;            // optional: pass your own ETH/USD
  memoHex?: string;           // optional: 0x… data field memo
};

export async function connectWallet(): Promise<string> {
  const eth = getProvider();
  const [addr] = (await eth.request({ method: "eth_requestAccounts" })) as string[];
  return addr;
}

export async function ensureBase(): Promise<void> {
  const eth = getProvider();
  try {
    await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BASE_PARAMS.chainId }] });
  } catch (err: any) {
    // 4902: chain not added
    if (err?.code === 4902) {
      await eth.request({ method: "wallet_addEthereumChain", params: [BASE_PARAMS] });
    } else {
      throw err;
    }
  }
}

export async function fetchEthUsd(): Promise<number> {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd";
  const r = await fetch(url, { cache: "no-store" });
  const j = await r.json();
  const n = j?.ethereum?.usd;
  if (typeof n !== "number" || !isFinite(n)) throw new Error("Failed to fetch ETH/USD");
  return n;
}

export function toWeiFromEthDecimal(ethAmount: string): bigint {
  // string -> wei (BigInt) with 18 decimals, no floating point errors
  const [whole, frac = ""] = ethAmount.split(".");
  const fracPadded = (frac + "0".repeat(18)).slice(0, 18);
  const wholeWei = BigInt(whole || "0") * BigInt(10 ** 18);
  const fracWei = BigInt(fracPadded || "0");
  return wholeWei + fracWei;
}

export async function payWithEthOnBase({ to, usdAmount, ethUsd, memoHex }: PayArgs): Promise<string> {
  const eth = getProvider();
  await ensureBase();
  const from = await connectWallet();

  const rate = ethUsd ?? (await fetchEthUsd());
  // Round up slightly to protect against tiny rate moves (0.4%)
  const ethAmount = (usdAmount / rate) * 1.004;

  const valueWei = toWeiFromEthDecimal(toFixedNoSci(ethAmount, 18));
  const params: any = [{ from, to, value: "0x" + valueWei.toString(16) }];
  if (memoHex) params[0].data = memoHex;

  const txHash = (await eth.request({ method: "eth_sendTransaction", params })) as string;
  return txHash; // return the tx hash so you can show a receipt / basescan link
}

function getProvider(): any {
  const eth = (globalThis as any).ethereum;
  if (!eth) throw new Error("No EIP-1193 provider found (install MetaMask or a compatible wallet).");
  return eth;
}

function toFixedNoSci(n: number, decimals: number) {
  // produce a plain decimal string with up to `decimals` places (no scientific notation)
  return n.toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: decimals });
}
