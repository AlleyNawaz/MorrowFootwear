# Morrow Footwear — Production Deployment Guide

This guide details steps for deploying the Morrow e-commerce application to production environments.

---

## 1. Automated Verification Prior to Deployment

Run all test suites and production builds locally or in your CI/CD pipeline:

```bash
# 1. Run unit test suite
npm run test

# 2. Run TypeScript build and Next.js page generation
npm run build
```

---

## 2. Deploying to Vercel (Recommended)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically detects Next.js App Router and applies the optimal build configuration:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install --legacy-peer-deps`
4. Add environment variables if integrating real third-party services:
   ```env
   NEXT_PUBLIC_SITE_URL=https://morrowshoes.com
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

---

## 3. Deploying via Docker / Standalone Node Server

To run Morrow as a standalone Node.js container:

1. In `next.config.ts`, set `output: "standalone"`.
2. Build the Docker image:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --legacy-peer-deps
   COPY . .
   RUN npm run build

   FROM node:20-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```
3. Expose port `3000` and start the container.
