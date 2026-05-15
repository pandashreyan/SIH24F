import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import API from '../utils/api';
import { useNavigation } from '@react-navigation/native';

const SAMPLE_TEXTS = [
  'The rights provided in the Constitution are very important for citizens.',
  'The government has failed to protect the rights of the people.',
  'The judiciary is doing its best to uphold constitutional values.',
];

const SentimentScreen = () => {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setError('Please enter some text to analyze.');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    setError('');
    setResponseData(null);

    try {
      const response = await axios.post(
        API.SENTIMENT, 
        { text: userInput },
        { timeout: 120000 }
      );
      setResponseData(response.data);
    } catch (err) {
      setError('Failed to analyze sentiment. Please ensure the AI service is running.');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentInfo = () => {
    if (!responseData) return null;
    const s = responseData.sentiment || 'Neutral';
    const mapping = {
      'Positive': { color: colors.success, icon: '😊', bg: colors.success + '15' },
      'Negative': { color: colors.error, icon: '😞', bg: colors.error + '15' },
      'Neutral': { color: colors.warning, icon: '😐', bg: colors.warning + '15' }
    };
    return mapping[s] || mapping['Neutral'];
  };


  const SENTIMENT_BARS = [
    { key: 'positive', label: 'Positive', color: colors.success, bg: colors.successLight, icon: '😊' },
    { key: 'neutral', label: 'Neutral', color: colors.warning, bg: colors.warningLight, icon: '😐' },
    { key: 'negative', label: 'Negative', color: colors.error, bg: colors.errorLight, icon: '😞' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <LinearGradient
        colors={['#4A148C', '#6A1B9A']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sentiment Analysis</Text>
        <Text style={styles.headerSubtitle}>Understand the emotional tone of text</Text>
      </LinearGradient>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Input Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Enter Text</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Type or paste any text here..."
                placeholderTextColor={colors.textLight}
                value={userInput}
                onChangeText={setUserInput}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={1000}
              />
              <Text style={styles.charCount}>{userInput.length}/1000</Text>

              {/* Sample Texts */}
              <Text style={styles.sampleLabel}>Try a sample:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {SAMPLE_TEXTS.map((sample, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.sampleChip}
                    onPress={() => setUserInput(sample)}
                  >
                    <Text style={styles.sampleChipText} numberOfLines={1}>
                      {sample.substring(0, 35)}...
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.analyzeButton}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={loading ? ['#9E9E9E', '#9E9E9E'] : ['#4A148C', '#7B1FA2']}
                  style={styles.analyzeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.white} size="small" />
                  ) : (
                    <>
                      <Ionicons name="analytics-outline" size={18} color={colors.white} />
                      <Text style={styles.analyzeText}>Analyze Sentiment</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Error */}
            {!!error && (
              <View style={styles.errorCard}>
                <Ionicons name="alert-circle-outline" size={20} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Results */}
            {responseData && (
              <View style={styles.card}>
                <Text style={styles.cardLabel}>AI Analysis Results</Text>

                {/* Dominant Sentiment */}
                <View
                  style={[
                    styles.dominantCard,
                    { backgroundColor: getSentimentInfo().bg },
                  ]}
                >
                  <Text style={styles.dominantEmoji}>{getSentimentInfo().icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.dominantLabel, { color: getSentimentInfo().color }]}>
                      {responseData.sentiment} Tone
                    </Text>
                    <Text style={styles.dominantValue}>
                      Confidence Score: {(responseData.score * 100).toFixed(0)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryLabel}>AI Summary:</Text>
                  <Text style={styles.summaryText}>{responseData.summary}</Text>
                </View>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SentimentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  headerTitle: {
    fontSize: 26,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
  },
  body: {
    flex: 1,
    marginTop: -20,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontFamily: fonts.SemiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  textArea: {
    borderWidth: 1.5,
    borderColor: colors.gray,
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 6,
  },
  charCount: {
    fontSize: 11,
    fontFamily: fonts.Regular,
    color: colors.textLight,
    textAlign: 'right',
    marginBottom: 12,
  },
  sampleLabel: {
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  sampleChip: {
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.gray,
    marginRight: 8,
    marginBottom: 16,
    maxWidth: 200,
  },
  sampleChipText: {
    fontSize: 11,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  analyzeButton: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
  },
  analyzeGradient: {
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    marginLeft: 6,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: colors.error,
  },
  dominantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  dominantEmoji: {
    fontSize: 36,
  },
  dominantLabel: {
    fontSize: 17,
    fontFamily: fonts.SemiBold,
  },
  dominantValue: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  barIcon: {
    fontSize: 18,
    width: 26,
  },
  barLabelCol: {
    width: 70,
  },
  barLabel: {
    fontSize: 13,
    fontFamily: fonts.Medium,
    color: colors.textPrimary,
  },
  barTrack: {
    flex: 1,
    height: 10,
    backgroundColor: colors.gray,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    borderRadius: 5,
  },
  barPercent: {
    fontSize: 13,
    fontFamily: fonts.Bold,
    width: 48,
    textAlign: 'right',
  },
  summaryContainer: {
    backgroundColor: colors.background,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  summaryText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
