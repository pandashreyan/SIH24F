import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import API from '../utils/api';

const SCENARIOS = [
  {
    id: '1',
    title: 'Police Encounter',
    subtitle: 'Know your rights during a stop & search',
    icon: 'shield-half-outline',
    gradient: ['#1e3c72', '#2a5298'],
    article: 'Article 20 & 22',
  },
  {
    id: '2',
    title: 'Fair Access',
    subtitle: 'Denied entry to a public place?',
    icon: 'business-outline',
    gradient: ['#00b09b', '#96c93d'],
    article: 'Article 15',
  },
  {
    id: '3',
    title: 'Social Media Freedom',
    subtitle: 'What can you legally post online?',
    icon: 'share-social-outline',
    gradient: ['#8e2de2', '#4a00e0'],
    article: 'Article 19',
  },
  {
    id: '4',
    title: 'Workplace Equality',
    subtitle: 'Facing discrimination at the office?',
    icon: 'people-outline',
    gradient: ['#f85032', '#e73827'],
    article: 'Article 14 & 16',
  }
];

const FightForRights = ({ navigation, route }) => {
  const { lang = 'English' } = route.params || {};
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');

  const handleDraft = async () => {
    setLoading(true);
    try {
      const res = await axios.post(API.GENERATE_DRAFT, {
        scenario: selectedScenario.title,
        lang: lang
      }, { timeout: 120000 });
      setDraft(res.data.draft || 'Draft could not be generated. Please try again.');
    } catch (err) {
      console.error(err);
      setDraft('Connection Error: AI is busy. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const startScenario = async (scenario) => {
    setSelectedScenario(scenario);
    setLoading(true);
    try {
      const res = await axios.post(API.STORY_NEXT, {
        caseTitle: `Daily Life: ${scenario.title}`,
        currentStep: 0,
        history: [],
        userChoice: '',
        lang: lang
      }, { timeout: 120000 });
      setResponses([res.data.response]);
      setStep(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (choice) => {
    setLoading(true);
    try {
      const res = await axios.post(API.STORY_NEXT, {
        caseTitle: `Daily Life: ${selectedScenario.title}`,
        currentStep: step,
        history: responses,
        userChoice: choice,
        lang: lang
      }, { timeout: 120000 });
      setResponses([...responses, res.data.response]);
      setStep(step + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedScenario) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={selectedScenario.gradient} style={styles.storyHeader}>
          <TouchableOpacity onPress={() => setSelectedScenario(null)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedScenario.title}</Text>
          <View style={styles.articleBadge}>
            <Text style={styles.articleText}>{selectedScenario.article}</Text>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.storyContent}>
          {responses.map((r, i) => (
            <View key={i} style={styles.msgCard}>
              <Text style={styles.msgText}>{r}</Text>
            </View>
          ))}
          
          {draft !== '' && (
            <View style={styles.draftCard}>
              <View style={styles.draftHeader}>
                <Ionicons name="document-text" size={20} color={colors.primary} />
                <Text style={styles.draftTitle}>Official Draft Template</Text>
              </View>
              <Text style={styles.draftText}>{draft}</Text>
              <Text style={styles.draftFooter}>Note: Use this as a formal template for RTI or Complaints.</Text>
            </View>
          )}

          {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />}
        </ScrollView>

        {step >= 4 && draft === '' && !loading && (
          <TouchableOpacity style={styles.draftBtn} onPress={handleDraft}>
            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.draftGradient}>
              <Ionicons name="sparkles" size={20} color="#fff" />
              <Text style={styles.draftBtnText}>Generate Legal Draft / RTI</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {step < 4 && !loading && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: colors.success}]} onPress={() => handleNext('I know my rights')}>
              <Text style={styles.btnText}>Take Action</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: colors.error}]} onPress={() => handleNext('Ask for reason')}>
              <Text style={styles.btnText}>Question It</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#0f2027', '#203a43']} style={styles.mainHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.mainTitle}>Fight for Your Rights 🛡️</Text>
        <Text style={styles.mainSubtitle}>Master the Articles that protect you daily</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.grid}>
        {SCENARIOS.map(s => (
          <TouchableOpacity key={s.id} style={styles.card} onPress={() => startScenario(s)}>
            <LinearGradient colors={s.gradient} style={styles.cardGradient}>
              <Ionicons name={s.icon} size={32} color="#fff" />
              <Text style={styles.cardTitle}>{s.title}</Text>
              <Text style={styles.cardSubtitle}>{s.subtitle}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.articleLabel}>{s.article}</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FightForRights;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  mainHeader: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  backBtn: { marginBottom: 15 },
  mainTitle: { fontSize: 24, fontFamily: fonts.Bold, color: '#fff' },
  mainSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: fonts.Regular },
  grid: { padding: 20 },
  card: { borderRadius: 20, overflow: 'hidden', marginBottom: 15, elevation: 5 },
  cardGradient: { padding: 20 },
  cardTitle: { fontSize: 18, fontFamily: fonts.Bold, color: '#fff', marginTop: 10 },
  cardSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  articleLabel: { fontSize: 11, fontFamily: fonts.Bold, color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  storyHeader: { padding: 20, paddingTop: 50, flexDirection: 'row', alignItems: 'center', gap: 15 },
  headerTitle: { fontSize: 18, fontFamily: fonts.Bold, color: '#fff', flex: 1 },
  articleBadge: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  articleText: { fontSize: 11, fontFamily: fonts.Bold, color: colors.primary },
  storyContent: { padding: 20 },
  msgCard: { backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, elevation: 2 },
  msgText: { fontSize: 14, fontFamily: fonts.Regular, color: colors.textPrimary, lineHeight: 22 },
  actionRow: { flexDirection: 'row', padding: 20, gap: 15, backgroundColor: '#fff' },
  actionBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontFamily: fonts.Bold, fontSize: 14 },
  draftBtn: { margin: 20, borderRadius: 15, overflow: 'hidden' },
  draftGradient: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  draftBtnText: { color: '#fff', fontFamily: fonts.Bold, fontSize: 15 },
  draftCard: { backgroundColor: '#F0F4F8', borderRadius: 15, padding: 20, borderLeftWidth: 5, borderLeftColor: colors.primary, marginTop: 10 },
  draftHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  draftTitle: { fontSize: 16, fontFamily: fonts.Bold, color: colors.primary },
  draftText: { fontSize: 13, fontFamily: fonts.Regular, color: colors.textPrimary, lineHeight: 20, backgroundColor: '#fff', padding: 15, borderRadius: 10 },
  draftFooter: { fontSize: 11, fontFamily: fonts.Italic, color: colors.textSecondary, marginTop: 10, textAlign: 'center' },
});
