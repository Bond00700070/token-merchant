# Token Merchant — Go-To-Market Playbook

> Built for a $0 starting capital + nights/weekends time budget.
> Goal: $1M total lifetime revenue, no fixed deadline.

This is the "what to do after the code is shipped" plan. The store is the
easy part. **Distribution is the hard part.** Read this all the way through
before doing anything else.

---

## 1. Honest unit economics

Before you do anything, anchor on the math. POD apparel is a low-margin,
high-conversion business. Order of magnitude per item:

| Line item             | Tee   | Hoodie | Mug   | Sticker pack |
| --------------------- | ----- | ------ | ----- | ------------ |
| Retail price          | $28   | $48    | $19   | $12          |
| Printful product cost | ~$13  | ~$28   | ~$8   | ~$3          |
| Printful shipping     | ~$5   | ~$6    | ~$5   | ~$4          |
| Stripe fee (~2.9%+30¢)| ~$1.10| ~$1.70 | ~$0.85| ~$0.65       |
| **Profit / unit**     | ~$8.90| ~$12.30| ~$5.15| ~$4.35       |
| **Margin**            | ~32%  | ~26%   | ~27%  | ~36%         |

Replace these numbers with your own once you pick real products from Printful.

**Implication:** at ~$8/unit average profit, $1M total revenue means roughly
**35,000–40,000 orders** over the life of the store. That is a lot. The only
way to get there on $0 ad budget is **organic content + repeat customers**.

---

## 2. The first 10 sales (Weeks 1–4)

This is the "do things that don't scale" phase. You don't need a marketing
funnel yet. You need *proof one human will buy your stuff*.

- **Pick the 3 cleanest designs.** Don't ship 20 mediocre items; ship 3 good
  ones. Replace the placeholder products in `lib/products.ts` with your own.
- **Order one of each yourself** (Printful samples are ~50% off). Photograph
  them. Real product photos > Printful mockups for conversion.
- **Post in 5 places where AI builders already are**:
  1. r/LocalLLaMA, r/MachineLearning, r/ChatGPTCoding (read the rules — most
     subs allow self-promo on weekends or in a "self-promotion Saturday" thread).
  2. Hacker News "Show HN".
  3. AI Twitter/X. Quote-tweet a popular AI post with a relevant design.
  4. AI Discord servers (LocalLLaMA, Latent Space, Hugging Face, etc.).
  5. Your own existing GitHub profile / project READMEs (`free-claude-code`).
- **Ship one design that goes viral.** It's a numbers game. Aim for 1
  meme-able design per drop.
- **Goal:** 10 paid orders. If you can't get to 10, the niche or the design
  is wrong, not the funnel.

---

## 3. The first $1,000 (Months 2–3)

Once you have proof, build a small content engine.

### Channel 1: Short-form video (TikTok / Reels / YouTube Shorts)
- 1 short per design. "POV: you're a prompt engineer" style.
- Cheap to make. One viral clip = 100+ orders.
- Use sounds that are trending in tech-Twitter / dev TikTok.

### Channel 2: Programmatic SEO
- The store already generates product pages with structured data and a
  sitemap. Add to it:
  - **Comparison pages**: e.g. `/blog/best-prompt-engineer-gifts-2026`. Build
    these as MDX files in a new `app/blog/[slug]` route.
  - **Niche guides**: `/guides/what-to-wear-as-a-prompt-engineer`.
