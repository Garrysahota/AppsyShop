# Appsy Shop — E-commerce React Native App
## Project Documentation & Architecture Guide

**Niche:** Sneakers / Streetwear store
**Workflow:** Bare React Native CLI (no Expo)
**Target platform:** Android-only build/APK (local Gradle, zero cost)
**Cost:** $0 — all free-tier tools

---

## 1. Project Overview

**Goal:** A portfolio-grade e-commerce mobile app demonstrating production-level React Native skills — clean architecture, scalable folder structure, real integrations (auth, cart, checkout, payments), and modern UI.

**Target recruiters' checklist this project covers:**
- State management (Redux Toolkit)
- Firebase (Auth, Firestore, Messaging)
- API integration (Axios + DummyJSON)
- Navigation (React Navigation — stack + tabs)
- Payment flow (Stripe test mode)
- Push notifications
- Biometric auth
- Reusable component library
- Clean, modular, scalable code (not a tutorial clone)

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React Native 0.75.x (bare CLI, TypeScript template) | Best library-compatibility window, avoids new-architecture edge cases |
| Language | TypeScript | Professional maturity, catches bugs early |
| State | Redux Toolkit + RTK Query | Matches your resume claim, industry standard |
| Navigation | React Navigation v6 (Native Stack + Bottom Tabs) | Standard, well documented |
| Backend/Auth | Firebase Auth + Firestore (`@react-native-firebase`) | Free tier, fast to integrate, real-time |
| Product Data | DummyJSON API (`dummyjson.com/products/category/mens-shoes`) | Free, real images, zero backend needed |
| Payments | Stripe (test mode) | Recognized name, recruiters trust it |
| Styling | StyleSheet + theme tokens | Full native control (no NativeWind dependency risk on bare RN) |
| Forms | React Hook Form + Zod | Clean validation, professional pattern |
| Storage | AsyncStorage / MMKV | Cart persistence, token storage |
| Images | react-native-fast-image | Performance |
| Notifications | `@react-native-firebase/messaging` | Matches your "modular notification system" achievement |
| Biometric | react-native-biometrics | Matches your existing biometric-auth achievement |
| Maps (optional) | react-native-maps | Store locator / delivery tracking, matches resume |
| Build | Local Gradle (`./gradlew assembleRelease`) | Free, unlimited, no EAS quota |

---

## 3. Folder Structure (Feature-based, Microservice-ready)

Feature-based structure so each domain (auth, product, cart, order) is self-contained — easy to later extract into separate modules or even separate repos/micro-frontends if the app grows.

```
appsy-shop/
├── app.json
├── App.tsx
├── babel.config.js
├── tsconfig.json
├── .env
├── docs/
│   ├── PROJECT_DOCUMENTATION.md
│   └── AGENT_INSTRUCTIONS.md
│
├── src/
│   ├── app/                      # App-level setup
│   │   ├── App.tsx
│   │   ├── providers/            # Redux Provider, Theme Provider, Navigation Container
│   │   └── navigation/
│   │       ├── RootNavigator.tsx
│   │       ├── AuthNavigator.tsx
│   │       ├── MainTabNavigator.tsx
│   │       └── types.ts
│   │
│   ├── features/                 # ONE FOLDER PER DOMAIN = "microservice-style"
│   │   ├── auth/
│   │   │   ├── screens/          # LoginScreen, SignupScreen, ForgotPassword
│   │   │   ├── components/
│   │   │   ├── store/            # authSlice.ts
│   │   │   ├── services/         # authApi.ts (Firebase calls)
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   │
│   │   ├── products/
│   │   │   ├── screens/          # HomeScreen, ProductDetailScreen, SearchScreen
│   │   │   ├── components/       # ProductCard, ProductGrid, FilterSheet
│   │   │   ├── store/            # productsSlice.ts / productsApi.ts (RTK Query)
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   │
│   │   ├── cart/
│   │   │   ├── screens/          # CartScreen
│   │   │   ├── components/       # CartItem, CartSummary
│   │   │   ├── store/            # cartSlice.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── checkout/
│   │   │   ├── screens/          # CheckoutScreen, AddressScreen, PaymentScreen
│   │   │   ├── components/
│   │   │   ├── services/         # stripeService.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── orders/
│   │   │   ├── screens/          # OrderHistoryScreen, OrderDetailScreen
│   │   │   ├── components/
│   │   │   └── store/
│   │   │
│   │   ├── profile/
│   │   │   ├── screens/          # ProfileScreen, EditProfileScreen
│   │   │   └── components/
│   │   │
│   │   └── notifications/
│   │       ├── services/         # notificationService.ts
│   │       ├── components/       # Toast/NotificationBanner (reuse your existing achievement)
│   │       └── context/          # NotificationContext.tsx
│   │
│   ├── shared/                   # Cross-feature reusable code
│   │   ├── components/           # Button, Input, Card, LoadingSpinner, EmptyState
│   │   ├── hooks/                # useDebounce, useAppSelector, useAppDispatch
│   │   ├── utils/                # formatCurrency, validators, helpers
│   │   ├── constants/             # apiEndpoints.ts, config.ts
│   │   └── types/                # global.d.ts
│   │
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   ├── store/
│   │   ├── store.ts               # combineReducers, configureStore
│   │   └── rootReducer.ts
│   │
│   └── api/
│       ├── axiosClient.ts         # base Axios instance + interceptors
│       └── firebaseConfig.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
└── __tests__/
```

