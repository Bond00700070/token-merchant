import Link from "next/link";
import { EmailCapture } from "@/components/EmailCapture";
import { SITE } from "@/lib/seo";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="container-tight grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-lg font-semibold">
            Token<span className="text-accent">.</span>Merchant
          </div>
          <p className="mt-2 max-w-xs text-sm text-muted">{SITE.description}</p>
        </div>
        <div>
          <div className="label">Shop</div>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <Link href="/shop?category=apparel" className="hover:text-accent">
                Apparel
              </Link>
            </li>
            <li>
              <Link href="/shop?category=drinkware" className="hover:text-accent">
                Drinkware
              </Link>
            </li>
            <li>
              <Link href="/shop?category=stickers" className="hover:text-accent">
                Stickers
              </Link>
            </li>
            <li>
              <Link href="/shop?category=posters" className="hover:text-accent">
                Posters
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="label">Drops & restocks</div>
          <p className="mt-2 text-sm text-muted">
            One email per drop. No newsletter spam.
          </p>
          <div className="mt-3">
            <EmailCapture />
          </div>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <div className="container-tight flex items-center justify-between py-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} Token Merchant</span>
          <span>Built on Next.js · Stripe · Print-on-demand</span>
        </div>
      </div>
    </footer>
  );
}