- Each page needs a clear keyword target. Use the free tier of
  [Mangools](https://mangools.com/) or Google Trends to find keywords with
  >100 monthly searches and low difficulty.

### Channel 3: GitHub README cross-promotion
You own `Bond00700070/free-claude-code`. Add a tiny line at the bottom of its
README: "Made by the same person who runs Token Merchant — merch for AI
builders." Free traffic, every visitor.

### Channel 4: Newsletter
- Resend free tier supports 3,000 contacts.
- Goal: 1 email per drop (every 2 weeks). Don't email more often.
- Content: behind-the-scenes of the design + a discount code for subscribers.
- A 1,000-person list at 5% open-to-buy = 50 sales/email = a couple thousand
  $/email by month 6.

---

## 4. The first $10k (Months 4–9)

Now you're optimising.

- **A/B test prices**. Move tees from $28 → $30 → $32. Watch conversion. Keep
  the price that maximises profit per visitor, not orders per visitor.
- **Add 1 hero SKU per drop.** A single "I'm a fan" item every 2 weeks. Old
  drops live on the shop page indefinitely — this is the long tail.
- **Email automation**: abandoned-cart sequence (3 emails over 5 days) via
  Resend. Recovers ~10% of abandoned carts.
- **Launch on Product Hunt** when you have 8+ products. Aim for top 5 of the
  day in Design Tools / Shopping.
- **Affiliates**: 10% commission to any AI influencer who posts a custom
  discount code. Use [Tolt](https://tolt.io/) free tier.
- **Bundles**: "Prompt engineer starter pack" = tee + mug + stickers at 10%
  off. Bundles drive AOV up 30–50% in apparel.

---

## 5. The path to $100k (Year 1–2)

This is the inflection point. To compound past $10k/month you need at least
one of:

1. **A repeat-customer engine.** Your existing buyers buy 2x/year on average.
   Email them every drop. AOV goes up over time.
2. **A flagship piece of content** that ranks #1 on Google for a buying
   keyword (e.g. "prompt engineer gifts"). One of these = $5–20k/year passive.
3. **A creator partnership.** Find one mid-tier AI YouTuber (~50k subs) and
   offer them a 20% rev-share co-branded drop. Their audience converts at
   2–5% on co-branded merch.

Reinvest 50% of profit into:
- Better photography (~$200–500 for a real photoshoot once you have 5 SKUs).
- A custom domain + email (Google Workspace ~$6/month).
- A logo / wordmark from a designer on Cara/Dribbble.

---

## 6. The path to $1M (Year 2+)

To compound to $1M lifetime, do the unglamorous things:

- **Treat it like a real business.** Track orders, fulfillment errors,
  refunds. Printful + Stripe both export CSVs. Run a monthly P&L.
- **Expand from POD to limited drops.** Once a design proves it can sell
  500 units, screen-print a real run. Margins double.
- **Consider physical products** in the same niche (a physical "rubber duck
  prompt debugger", a notebook). Suppliers on Alibaba have $300–500 MOQ.
- **Trademark the name** when annual revenue passes ~$50k. Protects you
  against knock-offs.
- **Hire one VA** (~$5/hr on OnlineJobs.ph) to handle customer service when
  ticket volume passes ~10/week.

---

## 7. Things that will kill you — avoid

- **Shipping on AliExpress to US customers.** 14–30 day shipping = 80%+ of
  orders churn / refund. Stick to Printful / a US-based dropshipper.
- **Generic "general store" branding.** "GadgetHub" with 200 random products
  = doesn't rank, doesn't convert. Niche or die.
- **Using copyrighted/trademarked logos.** "OpenAI"/"Claude"/"Anthropic" on a
  shirt = takedown notice + lawsuit risk. Stay in fair-use parody (e.g.
  "tokens go brrr") not branded merch.
- **Paying for ads before you have proof.** $100 in Meta ads to a 0.5%-
  conversion store = lit on fire. Wait until your organic conversion rate is
  >2% to spend a dollar.
- **Shipping more designs than you can promote.** 1 great drop > 10 mediocre
  drops. Quality > quantity.

---

## 8. Milestones / honest timeline

| Milestone     | Realistic timeline (nights/weekends) |
| ------------- | ------------------------------------- |
| First sale    | Weeks 2–4 (after first content push)  |
| $1k revenue   | Months 2–4                            |
| $10k revenue  | Months 6–12                           |
| $100k revenue | Year 1–3 (if content engine compounds)|
| $1M lifetime  | Year 3–5+, conditional on the above   |

These are *realistic* numbers, not best-case. Most stores never hit $10k.
The ones that hit $1M almost always have either (a) a content creator
attached, (b) a programmatic SEO moat, or (c) a viral moment.

You only need one of those three. Pick which one you'll go after first.

---

## 9. What to do this week

1. Replace the 6 placeholder products in `lib/products.ts` with real Printful
   sync variants from your dashboard.
2. Order one of each design as a sample. Photograph it.
3. Set up real Stripe live keys + webhook in Vercel.
4. Buy the domain (Cloudflare Registrar = at-cost ~$10/year).
5. Post your first design somewhere AI builders hang out.
6. Set a calendar reminder: "Token Merchant new drop" every other Friday.

That's it. Build → ship → iterate. The compounding is in the cadence.
