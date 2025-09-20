"use client";

import React, { useMemo, useState } from "react";
import { payWithEthOnBase } from "./ethBasePay";

// AQUA SHOP — GENESIS EDITION
// No gradients. Flat colors. Sharp edges. Race-car energy. Lamborghini-blue accents.
// Every item: BOTH actions — BUY • $PRICE  |  MAKE ME AN OFFER

export default function AquaTeeStorefront() {
  const CONTACT_EMAIL = "aquasmith@proton.me"; // TODO
  const HERO_VIDEO = ""; // optional landing video (kept, but rest is flat UI)
  const RECEIVING_ADDRESS = "0x742d35Cc6634C0532925a3b8D0C4C4C4C4C4C4C4"; // TODO: Replace with your actual Base wallet address (must be valid EOA on Base)

  const products = useMemo(
    () => [
      { id: "tee-01", title: "Bricked Up", price: 35, checkoutUrl: "https://buy.stripe.com/test_123", img: "/shirts/brickedup.jpg", tag: "POPULAR" },
      { id: "tee-02", title: "Beer Nye", price: 400, checkoutUrl: "https://buy.stripe.com/test_234", img: "/shirts/beernye.jpg", tag: "BEER BEER BEER BEER" },
      { id: "tee-03", title: "ID", price: 17000, checkoutUrl: "https://buy.stripe.com/test_345", img: "/shirts/id.jpg", tag: "GENESIS" },
      { id: "tee-04", title: "CHKG HZRD", price: 4000000, checkoutUrl: "https://buy.stripe.com/test_456", img: "/shirts/chkghzrd.jpg", tag: "INSANE" },
      { id: "tee-05", title: "fuck.", price: 1000000000, checkoutUrl: "https://buy.stripe.com/test_567", img: "/shirts/fuck.jpg", tag: "DAMN." },
      { id: "tee-06", title: "MONDAY", price: 3500000000, checkoutUrl: "https://buy.stripe.com/test_678", img: "/shirts/monday.jpg", tag: "VINTAGE" },
      { id: "tee-07", title: "Beer Out", price: 500, checkoutUrl: "https://buy.stripe.com/test_789", img: "/shirts/beerout.jpg", tag: "CLASSIC" },
      { id: "tee-08", title: "DADDY SHARK", price: 750, checkoutUrl: "https://buy.stripe.com/test_890", img: "/shirts/daddyshark.jpg", tag: "OG" },
      { id: "tee-09", title: "WING WEDNESDAY", price: 650, checkoutUrl: "https://buy.stripe.com/test_901", img: "/shirts/wingwednesday.jpg", tag: "IYKYK" },
    ],
    []
  );

  const [offerOpen, setOfferOpen] = useState(false);
  const [offerFor, setOfferFor] = useState<{ id: string; title: string; img: string; price?: number } | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [buyErr, setBuyErr] = useState<string | null>(null);

  function openOffer(p: { id: string; title: string; img: string; price?: number }) { setOfferFor(p); setOfferOpen(true); }
  function closeOffer() { setOfferOpen(false); setOfferFor(null); }

  function submitOffer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = (form.get("name") as string) || "";
    const email = (form.get("email") as string) || "";
    const price = (form.get("price") as string) || "";

    const p = offerFor?.title || "Unknown";
    const subject = encodeURIComponent(`Offer on ${p}`);
    const body = encodeURIComponent(
      [
        `T-Shirt: ${p}`,
        name && `Name: ${name}`,
        email && `Email: ${email}`,
        price && `Offer: $${price}`,
        "— Sent from AQUA MODE (HUMAN SHARK)",
      ]
        .filter(Boolean)
        .join("\n")
    );

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  async function handleBuyEth(p: { id: string; title: string; price: number }) {
    try {
      setBuyErr(null);
      setLastTx(null);
      setBuyingId(p.id);

      // sanity checks to avoid silent failures
      if (!/^0x[a-fA-F0-9]{40}$/.test(RECEIVING_ADDRESS)) {
        throw new Error("Receiving wallet address is invalid/missing.");
      }
      if (!("ethereum" in window)) {
        throw new Error("No wallet found. Install MetaMask or a compatible wallet.");
      }

      console.log("[BUY] starting", p);
      const tx = await payWithEthOnBase({
        to: RECEIVING_ADDRESS as `0x${string}`,
        usdAmount: p.price,
      });
      console.log("[BUY] sent tx", tx);

      setLastTx(tx);
      // Optional: open Basescan
      window.open(`https://basescan.org/tx/${tx}`, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      console.error("[BUY] failed", e);
      setBuyErr(e?.message ?? "Payment failed");
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black relative">
      <SharkFrame />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-black max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-md bg-[#00A3FF] grid place-items-center">
              <img src="/logo.png" alt="AQUA" className="w-14 h-14 object-contain" />
            </div>
            <div className="leading-tight">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">AQUA SHOP</h1>
              <p className="text-[11px] md:text-xs text-neutral-600 uppercase font-semibold">GENESIS EDITION • 9 TEES</p>
            </div>
          </div>
          <a href="#grid" className="rounded-md px-5 py-2 text-sm md:text-base font-black bg-black text-white border-2 border-black hover:opacity-90 active:translate-y-[1px]">ENTER</a>
        </div>
        {/* Hard racing stripe */}
        <div className="mt-5 h-2 bg-black"></div>
        <div className="h-2 bg-[#00A3FF] w-1/2"></div>
      </header>

      {/* Hero (flat) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-8">
        <div className="rounded-md border-2 border-black">
          {HERO_VIDEO ? (
            <video src={HERO_VIDEO} className="w-full h-[42vh] md:h-[50vh] object-cover" autoPlay muted loop playsInline />
          ) : (
            <div className="w-full h-[28vh] md:h-[36vh] bg-neutral-100 grid place-items-center">
              <div className="text-center">
                <h2 className="text-2xl md:text-4xl font-black">AQUA TEE COLLECTION</h2>
                <p className="mt-2 text-sm md:text-base text-neutral-700 font-semibold uppercase">THANK YOU FOR SHOPPING HERE. YOUR BUSINESS IS APPRECIATED.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section id="grid" className="relative z-10 max-w-7xl mx-auto px-4 pb-20">
        <h3 className="text-center text-xl md:text-2xl font-black tracking-tight mb-6 uppercase">The Collection</h3>
        
        {(lastTx || buyErr) && (
          <div className="mb-4 rounded-sm border-2 border-black p-3 text-sm font-semibold">
            {lastTx ? (
              <div>
                Paid with ETH on Base. Tx:{" "}
                <a className="underline" href={`https://basescan.org/tx/${lastTx}`} target="_blank" rel="noreferrer">view on Basescan</a>
              </div>
            ) : null}
            {buyErr ? <div className="text-red-600">Error: {buyErr}</div> : null}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((p) => (
            <article key={p.id} className="group rounded-md border-2 border-black bg-white">
              {/* image */}
              <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black">
                <img alt={p.title} src={p.img} className="w-full h-full object-cover" />
                <div className="absolute left-3 top-3">
                  <span className="px-2 py-1 bg-[#00A3FF] text-white text-xs font-black uppercase tracking-wide">
                    {p.tag}
                  </span>
                </div>
                <div className="absolute right-3 top-3">
                  <div className="w-12 h-12 bg-white border-2 border-black">
                    <img src="/logo.png" alt="AQUA" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              {/* content */}
              <div className="p-4">
                <h3 className="font-black text-lg mb-3 text-black leading-tight uppercase tracking-wide">
                  {p.title}
                </h3>
                
                {/* VIN PLATE PRICE */}
                <div className="mb-4">
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-black text-white font-black text-sm border-2 border-black">
                    <span className="text-xs">$</span>
                    <span>{p.price}</span>
                  </div>
                </div>

                {/* DUAL BUTTONS */}
                <div className="space-y-2">
                  {/* BUY NOW - BLACK SLAB */}
                  <button
                    onClick={() => handleBuyEth(p as any)}
                    disabled={buyingId === p.id}
                    className={`w-full py-3 px-4 rounded-md border-2 border-black font-black text-center block uppercase tracking-wide transition-all duration-150 ${
                      buyingId === p.id ? "bg-neutral-400 text-white cursor-wait" : "bg-black text-white hover:bg-neutral-800 active:translate-y-[1px]"
                    }`}
                  >
                    {buyingId === p.id ? "SENDING…" : `BUY • $${p.price}`}
                  </button>
                  
                  {/* MAKE ME AN OFFER - WHITE SLAB WITH THICK BORDER */}
                  <button
                    onClick={() => openOffer(p)}
                    className="w-full bg-white text-[#00A3FF] font-black py-3 px-4 rounded-md border-4 border-[#00A3FF] hover:bg-[#00A3FF] hover:text-white active:translate-y-[1px] transition-all duration-150 text-center block uppercase tracking-wide"
                  >
                    MAKE ME AN OFFER
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 pb-12">
        <div className="rounded-md border-2 border-black bg-neutral-100 p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-black font-semibold">
                VINTAGE/ARCHIVAL TEES SOLD AS-IS. FINAL SALE. SHIPPING CALCULATED AFTER PURCHASE OR ACCEPTED OFFER.
              </p>
              <p className="text-xs text-neutral-600 mt-1 font-semibold uppercase">© {new Date().getFullYear()} AQUA TEES ARCHIVE</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#grid"
                className="rounded-md px-4 py-2 text-sm font-black bg-white border-2 border-black hover:bg-black hover:text-white transition-colors uppercase"
              >
                BACK TO GRID
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("General question about Aqua Tees")}`}
                className="rounded-md px-4 py-2 text-sm font-black bg-[#00A3FF] text-white border-2 border-[#00A3FF] hover:bg-white hover:text-[#00A3FF] transition-colors uppercase"
              >
                EMAIL AQUA
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Offer Modal */}
      {offerOpen && offerFor && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md border-4 border-black p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-black uppercase tracking-wide">
                MAKE AN OFFER
              </h3>
              <button
                onClick={closeOffer}
                className="text-black hover:text-neutral-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="relative border-b-2 border-black p-4">
              <div className="rounded-sm border-2 border-black p-3 grid grid-cols-[96px,1fr] gap-3 items-center">
                <div className="aspect-square bg-neutral-50 border-2 border-black overflow-hidden">
                  <img src={offerFor.img} alt={offerFor.title} className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-base font-black">{offerFor.title}</div>
                  {offerFor.price ? (
                    <div className="text-xs text-neutral-700">List: ${offerFor.price}</div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-black tracking-tight">{offerFor.title}</h3>
              {offerFor.price ? (
                <p className="text-xs text-neutral-700 mt-1">List price ${offerFor.price}</p>
              ) : null}

              <form className="mt-4 space-y-3" onSubmit={submitOffer}>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="name"
                    placeholder="Your name"
                    className="w-full rounded-sm border-2 border-black px-3 py-2"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full rounded-sm border-2 border-black px-3 py-2"
                  />
                </div>

                <input
                  name="price"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Your offer (USD)"
                  className="w-full rounded-sm border-2 border-black px-3 py-2"
                />

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-sm px-4 py-2.5 bg-black text-white font-black border-2 border-black"
                  >
                    SEND OFFER
                  </button>
                  <button
                    type="button"
                    onClick={closeOffer}
                    className="rounded-sm px-4 py-2.5 bg-white font-black border-2 border-black"
                  >
                    CANCEL
                  </button>
                </div>

                <p className="text-[11px] text-neutral-600 pt-1">
                  Opens your email client; nothing is auto-sent.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SharkFrame() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Main frame border */}
      <div className="absolute inset-4 border-4 border-black rounded-lg"></div>
      
      {/* Corner chevrons */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-[#00A3FF] rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-[#00A3FF] rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-[#00A3FF] rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-[#00A3FF] rounded-br-lg"></div>
      
      {/* Side accent lines */}
      <div className="absolute left-0 top-1/2 w-2 h-16 bg-[#00A3FF] -translate-y-1/2"></div>
      <div className="absolute right-0 top-1/2 w-2 h-16 bg-[#00A3FF] -translate-y-1/2"></div>
    </div>
  );
}
