import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  X,
  Zap,
} from 'lucide-react-native';
import { colors, spacing, typography } from '@theme';
import { RazorpayPaymentSuccess } from '../types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RazorpayModalProps {
  visible: boolean;
  amount: number; 
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (paymentData: RazorpayPaymentSuccess) => void;
  onFailure: (errorMsg: string) => void;
  onClose: () => void;
}

type TabType = 'upi' | 'card' | 'netbanking' | 'wallet';

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '⚡', color: '#4285F4' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: '#5F259F' },
  { id: 'paytm', name: 'Paytm UPI', icon: '🔵', color: '#00B9F1' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🇮🇳', color: '#008479' },
];

const POPULAR_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBIN' },
  { id: 'axis', name: 'Axis Bank', code: 'UTIB' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KKBK' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PUNB' },
];

const WALLETS = [
  { id: 'amazon', name: 'Amazon Pay', balance: '₹4,500' },
  { id: 'mobikwik', name: 'MobiKwik Wallet', balance: '₹2,150' },
  { id: 'lazypay', name: 'LazyPay (Pay Later)', balance: 'Limit ₹15,000' },
];

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  visible,
  amount,
  customerEmail = 'alex.mercer@appsyshop.com',
  customerPhone = '+91 98765 43210',
  onSuccess,
  onFailure,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabType>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [customUpiId, setCustomUpiId] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('123456');

  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [selectedWallet, setSelectedWallet] = useState('amazon');

  const inrAmount = Math.round(amount * 84);

  useEffect(() => {
    if (visible) {
      setIsProcessing(false);
      setIsSuccess(false);
      setShowOtpModal(false);
      setCustomUpiId('');
      setCardNumber('');
      setCardExpiry('');
      setCardCvv('');
      setCardHolder('');
    }
  }, [visible]);

  const handleFillTestCard = () => {
    setCardNumber('4111 2222 3333 4444');
    setCardExpiry('12/28');
    setCardCvv('123');
    setCardHolder('Alex Mercer');
  };

  const generateRazorpayPayload = (method: TabType): RazorpayPaymentSuccess => {
    const randomSuffix = Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      razorpay_payment_id: `pay_RZP${randomSuffix}`,
      razorpay_order_id: `order_SNK${randomSuffix}`,
      razorpay_signature: `sig_${randomSuffix}${Date.now().toString(36)}`,
      method,
    };
  };

  const triggerPaymentExecution = (method: TabType) => {
    setIsProcessing(true);
    setProcessingStep('Connecting to Razorpay Demo Gateway...');

    setTimeout(() => {
      setProcessingStep('Authorizing ₹' + inrAmount.toLocaleString() + ' ($' + amount + ')...');

      setTimeout(() => {
        setProcessingStep('Securing bank authorization token...');

        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);

          setTimeout(() => {
            const payload = generateRazorpayPayload(method);
            onSuccess(payload);
          }, 900);
        }, 800);
      }, 700);
    }, 600);
  };

  const handleUpiPay = () => {
    triggerPaymentExecution('upi');
  };

  const handleCardPay = () => {
    if (!cardNumber || !cardExpiry || !cardCvv) {
      handleFillTestCard();
    }
    
    setShowOtpModal(true);
  };

  const handleOtpVerify = (simulateSuccess = true) => {
    setShowOtpModal(false);
    if (simulateSuccess) {
      triggerPaymentExecution('card');
    } else {
      onFailure('Payment failed: Card OTP verification was cancelled.');
    }
  };

  const handleNetbankingPay = () => {
    triggerPaymentExecution('netbanking');
  };

  const handleWalletPay = () => {
    triggerPaymentExecution('wallet');
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.container,
            { paddingBottom: Math.max(insets.bottom, 16) + spacing.xs },
          ]}>
          
          {}
          <View style={styles.rzpHeader}>
            <View style={styles.rzpHeaderTop}>
              <View style={styles.rzpBrandRow}>
                <View style={styles.rzpLogoBox}>
                  <Text style={styles.rzpLogoText}>R</Text>
                </View>
                <View>
                  <View style={styles.brandTitleRow}>
                    <Text style={styles.rzpBrandTitle}>Razorpay</Text>
                    <View style={styles.testBadge}>
                      <Text style={styles.testBadgeText}>⚡ TEST MODE</Text>
                    </View>
                  </View>
                  <Text style={styles.rzpMerchantText}>AppsyShop Drops Inc.</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={styles.rzpCloseBtn}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {}
            <View style={styles.amountStrip}>
              <View>
                <Text style={styles.amountLabel}>AMOUNT PAYABLE</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.amountPrimary}>₹{inrAmount.toLocaleString()}</Text>
                  <Text style={styles.amountSecondary}>(${amount})</Text>
                </View>
              </View>

              <View style={styles.customerInfo}>
                <Text style={styles.customerText}>{customerEmail}</Text>
                <Text style={styles.customerText}>{customerPhone}</Text>
              </View>
            </View>
          </View>

          {}
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="#0B67D4" style={{ marginBottom: 16 }} />
              <Text style={styles.processingTitle}>Processing Payment</Text>
              <Text style={styles.processingStepText}>{processingStep}</Text>
              <View style={styles.secureNotice}>
                <Lock size={12} color="#22C55E" />
                <Text style={styles.secureNoticeText}>100% Secure 256-Bit SSL Demo Sandbox</Text>
              </View>
            </View>
          ) : isSuccess ? (
            <View style={styles.processingContainer}>
              <View style={styles.successCircle}>
                <Check size={36} color="#FFFFFF" strokeWidth={3.5} />
              </View>
              <Text style={styles.successTitle}>Payment Approved! ⚡</Text>
              <Text style={styles.successSub}>
                Razorpay ID: pay_RZP{Math.random().toString(36).substring(2, 8).toUpperCase()}
              </Text>
            </View>
          ) : showOtpModal ? (
            
            <View style={styles.otpContainer}>
              <View style={styles.otpCard}>
                <View style={styles.otpHeader}>
                  <ShieldCheck size={20} color="#0B67D4" />
                  <Text style={styles.otpHeaderTitle}>Verified by Visa / 3D Secure</Text>
                </View>

                <Text style={styles.otpPrompt}>
                  Simulated Bank OTP sent to {customerPhone}:
                </Text>

                <TextInput
                  style={styles.otpInput}
                  value={otpValue}
                  onChangeText={setOtpValue}
                  keyboardType="numeric"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#888"
                />

                <TouchableOpacity
                  style={styles.otpSubmitBtn}
                  activeOpacity={0.85}
                  onPress={() => handleOtpVerify(true)}>
                  <Text style={styles.otpSubmitText}>Submit OTP & Authorize (Success)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.otpCancelBtn}
                  activeOpacity={0.7}
                  onPress={() => handleOtpVerify(false)}>
                  <Text style={styles.otpCancelText}>Simulate Bank Failure / Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            
            <View style={styles.mainBody}>
              {}
              <View style={styles.tabsRow}>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'upi' && styles.tabButtonActive]}
                  onPress={() => setActiveTab('upi')}>
                  <Smartphone size={15} color={activeTab === 'upi' ? '#0B67D4' : '#94A3B8'} />
                  <Text style={[styles.tabText, activeTab === 'upi' && styles.tabTextActive]}>
                    UPI
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'card' && styles.tabButtonActive]}
                  onPress={() => setActiveTab('card')}>
                  <CreditCard size={15} color={activeTab === 'card' ? '#0B67D4' : '#94A3B8'} />
                  <Text style={[styles.tabText, activeTab === 'card' && styles.tabTextActive]}>
                    Card
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'netbanking' && styles.tabButtonActive]}
                  onPress={() => setActiveTab('netbanking')}>
                  <Building2 size={15} color={activeTab === 'netbanking' ? '#0B67D4' : '#94A3B8'} />
                  <Text style={[styles.tabText, activeTab === 'netbanking' && styles.tabTextActive]}>
                    Netbanking
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'wallet' && styles.tabButtonActive]}
                  onPress={() => setActiveTab('wallet')}>
                  <Wallet size={15} color={activeTab === 'wallet' ? '#0B67D4' : '#94A3B8'} />
                  <Text style={[styles.tabText, activeTab === 'wallet' && styles.tabTextActive]}>
                    Wallets
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.tabContentScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.tabContent}>
                
                {}
                {activeTab === 'upi' && (
                  <View>
                    <Text style={styles.sectionTitle}>POPULAR UPI APPS</Text>
                    <View style={styles.upiAppsGrid}>
                      {UPI_APPS.map(app => {
                        const isSelected = selectedUpiApp === app.id;
                        return (
                          <TouchableOpacity
                            key={app.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedUpiApp(app.id)}
                            style={[styles.upiAppCard, isSelected && styles.upiAppCardActive]}>
                            <Text style={styles.upiAppIcon}>{app.icon}</Text>
                            <Text style={styles.upiAppName}>{app.name}</Text>
                            {isSelected && (
                              <View style={styles.selectedTick}>
                                <Check size={10} color="#FFFFFF" strokeWidth={3} />
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    <Text style={[styles.sectionTitle, { marginTop: 16 }]}>OR ENTER UPI ID / VPA</Text>
                    <View style={styles.upiInputRow}>
                      <TextInput
                        style={styles.upiInput}
                        placeholder="e.g. yourname@okhdfcbank"
                        placeholderTextColor="#64748B"
                        value={customUpiId}
                        onChangeText={setCustomUpiId}
                      />
                    </View>

                    {}
                    <TouchableOpacity
                      style={styles.payNowBtn}
                      activeOpacity={0.85}
                      onPress={handleUpiPay}>
                      <Text style={styles.payNowText}>
                        Pay ₹{inrAmount.toLocaleString()} via UPI ⚡
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {}
                {activeTab === 'card' && (
                  <View>
                    <View style={styles.testCardFillRow}>
                      <Text style={styles.sectionTitle}>CARD DETAILS</Text>
                      <TouchableOpacity
                        style={styles.fillTestCardBtn}
                        onPress={handleFillTestCard}>
                        <Zap size={12} color="#0B67D4" />
                        <Text style={styles.fillTestCardText}>Fill Test Card ⚡</Text>
                      </TouchableOpacity>
                    </View>

                    <TextInput
                      style={styles.cardInput}
                      placeholder="Card Number (4111 2222 3333 4444)"
                      placeholderTextColor="#64748B"
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      keyboardType="numeric"
                    />

                    <View style={styles.cardRow}>
                      <TextInput
                        style={[styles.cardInput, { flex: 1 }]}
                        placeholder="MM / YY"
                        placeholderTextColor="#64748B"
                        value={cardExpiry}
                        onChangeText={setCardExpiry}
                      />
                      <TextInput
                        style={[styles.cardInput, { flex: 1 }]}
                        placeholder="CVV (123)"
                        placeholderTextColor="#64748B"
                        value={cardCvv}
                        onChangeText={setCardCvv}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                    </View>

                    <TextInput
                      style={styles.cardInput}
                      placeholder="Cardholder Name"
                      placeholderTextColor="#64748B"
                      value={cardHolder}
                      onChangeText={setCardHolder}
                    />

                    {}
                    <TouchableOpacity
                      style={styles.payNowBtn}
                      activeOpacity={0.85}
                      onPress={handleCardPay}>
                      <Text style={styles.payNowText}>
                        Pay ₹{inrAmount.toLocaleString()} via Card 🔒
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {}
                {activeTab === 'netbanking' && (
                  <View>
                    <Text style={styles.sectionTitle}>SELECT YOUR BANK</Text>
                    <View style={styles.banksGrid}>
                      {POPULAR_BANKS.map(bank => {
                        const isSelected = selectedBank === bank.id;
                        return (
                          <TouchableOpacity
                            key={bank.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedBank(bank.id)}
                            style={[styles.bankCard, isSelected && styles.bankCardActive]}>
                            <Text style={styles.bankName}>{bank.name}</Text>
                            <View style={[styles.bankRadio, isSelected && styles.bankRadioActive]}>
                              {isSelected && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {}
                    <TouchableOpacity
                      style={styles.payNowBtn}
                      activeOpacity={0.85}
                      onPress={handleNetbankingPay}>
                      <Text style={styles.payNowText}>
                        Pay ₹{inrAmount.toLocaleString()} via Netbanking
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {}
                {activeTab === 'wallet' && (
                  <View>
                    <Text style={styles.sectionTitle}>SELECT WALLET</Text>
                    {WALLETS.map(w => {
                      const isSelected = selectedWallet === w.id;
                      return (
                        <TouchableOpacity
                          key={w.id}
                          activeOpacity={0.8}
                          onPress={() => setSelectedWallet(w.id)}
                          style={[styles.walletCard, isSelected && styles.walletCardActive]}>
                          <View>
                            <Text style={styles.walletName}>{w.name}</Text>
                            <Text style={styles.walletBalance}>{w.balance}</Text>
                          </View>
                          <View style={[styles.bankRadio, isSelected && styles.bankRadioActive]}>
                            {isSelected && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
                          </View>
                        </TouchableOpacity>
                      );
                    })}

                    {}
                    <TouchableOpacity
                      style={styles.payNowBtn}
                      activeOpacity={0.85}
                      onPress={handleWalletPay}>
                      <Text style={styles.payNowText}>
                        Pay ₹{inrAmount.toLocaleString()} via Wallet
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            </View>
          )}

          {}
          <View style={styles.footerSecurity}>
            <ShieldCheck size={13} color="#64748B" />
            <Text style={styles.footerSecurityText}>
              Secured by Razorpay • PCI-DSS Certified • Demo Sandbox
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  container: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(11, 103, 212, 0.3)',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  rzpHeader: {
    backgroundColor: '#0C2340',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  rzpHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rzpBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rzpLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#0B67D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rzpLogoText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rzpBrandTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  testBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  testBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900',
  },
  rzpMerchantText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 1,
  },
  rzpCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(11, 103, 212, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(11, 103, 212, 0.3)',
  },
  amountLabel: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  amountPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  amountSecondary: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  customerInfo: {
    alignItems: 'flex-end',
  },
  customerText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '500',
  },
  mainBody: {
    flexShrink: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#0A0F1D',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#0B67D4',
    backgroundColor: 'rgba(11, 103, 212, 0.08)',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#0B67D4',
    fontWeight: '800',
  },
  tabContentScroll: {
    maxHeight: 320,
  },
  tabContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  upiAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  upiAppCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 8,
    position: 'relative',
  },
  upiAppCardActive: {
    borderColor: '#0B67D4',
    backgroundColor: 'rgba(11, 103, 212, 0.15)',
  },
  upiAppIcon: {
    fontSize: 18,
  },
  upiAppName: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  selectedTick: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0B67D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upiInputRow: {
    marginBottom: 16,
  },
  upiInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  testCardFillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fillTestCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(11, 103, 212, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0B67D4',
  },
  fillTestCardText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  cardInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontSize: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 10,
  },
  banksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  bankCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  bankCardActive: {
    borderColor: '#0B67D4',
    backgroundColor: 'rgba(11, 103, 212, 0.15)',
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  bankRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankRadioActive: {
    backgroundColor: '#0B67D4',
    borderColor: '#0B67D4',
  },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 8,
  },
  walletCardActive: {
    borderColor: '#0B67D4',
    backgroundColor: 'rgba(11, 103, 212, 0.15)',
  },
  walletName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  walletBalance: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  payNowBtn: {
    backgroundColor: '#0B67D4',
    borderRadius: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#0B67D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payNowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  processingContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  processingStepText: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  secureNoticeText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '700',
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  successSub: {
    color: '#94A3B8',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  otpContainer: {
    padding: spacing.screenPadding,
    paddingVertical: 24,
  },
  otpCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(11, 103, 212, 0.3)',
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  otpHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  otpPrompt: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 12,
  },
  otpInput: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0B67D4',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    paddingVertical: 10,
    marginBottom: 14,
  },
  otpSubmitBtn: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  otpSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  otpCancelBtn: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderRadius: 8,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpCancelText: {
    color: '#F43F5E',
    fontSize: 11,
    fontWeight: '700',
  },
  footerSecurity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  footerSecurityText: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '600',
  },
});

export default RazorpayModal;
