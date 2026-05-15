import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import API from '../utils/api';
import { useNavigation } from '@react-navigation/native';

// Landmark Indian constitutional cases
const CASES = [
  {
    id: 1,
    title: 'Ramana Dayaram Shetty vs International Airport Authority',
    year: '1979',
    theme: 'State Action & Fundamental Rights',
    description: 'A landmark case that defined what constitutes "State" under Article 12, expanding the scope of fundamental rights.',
    predefined: `Consider the case *Ramana Dayaram Shetty vs The International Airport Authority of India* decided on May 4, 1979. Reconstruct the case in a detailed, step-by-step narrative. For each significant part: 1. Present proceedings clearly and engagingly. 2. Ask an analytical or opinion-based question (Agree/Disagree, analytical opinion, or predictive). 3. Keep it interactive. 4. Do not wait for answers—proceed directly after each question. End with "?" symbol. 5. Conclude with a summary, key points, and the actual verdict.`,
    gradient: ['#1a237e', '#283593'],
    icon: '⚖️',
  },
  {
    id: 2,
    title: 'Kesavananda Bharati vs State of Kerala',
    year: '1973',
    theme: 'Basic Structure Doctrine',
    description: 'The most significant constitutional case ever decided—establishing that Parliament cannot alter the basic structure of the Constitution.',
    predefined: `Consider the case *Kesavananda Bharati vs State of Kerala* decided in 1973. Reconstruct the case in a detailed, step-by-step narrative. For each significant part: 1. Present proceedings clearly and engagingly. 2. Ask an analytical or opinion-based question. 3. Keep it interactive. 4. Do not wait for answers. End questions with "?" symbol. 5. Conclude with a summary, key points, and the actual verdict.`,
    gradient: ['#BF360C', '#D84315'],
    icon: '📜',
  },
  {
    id: 3,
    title: 'Maneka Gandhi vs Union of India',
    year: '1978',
    theme: 'Article 21 – Right to Life',
    description: 'Expanded the scope of Article 21 to include a procedure that is fair, just, and reasonable—not just any procedure established by law.',
    predefined: `Consider the case *Maneka Gandhi vs Union of India* decided in 1978. Reconstruct the case in a detailed, step-by-step narrative. For each significant part: 1. Present proceedings clearly and engagingly. 2. Ask an analytical or opinion-based question. 3. Keep it interactive. 4. Do not wait for answers. End questions with "?" symbol. 5. Conclude with a summary, key points, and the actual verdict.`,
    gradient: ['#1B5E20', '#2E7D32'],
    icon: '🏛️',
  },
];

