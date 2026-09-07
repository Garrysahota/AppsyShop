import React, { useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Info, Ruler, Sparkles, X } from 'lucide-react-native';
import { createMMKV } from 'react-native-mmkv';
import { colors, spacing, typography } from '@theme';

const storage = createMMKV({ id: 'appsyshop-preferences' });
export const SIZE_PREF_KEY = 'user_sneaker_size_pref';
export const GENDER_PREF_KEY = 'user_sneaker_gender_pref';

export interface SizePreference {
  ukSize: number;
  usEquivalent: number;
  euEquivalent: number;
  cmEquivalent: number;
  gender: 'Men' | 'Women' | 'Unisex';
}

const UK_SIZES: { uk: number; usMen: number; eu: number; cm: number }[] = [
  { uk: 6, usMen: 6.5, eu: 39, cm: 24.5 },
  { uk: 6.5, usMen: 7, eu: 40, cm: 25.0 },
  { uk: 7, usMen: 7.5, eu: 40.5, cm: 25.5 },
  { uk: 7.5, usMen: 8, eu: 41, cm: 26.0 },
  { uk: 8, usMen: 8.5, eu: 42, cm: 26.5 },
  { uk: 8.5, usMen: 9, eu: 42.5, cm: 27.0 },
  { uk: 9, usMen: 9.5, eu: 43, cm: 27.5 },
  { uk: 9.5, usMen: 10, eu: 44, cm: 28.0 },
  { uk: 10, usMen: 10.5, eu: 44.5, cm: 28.5 },
  { uk: 10.5, usMen: 11, eu: 45, cm: 29.0 },
  { uk: 11, usMen: 11.5, eu: 46, cm: 29.5 },
  { uk: 12, usMen: 12.5, eu: 47, cm: 30.5 },
];

interface SizePreferenceModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (pref: SizePreference) => void;
}

