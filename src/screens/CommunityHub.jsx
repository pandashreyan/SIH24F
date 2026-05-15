import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import API from '../utils/api';

const { width } = Dimensions.get('window');

const HOT_TOPICS = [
  {
    id: '1',
    title: 'Digital Privacy Act',
    desc: 'New laws regarding data collection and citizen privacy rights.',
    pulse: { supportive: 65, critical: 25, neutral: 10 },
    color: ['#FF6B6B', '#FF8E53']
  },
  {
    id: '2',
    title: 'Environmental Protection',
    desc: 'Supreme Court ruling on mining in protected forest areas.',
    pulse: { supportive: 40, critical: 50, neutral: 10 },
    color: ['#4ECDC4', '#556270']
  },
  {
    id: '3',
    title: 'Women\'s Workforce Rights',
    desc: 'Mandatory maternity benefits and workplace safety standards.',
    pulse: { supportive: 85, critical: 5, neutral: 10 },
    color: ['#6A11CB', '#2575FC']
  }
];

const CommunityHub = ({ navigation }) => {
  const [selectedTopic, setSelectedTopic] = useState(HOT_TOPICS[0]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
    { id: '1', user: 'Rahul S.', text: 'This is essential for the 21st century!', sentiment: 'Supportive' },
    { id: '2', user: 'Priya K.', text: 'Too many loopholes in the enforcement.', sentiment: 'Critical' },
  ]);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(API.SENTIMENT, { text: comment }, { timeout: 120000 });
      const newComment = {
        id: Date.now().toString(),
        user: 'You',
        text: comment,
        sentiment: response.data.sentiment
      };
      setComments([newComment, ...comments]);
      setComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1a2a6c', '#b21f1f']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community Pulse 🏛️</Text>
        <Text style={styles.headerSubtitle}>Real-time citizen views on legal matters</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hot Topics Carousel */}
        <Text style={styles.sectionTitle}>Controversial Rulings</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carousel}>
          {HOT_TOPICS.map(topic => (
            <TouchableOpacity 
              key={topic.id} 
              onPress={() => setSelectedTopic(topic)}
              activeOpacity={0.9}
            >
              <LinearGradient 
                colors={topic.color} 
                style={[styles.topicCard, selectedTopic.id === topic.id && styles.selectedCard]}
              >
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDesc} numberOfLines={2}>{topic.desc}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Pulse Gauge */}
        <View style={styles.pulseCard}>
          <Text style={styles.cardLabel}>Public Opinion for "{selectedTopic.title}"</Text>
          <View style={styles.gaugeContainer}>
            <View style={[styles.gaugeSegment, { flex: selectedTopic.pulse.supportive, backgroundColor: colors.success }]}>
              <Text style={styles.gaugeText}>{selectedTopic.pulse.supportive}%</Text>
            </View>
            <View style={[styles.gaugeSegment, { flex: selectedTopic.pulse.neutral, backgroundColor: colors.warning }]}>
              <Text style={styles.gaugeText}>{selectedTopic.pulse.neutral}%</Text>
            </View>
            <View style={[styles.gaugeSegment, { flex: selectedTopic.pulse.critical, backgroundColor: colors.error }]}>
              <Text style={styles.gaugeText}>{selectedTopic.pulse.critical}%</Text>
            </View>
          </View>
          <View style={styles.gaugeLegend}>
            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: colors.success}]}/><Text style={styles.legendText}>Support</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: colors.warning}]}/><Text style={styles.legendText}>Neutral</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: colors.error}]}/><Text style={styles.legendText}>Critic</Text></View>
          </View>
        </View>

        {/* Comment Box */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="Share your opinion on this ruling..."
            placeholderTextColor={colors.textLight}
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <TouchableOpacity 
            style={styles.postBtn} 
            onPress={handlePost}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.postBtnText}>Post Reaction</Text>}
          </TouchableOpacity>
        </View>

        {/* Comments Feed */}
        <Text style={styles.sectionTitle}>Recent Reactions</Text>
        {comments.map(c => (
          <View key={c.id} style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <Text style={styles.userName}>{c.user}</Text>
              <View style={[styles.badge, { backgroundColor: c.sentiment === 'Supportive' ? colors.success + '20' : colors.error + '20' }]}>
                <Text style={[styles.badgeText, { color: c.sentiment === 'Supportive' ? colors.success : colors.error }]}>{c.sentiment}</Text>
              </View>
            </View>
            <Text style={styles.commentText}>{c.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CommunityHub;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 50, paddingBottom: 25, paddingHorizontal: 20 },
  backBtn: { marginBottom: 15 },
  headerTitle: { fontSize: 26, fontFamily: fonts.Bold, color: colors.white },
  headerSubtitle: { fontSize: 13, fontFamily: fonts.Regular, color: 'rgba(255,255,255,0.7)' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 18, fontFamily: fonts.Bold, color: colors.textPrimary, marginBottom: 15, marginTop: 10 },
  carousel: { marginBottom: 20 },
  topicCard: { width: width * 0.7, padding: 20, borderRadius: 20, marginRight: 15, height: 130 },
  selectedCard: { borderWidth: 3, borderColor: '#fff' },
  topicTitle: { fontSize: 18, fontFamily: fonts.Bold, color: colors.white, marginBottom: 8 },
  topicDesc: { fontSize: 12, fontFamily: fonts.Regular, color: 'rgba(255,255,255,0.8)', lineHeight: 18 },
  pulseCard: { backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 20, elevation: 4 },
  cardLabel: { fontSize: 12, fontFamily: fonts.SemiBold, color: colors.textSecondary, marginBottom: 15, textTransform: 'uppercase' },
  gaugeContainer: { height: 45, borderRadius: 10, overflow: 'hidden', flexDirection: 'row' },
  gaugeSegment: { justifyContent: 'center', alignItems: 'center' },
  gaugeText: { color: colors.white, fontSize: 12, fontFamily: fonts.Bold },
  gaugeLegend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, fontFamily: fonts.Medium, color: colors.textSecondary },
  inputCard: { backgroundColor: colors.white, borderRadius: 20, padding: 20, marginBottom: 20, elevation: 2 },
  input: { backgroundColor: colors.background, borderRadius: 15, padding: 15, minHeight: 80, textAlignVertical: 'top', fontSize: 14, fontFamily: fonts.Regular, color: colors.textPrimary },
  postBtn: { backgroundColor: '#1a2a6c', borderRadius: 15, padding: 15, alignItems: 'center', marginTop: 15 },
  postBtnText: { color: colors.white, fontFamily: fonts.Bold, fontSize: 15 },
  commentCard: { backgroundColor: colors.white, borderRadius: 15, padding: 15, marginBottom: 10 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  userName: { fontSize: 14, fontFamily: fonts.Bold, color: colors.textPrimary },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontFamily: fonts.Bold },
  commentText: { fontSize: 13, fontFamily: fonts.Regular, color: colors.textSecondary, lineHeight: 20 }
});