const FightCase = ({ navigation, route }) => {
  const { lang = 'English' } = route.params || {};
  const [selectedCase, setSelectedCase] = useState(null);
  const [responses, setResponses] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userChoice, setUserChoice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartCase = async (caseItem) => {
    setSelectedCase(caseItem);
    setLoading(true);
    setErrorMsg('');
    setResponses([]);
    setCurrentIndex(0);
    setFinished(false);
    setUserChoice(null);

    try {
      console.log('Starting case with URL:', API.STORY_NEXT);
      const response = await axios.post(
        API.STORY_NEXT,
        {
          caseTitle: caseItem.title,
          currentStep: 0,
          history: [],
          userChoice: '',
          lang: lang
        },
        { timeout: 120000 }
      );
      
      if (response.data.response) {
        setResponses([response.data.response]);
      } else {
        setErrorMsg('The AI storyteller is silent. Please try again.');
      }
    } catch (error) {
      console.error('STORY ERROR:', error);
      setErrorMsg(`Connection Error: ${error.message}. Ensure Flask is running.`);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choice) => {
    if (loading) return;
    setUserChoice(choice);
    
    // Check if we reached the final step (usually 4 steps total)
    if (currentIndex >= 3) {
      setFinished(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        API.STORY_NEXT,
        {
          caseTitle: selectedCase.title,
          currentStep: currentIndex + 1,
          history: responses,
          userChoice: choice,
          lang: lang
        },
        { timeout: 120000 }
      );

      if (response.data.response) {
        setResponses(prev => [...prev, response.data.response]);
        setCurrentIndex(prev => prev + 1);
        setUserChoice(null);
      }
    } catch (error) {
      setErrorMsg('The story was interrupted. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleReset = () => {
    setSelectedCase(null);
    setResponses([]);
    setCurrentIndex(0);
    setFinished(false);
    setUserChoice(null);
    setErrorMsg('');
  };

  // Case Selection View
  if (!selectedCase && !loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
        <LinearGradient
          colors={['#1a237e', '#0d0d2b']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Interactive Storytelling</Text>
          <Text style={styles.headerSubtitle}>
            Explore landmark Indian constitutional cases through interactive narratives
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.caseList}
          contentContainerStyle={styles.caseListContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.selectLabel}>Choose a Case</Text>
          {CASES.map(caseItem => (
            <TouchableOpacity
              key={caseItem.id}
              style={styles.caseCard}
              onPress={() => handleStartCase(caseItem)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={caseItem.gradient}
                style={styles.caseGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.caseIconRow}>
                  <Text style={styles.caseEmoji}>{caseItem.icon}</Text>
                  <View style={styles.yearBadge}>
                    <Text style={styles.yearText}>{caseItem.year}</Text>
                  </View>
                </View>
                <Text style={styles.caseTitle}>{caseItem.title}</Text>
                <Text style={styles.caseTheme}>{caseItem.theme}</Text>
                <Text style={styles.caseDescription}>{caseItem.description}</Text>
                <View style={styles.startRow}>
                  <Text style={styles.startLabel}>Start Case</Text>
                  <Ionicons name="arrow-forward-circle" size={22} color="rgba(255,255,255,0.8)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Loading View
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingTitle}>Preparing Case...</Text>
          <Text style={styles.loadingSubtitle}>
            Our AI is analyzing {selectedCase?.title}.{'\n'}This may take up to 60 seconds.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error View
  if (errorMsg) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <View style={styles.errorCard}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReset}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Finished View
  if (finished) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <LinearGradient
          colors={colors.gradientPrimary}
          style={styles.finishedCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.finishedEmoji}>🏆</Text>
          <Text style={styles.finishedTitle}>Case Complete!</Text>
          <Text style={styles.finishedSubtitle}>
            You have explored: {selectedCase?.title}
          </Text>
          <Text style={styles.finishedDesc}>
            Great job engaging with this landmark case! You've learned how the courts interpret constitutional principles.
          </Text>
          <TouchableOpacity style={styles.playAgainButton} onPress={handleReset}>
            <Text style={styles.playAgainText}>Explore Another Case →</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Story View
  const progress = ((currentIndex + 1) / 4) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Story Header */}
      <LinearGradient
        colors={selectedCase?.gradient || colors.gradientPrimary}
        style={styles.storyHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={handleReset}>
          <Ionicons name="close" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.storyTitle} numberOfLines={1}>{selectedCase?.title}</Text>
        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Part {currentIndex + 1} of 4
        </Text>
      </LinearGradient>

      {/* Story Content */}
      <ScrollView
        style={styles.storyBody}
        contentContainerStyle={styles.storyContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.storyCard}>
          <Text style={styles.storyText}>{responses[currentIndex]}</Text>
        </View>
      </ScrollView>

      {/* Choice Buttons */}
      <View style={styles.choiceContainer}>
        <Text style={styles.choicePrompt}>What's your view?</Text>
        <View style={styles.choiceRow}>
          <TouchableOpacity
            style={[
              styles.choiceButton,
              styles.agreeButton,
              userChoice === 'agree' && styles.choiceSelected,
            ]}
            onPress={() => handleChoice('agree')}
            activeOpacity={0.85}
          >
            <Text style={styles.choiceEmoji}>👍</Text>
            <Text style={styles.choiceText}>I Agree</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.choiceButton,
              styles.disagreeButton,
              userChoice === 'disagree' && styles.choiceSelected,
            ]}
            onPress={() => handleChoice('disagree')}
            activeOpacity={0.85}
          >
            <Text style={styles.choiceEmoji}>👎</Text>
            <Text style={styles.choiceText}>I Disagree</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={() => handleChoice('skip')}>
          <Text style={styles.skipText}>Skip →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FightCase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 28,
    paddingHorizontal: 24,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: fonts.Bold,
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  customCard: {
    backgroundColor: '#6A11CB',
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  customTitle: {
    fontSize: 22,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 6,
  },
  customSubtitle: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 20,
  },
  searchWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    fontFamily: fonts.Medium,
    color: colors.textPrimary,
  },
  generateBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FF8E53',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
  },
  caseList: {
    flex: 1,
  },
  caseListContent: {
    padding: 20,
    paddingBottom: 30,
  },
  selectLabel: {
    fontSize: 13,
    fontFamily: fonts.SemiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  caseCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  caseGradient: {
    padding: 20,
  },
  caseIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caseEmoji: {
    fontSize: 32,
  },
  yearBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  yearText: {
    fontSize: 13,
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  caseTitle: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 4,
    lineHeight: 22,
  },
  caseTheme: {
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  caseDescription: {
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    marginBottom: 16,
  },
  startRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
  },
  startLabel: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  // Loading
  loadingCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    elevation: 4,
    width: '100%',
  },
  loadingTitle: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  loadingSubtitle: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  // Error
  errorCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    elevation: 4,
    width: '100%',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    color: colors.error,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryText: {
    color: colors.white,
    fontFamily: fonts.SemiBold,
    fontSize: 15,
  },
  // Finished
  finishedCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  finishedEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  finishedTitle: {
    fontSize: 26,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 10,
  },
  finishedSubtitle: {
    fontSize: 14,
    fontFamily: fonts.SemiBold,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 14,
  },
  finishedDesc: {
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  playAgainButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  playAgainText: {
    color: colors.white,
    fontFamily: fonts.SemiBold,
    fontSize: 15,
  },
  // Story View
  storyHeader: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  storyTitle: {
    fontSize: 15,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginBottom: 12,
  },
  progressBarWrapper: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.accentLight,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
  },
  storyBody: {
    flex: 1,
  },
  storyContent: {
    padding: 20,
  },
  storyCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 22,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  storyText: {
    fontSize: 15,
    fontFamily: fonts.Regular,
    color: colors.textPrimary,
    lineHeight: 26,
  },
  choiceContainer: {
    padding: 20,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  choicePrompt: {
    fontSize: 13,
    fontFamily: fonts.SemiBold,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  choiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  agreeButton: {
    backgroundColor: colors.success,
    shadowColor: colors.success,
  },
  disagreeButton: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
  },
  choiceSelected: {
    opacity: 0.6,
  },
  choiceEmoji: {
    fontSize: 18,
  },
  choiceText: {
    fontSize: 15,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
  },
});
