import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';

import { getRunLogColors } from '@/constants/runlog-theme';
import { validateRunForm } from '@/utils/runValidation';

function getToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;
}

function Field({ label, value, onChangeText, error, colors, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.muted}
        selectionColor={colors.text}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? '#C74949' : colors.border,
            color: colors.text,
          },
        ]}
        {...inputProps}
      />
      {error ? (
        <Text accessibilityRole="alert" style={styles.fieldError}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

export default function RunForm({
  initialRun,
  onSubmit,
  onCancel,
  submitLabel,
}) {
  const colors = getRunLogColors(useColorScheme());
  const [values, setValues] = useState({
    date: initialRun?.date ?? getToday(),
    distanceKm: initialRun ? String(initialRun.distanceKm) : '',
    durationMinutes: initialRun ? String(initialRun.durationMinutes) : '',
    notes: initialRun?.notes ?? '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [saving, setSaving] = useState(false);

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  }

  async function handleSubmit() {
    const result = validateRunForm(values, initialRun?.id ?? createRunId());
    setErrors(result.errors);
    setSubmitError(null);
    if (!result.run) {
      return;
    }

    setSaving(true);
    try {
      await onSubmit(result.run);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'The run could not be saved. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={[styles.form, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Field
        label="Date"
        value={values.date}
        onChangeText={(value) => updateValue('date', value)}
        error={errors.date}
        colors={colors}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numbers-and-punctuation"
        accessibilityLabel="Run date"
      />

      <Field
        label="Distance (km)"
        value={values.distanceKm}
        onChangeText={(value) => updateValue('distanceKm', value)}
        error={errors.distanceKm}
        colors={colors}
        placeholder="e.g. 5.0"
        keyboardType="decimal-pad"
        accessibilityLabel="Distance in kilometres"
      />

      <Field
        label="Duration (minutes)"
        value={values.durationMinutes}
        onChangeText={(value) => updateValue('durationMinutes', value)}
        error={errors.durationMinutes}
        colors={colors}
        placeholder="e.g. 32"
        keyboardType="decimal-pad"
        accessibilityLabel="Duration in minutes"
      />

      <Field
        label="Notes (optional)"
        value={values.notes}
        onChangeText={(value) => updateValue('notes', value)}
        colors={colors}
        placeholder="How did it feel?"
        multiline
        textAlignVertical="top"
        accessibilityLabel="Run notes"
      />

      {submitError ? (
        <Text accessibilityRole="alert" style={styles.submitError}>
          {submitError}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={saving}
          onPress={onCancel}
          style={({ pressed }) => [
            styles.cancelButton,
            { backgroundColor: colors.surfaceMuted, opacity: pressed || saving ? 0.72 : 1 },
          ]}>
          <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: saving, busy: saving }}
          disabled={saving}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: colors.accent, opacity: pressed || saving ? 0.78 : 1 },
          ]}>
          {saving ? (
            <ActivityIndicator color={colors.accentText} />
          ) : (
            <Text style={[styles.submitText, { color: colors.accentText }]}>{submitLabel}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function createRunId() {
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const styles = StyleSheet.create({
  form: {
    padding: 20,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 17,
  },
  field: {
    gap: 7,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  input: {
    minHeight: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  fieldError: {
    color: '#C74949',
    fontSize: 12,
    lineHeight: 17,
  },
  submitError: {
    color: '#C74949',
    fontSize: 13,
    lineHeight: 19,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 3,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1.4,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
