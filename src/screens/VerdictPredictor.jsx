import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import API from '../utils/api';

const VerdictPredictor = ({ navigation, route }) => {
  const { lang = 'English' } = route.params || {};
  const [scenario, setScenario] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(API.VERDICT_PREDICT, {
        scenario: scenario,
        lang: lang
      }, { timeout: 120000 });
      setResult(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#141E30', '#243B55']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Verdict Predictor 🔮</Text>
        <Text style={styles.headerSubtitle}>Legal outcome probability analysis</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputCard}>
          <Text style={styles.label}>Describe your situation:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. My employer is not paying me for overtime work..."
            placeholderTextColor={colors.textLight}
            value={scenario}
            onChangeText={setScenario}
            multiline
            numberOfLines={5}
          />
          <TouchableOpacity 
            style={styles.predictBtn} 
            onPress={handlePredict}
            disabled={loading}
          >
            <LinearGradient colors={['#FF512F', '#DD2476']} style={styles.btnGradient}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Predict Outcome</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultArea}>
            {/* Probability Gauge Mockup */}
            <View style={styles.gaugeCard}>
              <View style={styles.gaugeRow}>
                <View style={styles.gaugeMain}>
                  <Text style={styles.gaugeValue}>{result.probability}%</Text>
                  <Text style={styles.gaugeLabel}>Success Probability</Text>
                </View>
                <View style={styles.verdictBox}>
                  <Text style={styles.verdictText}>{result.verdict}</Text>
                </View>
              </View>
            </View>

            {/* Shield & Sword */}
            <View style={styles.strategyRow}>
              <View style={[styles.strategyCard, {backgroundColor: '#E8F5E9'}]}>
                <Ionicons name="shield-checkmark" size={24} color="#2E7D32" />
                <Text style={styles.strategyTitle}>The Shield</Text>
                <Text style={styles.strategyText}>{result.shield}</Text>
              </View>
              <View style={[styles.strategyCard, {backgroundColor: '#FFEBEE'}]}>
                <Ionicons name="flash" size={24} color="#C62828" />
                <Text style={styles.strategyTitle}>The Sword</Text>
                <Text style={styles.strategyText}>{result.sword}</Text>
              </View>
            </View>

            {/* Judges Logic */}
            <View style={styles.logicCard}>
              <Text style={styles.logicTitle}>Mock Judge's Reasoning:</Text>
              <Text style={styles.logicText}>{result.logic}</Text>
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={() => setResult(null)}>
              <Text style={styles.resetText}>Try New Scenario</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerdictPredictor;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 40, paddingBottom: 25, paddingHorizontal: 20 },
  backBtn: { marginBottom: 15 },
  headerTitle: { fontSize: 22, fontFamily: fonts.Bold, color: '#fff' },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: fonts.Regular },
  scrollContent: { padding: 20 },
  inputCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 4 },
  label: { fontSize: 14, fontFamily: fonts.Bold, color: colors.textPrimary, marginBottom: 10 },
  input: { backgroundColor: colors.background, borderRadius: 15, padding: 15, fontSize: 14, fontFamily: fonts.Regular, textAlignVertical: 'top', minHeight: 120 },
  predictBtn: { marginTop: 20, borderRadius: 12, overflow: 'hidden' },
  btnGradient: { padding: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontFamily: fonts.Bold, fontSize: 16 },
  resultArea: { marginTop: 25 },
  gaugeCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, elevation: 2, marginBottom: 15 },
  gaugeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gaugeMain: { flex: 1 },
  gaugeValue: { fontSize: 32, fontFamily: fonts.Bold, color: '#DD2476' },
  gaugeLabel: { fontSize: 12, color: colors.textSecondary, fontFamily: fonts.Regular },
  verdictBox: { backgroundColor: '#E3F2FD', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  verdictText: { color: '#1976D2', fontFamily: fonts.Bold, fontSize: 14 },
  strategyRow: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  strategyCard: { flex: 1, padding: 15, borderRadius: 15, alignItems: 'center' },
  strategyTitle: { fontSize: 12, fontFamily: fonts.Bold, color: colors.textPrimary, marginVertical: 5 },
  strategyText: { fontSize: 11, fontFamily: fonts.Medium, color: colors.textSecondary, textAlign: 'center' },
  logicCard: { backgroundColor: '#FFF9C4', padding: 20, borderRadius: 20, borderLeftWidth: 5, borderLeftColor: '#FBC02D' },
  logicTitle: { fontSize: 14, fontFamily: fonts.Bold, color: colors.textPrimary, marginBottom: 5 },
  logicText: { fontSize: 13, fontFamily: fonts.Regular, color: colors.textSecondary, lineHeight: 20 },
  resetBtn: { marginTop: 25, alignItems: 'center' },
  resetText: { color: colors.primary, fontFamily: fonts.Bold, fontSize: 14 }
});