export const SizePreferenceModal: React.FC<SizePreferenceModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const insets = useSafeAreaInsets();

  const [selectedUk, setSelectedUk] = useState<number>(8.5);
  const [selectedGender, setSelectedGender] = useState<'Men' | 'Women' | 'Unisex'>('Men');

  useEffect(() => {
    const savedUk = storage.getNumber(SIZE_PREF_KEY);
    const savedGender = storage.getString(GENDER_PREF_KEY) as any;
    if (savedUk) setSelectedUk(savedUk);
    if (savedGender) setSelectedGender(savedGender);
  }, [visible]);

  const activeSizeObj = UK_SIZES.find(s => s.uk === selectedUk) || UK_SIZES[5];

  const handleSave = () => {
    storage.set(SIZE_PREF_KEY, selectedUk);
    storage.set(GENDER_PREF_KEY, selectedGender);

    const pref: SizePreference = {
      ukSize: selectedUk,
      usEquivalent: activeSizeObj.usMen,
      euEquivalent: activeSizeObj.eu,
      cmEquivalent: activeSizeObj.cm,
      gender: selectedGender,
    };

    onSave?.(pref);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View
          style={[
            styles.sheetContainer,
            { paddingBottom: Math.max(insets.bottom, 16) + spacing.sm },
          ]}>
          {}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ruler size={18} color={colors.accent} />
              <Text style={styles.headerTitle}>Size Preference (India / UK)</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={18} color={colors.textOnDark} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            
            {}
            <View style={styles.indiaStandardNotice}>
              <Sparkles size={16} color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text style={styles.indiaStandardTitle}>Indian Sneaker Sizing (UK / IND Standard)</Text>
                <Text style={styles.indiaStandardSub}>
                  India officially uses UK shoe sizing. When you select your UK size, we'll automatically filter live drops in your exact fit.
                </Text>
              </View>
            </View>

            {/* Gender Toggle */}
            <Text style={styles.sectionHeading}>FIT CATEGORY</Text>
            <View style={styles.genderRow}>
              {(['Men', 'Women', 'Unisex'] as const).map(g => {
                const isSelected = selectedGender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    activeOpacity={0.8}
                    onPress={() => setSelectedGender(g)}
                    style={[styles.genderChip, isSelected && styles.genderChipActive]}>
                    <Text
                      style={[
                        styles.genderChipText,
                        isSelected && styles.genderChipTextActive,
                      ]}>
                      {g}'s Sizing
                    </Text>
                    {isSelected && <Check size={12} color={colors.textOnDark} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {}
            <Text style={styles.sectionHeading}>SELECT YOUR UK / INDIA SHOE SIZE</Text>
            <View style={styles.sizeGrid}>
              {UK_SIZES.map(item => {
                const isSelected = selectedUk === item.uk;
                return (
                  <TouchableOpacity
                    key={item.uk}
                    activeOpacity={0.8}
                    onPress={() => setSelectedUk(item.uk)}
                    style={[styles.sizeCard, isSelected && styles.sizeCardActive]}>
                    <Text
                      style={[
                        styles.sizeNumberText,
                        isSelected && styles.sizeNumberTextActive,
                      ]}>
                      UK {item.uk}
                    </Text>
                    <Text
                      style={[
                        styles.sizeEquivText,
                        isSelected && styles.sizeEquivTextActive,
                      ]}>
                      US {item.usMen} · EU {item.eu}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Your Preferred Fit: UK {selectedUk} ({selectedGender})</Text>
              <View style={styles.conversionRow}>
                <View style={styles.conversionItem}>
                  <Text style={styles.convLabel}>UK / INDIA</Text>
                  <Text style={styles.convValue}>UK {activeSizeObj.uk}</Text>
                </View>
                <View style={styles.convDivider} />
                <View style={styles.conversionItem}>
                  <Text style={styles.convLabel}>US MEN</Text>
                  <Text style={styles.convValue}>US {activeSizeObj.usMen}</Text>
                </View>
                <View style={styles.convDivider} />
                <View style={styles.conversionItem}>
                  <Text style={styles.convLabel}>EUROPE</Text>
                  <Text style={styles.convValue}>EU {activeSizeObj.eu}</Text>
                </View>
                <View style={styles.convDivider} />
                <View style={styles.conversionItem}>
                  <Text style={styles.convLabel}>FOOT LENGTH</Text>
                  <Text style={styles.convValue}>{activeSizeObj.cm} cm</Text>
                </View>
              </View>
            </View>

            {}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSave}
              style={styles.saveButtonContainer}>
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButton}>
                <Text style={styles.saveButtonText}>
                  Save UK {selectedUk} Preference ⚡
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
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
  sheetContainer: {
    backgroundColor: '#161026',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    maxHeight: '88%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.black,
    color: colors.textOnDark,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
  },
  indiaStandardNotice: {
    flexDirection: 'row',
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.35)',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  indiaStandardTitle: {
    color: colors.accent,
    fontSize: typography.fontSize.xs + 1,
    fontWeight: typography.fontWeight.bold,
    marginBottom: 2,
  },
  indiaStandardSub: {
    color: colors.textOnDarkMuted,
    fontSize: 11,
    lineHeight: 16,
  },
  sectionHeading: {
    color: colors.textOnDarkMuted,
    fontSize: 10,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: typography.letterSpacing.wider,
    marginBottom: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing.lg,
  },
  genderChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    gap: 6,
  },
  genderChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryGradientEnd,
  },
  genderChipText: {
    color: colors.textOnDarkMuted,
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
  },
  genderChipTextActive: {
    color: colors.textOnDark,
    fontWeight: typography.fontWeight.black,
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.lg,
  },
  sizeCard: {
    width: '31%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeCardActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  sizeNumberText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm + 1,
    fontWeight: typography.fontWeight.black,
  },
  sizeNumberTextActive: {
    color: '#000000',
  },
  sizeEquivText: {
    color: colors.textOnDarkMuted,
    fontSize: 9,
    marginTop: 2,
    fontWeight: '600',
  },
  sizeEquivTextActive: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: 12,
  },
  conversionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  conversionItem: {
    alignItems: 'center',
  },
  convLabel: {
    color: colors.textOnDarkMuted,
    fontSize: 8,
    fontWeight: typography.fontWeight.bold,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  convValue: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: typography.fontWeight.black,
  },
  convDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  saveButtonContainer: {
    borderRadius: spacing.cardRadius - 2,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  saveButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.textOnDark,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.extraBold,
    letterSpacing: 0.3,
  },
});

export default SizePreferenceModal;
