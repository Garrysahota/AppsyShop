# 👟 AppsyShop — Limited Sneaker Drops & Streetwear E-Commerce Platform

AppsyShop is a state-of-the-art, feature-rich React Native mobile application built for high-heat sneaker launches, streetwear collections, and luxury footwear. It features real-time drop countdowns, localized currency engines, Indian/UK size preferences, Razorpay payment flows, and Firebase authentication.

---

## 🌟 Key Features

### ⚡ Live Sneaker Drops & Flash Sales
- **Real-Time Drop Timers**: Countdown timers for upcoming limited-edition sneaker releases.
- **Hot Drop Badges & Stock Indicators**: Visual cues for low stock, rare drops, and exclusive discounts.

### 🌍 Dynamic Localized Currency Engine
- **Auto-Location Detection**: Automatically identifies whether the user is located in India or international regions using IP & GPS geolocation.
- **Localized Formatting**: Renders prices seamlessly in Indian Rupees (`₹`) or US Dollars (`$`) across all product cards, cart, and checkout summaries.
- **Manual Currency Switcher**: Interactive selector inside Profile settings to toggle preferences on demand.

### 👟 Indian / UK Shoe Size Preference System
- Customized sneaker size selection adhering to UK / Indian footwear standards.
- Preference persistence using high-performance MMKV storage across filters and checkout flows.

### 💳 Complete Checkout & Razorpay Integration
- **Razorpay Checkout**: Seamless payment simulation supporting:
  - **UPI Apps**: Google Pay, PhonePe, Paytm, BHIM, and custom VPAs.
  - **Cards**: Auto-fill test card simulator with 3D Secure OTP verification.
  - **Netbanking**: Major Indian banks (HDFC, ICICI, SBI, Axis, Kotak).
  - **Wallets**: Amazon Pay, Mobikwik.
- **Order Tracking & Digital Verification**: Order confirmation screen with real-time ETA countdowns and NFC authentication tags.

### ⚡ 60 FPS Native Performance & Premium Dark-Mode UI
- **Native-Driven Animations**: Custom bottom sheet filters powered by `useNativeDriver: true` and `translateY` transforms.
- **Memoized Navigation**: Tab bar rendering optimized to prevent redundant SVG re-renders and eliminate navigation delays.
- **Neon Glassmorphism Aesthetic**: Rich dark theme with vibrant gradients.

---

## 🏗️ Architecture & Project Structure

The codebase is organized following feature-based architecture principles:

```text
AppsyShop/
├── android/                   # Android native project files & Gradle build configs
├── ios/                       # iOS native Xcode project files & Podfile
├── src/
│   ├── app/                   # App root setup & navigation navigators
│   │   ├── navigation/        # RootNavigator, MainTabNavigator, CustomBottomTabBar
│   ├── features/              # Feature modules (Domain-driven structure)
│   │   ├── auth/              # Firebase Authentication, Login/Register screens
│   │   ├── cart/              # Cart management, state slice, components
│   │   ├── checkout/          # Razorpay Modal, Address Modal, Order Success
│   │   ├── notifications/     # Notifications feed & preferences
│   │   ├── products/          # Product details, filtering bottom sheet, search
│   │   └── profile/           # User profile, size & currency modals
│   ├── shared/                # Decoupled utilities, services, & shared components
│   │   ├── hooks/             # Typed Redux hooks (useAppDispatch, useAppSelector)
│   │   ├── services/          # Location service & API clients
│   │   ├── store/             # Global preferences slice (Currency & Region)
│   │   └── utils/             # Currency formatters & helpers
│   ├── store/                 # Redux Toolkit store configuration & MMKV persistence
│   └── theme/                 # Design tokens, color palette, typography & spacing
├── App.tsx                    # Main App entrance & Redux Persist Provider
├── index.js                   # App registry entry point
└── package.json               # Dependencies & scripts
```

---

## 🛠️ Tech Stack & Libraries

- **Framework**: React Native `0.76+`
- **Language**: TypeScript
- **State Management**: Redux Toolkit & Redux Persist
- **Local Storage**: `react-native-mmkv`
- **Backend & Auth**: Firebase Auth & Cloud Firestore (`@react-native-firebase/auth`, `@react-native-firebase/firestore`)
- **Payment Gateway**: Razorpay Integration
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **Icons & UI Effects**: Lucide Icons (`lucide-react-native`) & Linear Gradients (`react-native-linear-gradient`)

---

## 🚀 Getting Started & Installation Guide

### Prerequisites

Ensure your environment is set up with the following tooling:
- **Node.js**: `v18.0.0` or higher
- **JDK**: OpenJDK 17
- **Android Studio**: Android SDK (API 34+), Android SDK Build-Tools
- **Xcode**: 15+ (for macOS iOS builds)
- **CocoaPods**: (for iOS dependencies)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Garrysahota/AppsyShop.git
cd AppsyShop
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Android Google Services (Firebase)

1. Obtain `google-services.json` from your Firebase Console.
2. Place `google-services.json` inside the `android/app/` folder:
   ```text
   android/app/google-services.json
   ```
3. Ensure your **Debug** and **Release** SHA-1 fingerprints are registered in Firebase Project Settings:
   - To obtain SHA-1 for Debug keystore:
     ```bash
     keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android
     ```
   - To obtain SHA-1 for Release keystore:
     ```bash
     keytool -list -v -keystore android/app/appsyshop-release-key.keystore -alias appsyshop-key-alias
     ```

---

## 📱 Running the Application

### Start the Metro Bundler

```bash
npx react-native start
```

### Run on Android (Device or Emulator)

Connect your physical Android device via USB (with USB Debugging enabled) or start an Android Virtual Device (AVD), then execute:

```bash
npx react-native run-android
```

### Run on iOS Simulator (macOS only)

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 📦 Building Signed Release APK for Production

To build a signed production release APK:

### 1. Generate / Verify Release Keystore

The release keystore configuration is set in `android/gradle.properties`:

```properties
APPSYSHOP_RELEASE_STORE_FILE=appsyshop-release-key.keystore
APPSYSHOP_RELEASE_KEY_ALIAS=appsyshop-key-alias
APPSYSHOP_RELEASE_STORE_PASSWORD=YourSecurePassword
APPSYSHOP_RELEASE_KEY_PASSWORD=YourSecurePassword
```

### 2. Execute Assemble Release Command

```bash
cd android
./gradlew assembleRelease
```

### 3. Output APK Location

Upon successful build completion, the APK will be generated at:
```text
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🧪 Testing & Code Quality Verification

### Run Type Checking

```bash
npx tsc --noEmit
```

### Run Unit Test Suite

```bash
npm test
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
