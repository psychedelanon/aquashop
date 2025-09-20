"use client";

import React, { useState } from "react";
import { payWithEthOnBase } from "../ethBasePay";

interface CryptoPayButtonProps {
  to: `0x${string}`;
  usdAmount: number;
  productTitle: string;
  className?: string;
}

export function CryptoPayButton({ to, usdAmount, productTitle, className = "" }: CryptoPayButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  async function handlePayment() {
    setIsLoading(true);
    try {
      const tx = await payWithEthOnBase({ 
        to, 
        usdAmount,
        memoHex: `0x${Buffer.from(`AQUA SHOP: ${productTitle}`, 'utf8').toString('hex')}`
      });
      setTxHash(tx);
      
      // Show success message with transaction link
      const basescanUrl = `https://basescan.org/tx/${tx}`;
      alert(`Payment sent! Transaction: ${tx}\n\nView on BaseScan: ${basescanUrl}`);
      
    } catch (error: any) {
      console.error("Payment failed:", error);
      alert(error?.message ?? "Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (txHash) {
    return (
      <div className="text-center">
        <p className="text-sm text-green-600 font-semibold mb-2">✅ Payment Sent!</p>
        <a
          href={`https://basescan.org/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          View Transaction
        </a>
      </div>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`w-full bg-[#00A3FF] text-white font-black py-3 px-4 rounded-md border-2 border-[#00A3FF] hover:bg-white hover:text-[#00A3FF] active:translate-y-[1px] transition-all duration-150 text-center block uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? "CONNECTING WALLET..." : `PAY IN ETH • $${usdAmount}`}
    </button>
  );
}