**Why this structure works well in interviews:**
- Each `features/*` folder is self-contained (screens + components + state + services together) — you can explain "if this were to scale into microservices, each feature folder maps to one backend service or one team's ownership."
- `shared/` prevents duplication.
- Recruiters immediately recognize this as a scalable, real-world pattern — not a flat tutorial structure.

---

## 4. Coding Standards

- **Naming:** PascalCase for components, camelCase for functions/variables, `use` prefix for hooks.
- **One component per file**, co-located styles.
- **No inline business logic in screens** — screens call hooks/services; logic lives in `store/` or `services/`.
- **Absolute imports** via `tsconfig.json` paths (`@features/*`, `@shared/*`, `@theme/*`) — avoids `../../../` chains.
- **Error handling:** centralized in `axiosClient.ts` interceptors + a global `ErrorBoundary`.
- **Reusable UI kit first** — build `Button`, `Input`, `Card`, `Badge`, `Skeleton` before screens, then compose.

---

## 5. Theme — Modern Quick-Commerce Style (Zepto/Blinkit-inspired, No Orange, No Plain Blue)

Reference point: Zepto, Blinkit, Swiggy Instamart — vibrant gradient backgrounds, glassmorphic cards, bold rounded typography, punchy gradient CTA buttons, dark floating bottom nav. This reads as current (2026), not a tutorial-clone look.

### Primary Palette — "Violet Pulse"

| Token | Hex | Use |
|---|---|---|
| `primary` | `#7C3AED` | Violet — primary actions, active states |
| `primaryGradientStart` | `#7C3AED` | Gradient start (buttons, hero banners, top header) |
| `primaryGradientEnd` | `#EC4899` | Gradient end — violet → pink |
| `secondary` | `#1A1625` | Deep purple-black — dark cards, bottom nav, headers |
| `accent` | `#A3E635` | Fresh lime — badges, discounts, "in stock" tags (replaces orange) |
| `backgroundStart` | `#F5F3FF` | Soft lavender-white — app background gradient start |
| `backgroundEnd` | `#FFFFFF` | App background gradient end |
| `surface` | `#FFFFFF` | Cards (with soft violet-tinted shadow, not gray) |
| `surfaceGlass` | `rgba(255,255,255,0.6)` | Glassmorphic overlay cards on banners/images |
| `textPrimary` | `#1A1625` | Headings |
| `textSecondary` | `#6B7280` | Body/secondary text |
| `success` | `#22C55E` | Order confirmed, in-stock |
| `error` | `#F43F5E` | Errors, out-of-stock |
| `border` | `#EDE9FE` | Dividers, input borders (violet-tinted) |

**Design rules that make it feel like Zepto/Blinkit, not a generic template:**
- Backgrounds are never flat white — use a subtle top-to-bottom gradient (`backgroundStart → backgroundEnd`) or a soft radial "mesh" behind hero sections.
- Buttons and banners use the **violet → pink gradient**, not a flat fill.
- Cards: 20–24px rounded corners (bigger than typical 12px — feels more "app-native" and current), soft colored shadow (violet at low opacity, not gray).
- Bold, large, tight-tracking headings (weight 700–800) — quick-commerce apps lean heavy typography, minimal copy.
- Category icons: colorful rounded-square tiles (glassmorphic or gradient-filled), not plain line icons.
- Bottom nav: floating pill/rounded-rectangle bar (not a flat edge-to-edge bar), dark (`secondary` color) with the active icon lit up in gradient or lime.
- Micro-badges (discount %, "New", delivery time) use `accent` lime or small gradient chips, never orange.

---

## 6. MVP Feature List (build in this order)

1. Auth (Firebase email/password + Google sign-in)
2. Product listing + detail (DummyJSON sneakers category)
3. Cart (add/remove/update qty, persisted with AsyncStorage)
4. Checkout + Stripe test payment
5. Order history
6. Push notification on order status change
7. Profile + biometric app-lock (reuse your existing biometric auth achievement)
8. Polish: skeleton loaders, empty states, dark mode toggle

## 6a. Screen Flow (full list)

1. Splash/Onboarding
2. Login / Signup / Forgot Password
3. Home (banner, categories, featured grid)
4. Search + Filter
5. Product Detail (gallery, size/color, add-to-cart, reviews)
6. Cart
7. Checkout (address → payment → review)
8. Order Success
9. Order History / Order Detail
10. Wishlist
11. Profile (edit info, addresses, biometric toggle, logout)
12. Notifications

**Build priority for fastest demo:** Auth → Home → Product Detail → Cart → Checkout → Order Success

---

## 7. Deployment / Portfolio Checklist

- [ ] EAS Build → generate APK link (shareable, no Play Store needed)
- [ ] Expo Go QR code on portfolio site for instant preview
- [ ] Public GitHub repo, clean README with screenshots + tech stack badges
- [ ] 30-second demo video/GIF on portfolio page
- [ ] Live "case study" write-up: problem → architecture decision → result (recruiters love this over just screenshots)
