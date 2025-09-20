# Aqua Tee Storefront

A Frutiger Aero style storefront for your curated t-shirt collection. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 **Frutiger Aero Aesthetic** - Glass morphism, aqua gradients, floating elements
- 👕 **9 T-Shirt Collection** - Mix of fixed prices and "make an offer" items
- 💰 **Crypto Payments** - ETH payments on Base network with automatic USD conversion
- 📧 **Email Offers** - "Make an offer" opens pre-filled mailto
- 📱 **Responsive Design** - Looks great on all devices
- 🎬 **Hero Video Support** - Optional background video
- ⚡ **No Backend Required** - Pure frontend solution

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your images:**
   - Place your 7 t-shirt images in `public/shirts/`
   - See `public/shirts/README.md` for naming conventions

3. **Configure your store:**
   - Update `CONTACT_EMAIL` in `app/page.tsx` with your email
   - Replace `WALLET_ADDRESS` in `app/page.tsx` with your actual wallet address
   - Optionally add a hero video URL

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## Customization

### Adding Your Images
Replace the placeholder images in `public/shirts/` with your actual t-shirt photos:
- `og-aqua-wave.jpg`
- `sky-bubble-logo.jpg`
- `chrome-spray.jpg`
- `frutiger-sunburst.jpg`
- `aero-droplet.jpg`
- `horizon-glass.jpg`
- `aquifer-grid.jpg`

### Setting Up Crypto Payments
1. Replace `WALLET_ADDRESS` in `app/page.tsx` with your actual wallet address
2. All products automatically support ETH payments on Base network
3. Prices are automatically converted from USD to ETH using live exchange rates
4. Gas fees are paid by the buyer (standard Base network behavior)

### Adding a Hero Video
1. Add your video file to `public/video/` (e.g., `aqua-lander.mp4`)
2. Update the `HERO_VIDEO` variable in `app/page.tsx`

### Styling
The design uses custom Tailwind classes for the Frutiger Aero aesthetic:
- `glass-effect` - Glass morphism backgrounds
- `aqua-gradient` - Aqua color gradients
- `shimmer-effect` - Animated shimmer highlights

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
- **Netlify**: Connect your GitHub repo
- **Cloudflare Pages**: Upload your build folder
- **Any static host**: Run `npm run build` and upload the `out` folder

## File Structure

```
aquashop/
├── app/
│   ├── globals.css          # Global styles and Tailwind config
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main storefront component
├── public/
│   └── shirts/              # Your t-shirt images go here
├── package.json
├── tailwind.config.js       # Custom colors and animations
└── README.md
```

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **EIP-1193** - Web3 wallet integration (MetaMask compatible)
- **Base Network** - Ethereum L2 for fast, low-cost transactions
- **Custom Animations** - Floating elements and shimmer effects

## Crypto Payment Features

- **Automatic USD to ETH Conversion** - Live exchange rates from CoinGecko API
- **Base Network Integration** - Fast, low-cost transactions on Ethereum L2
- **Wallet Connection** - Seamless MetaMask and compatible wallet support
- **Transaction Tracking** - Direct links to BaseScan for transaction verification
- **Gas Fee Handling** - Buyers pay their own gas fees (standard practice)
- **Memo Support** - Product information included in transaction data

## License

MIT License - feel free to use this for your own projects!
