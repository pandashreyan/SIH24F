import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const { width } = Dimensions.get('window');

const FEATURES = [
  {
    id: 'Fight',
    title: 'Interactive Storytelling',
    subtitle: 'Explore landmark legal cases',
    icon: 'library-outline',
    gradient: ['#1a237e', '#283593'],
    badge: 'HOT',
  },
  {
    id: 'FightForRights',
    title: 'Fight for Your Rights',
    subtitle: 'Constitutional protection in daily life',
    icon: 'shield-checkmark-outline',
    gradient: ['#0f2027', '#2c5364'],
    badge: 'DAILY',
  },
  {
    id: 'VerdictPredictor',
    title: 'Verdict Predictor',
    subtitle: 'AI analysis of legal outcome probability',
    icon: 'briefcase-outline',
    gradient: ['#141E30', '#243B55'],
    badge: 'PRO',
  },
  {
    id: 'Crossword',
    title: 'Constitutional Crossword',
    subtitle: 'Test your constitutional knowledge',
    icon: 'grid-outline',
    gradient: ['#1B5E20', '#2E7D32'],
    badge: null,
  },
  {
    id: 'Chatbot',
    title: 'AI Legal Assistant',
    subtitle: 'Ask questions about the Constitution',
    icon: 'chatbubbles-outline',
    gradient: ['#BF360C', '#D84315'],
    badge: 'AI',
  },
  {
    id: 'CommunityHub',
    title: 'Community Pulse',
    subtitle: 'Citizen opinions on landmark rulings',
    icon: 'megaphone-outline',
    gradient: ['#1a2a6c', '#b21f1f'],
    badge: 'NEW',
  },
  {
    id: 'Account',
    title: 'My Account',
    subtitle: 'Manage your profile',
    icon: 'person-circle-outline',
    gradient: ['#37474F', '#455A64'],
    badge: null,
  },
];

const WelcomeScreen = ({ navigation, route }) => {
  const { userData } = route.params || {};
  const [lang, setLang] = useState('English');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: false }),
    ]).start();
  }, []);

  const handleNavigation = (screen) => {
    if (screen === 'Account') {
      navigation.navigate('Account', { user: userData });
    } else {
      navigation.navigate(screen, { lang: lang }); // Pass language to other screens
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Hero Header */}
      <LinearGradient
        colors={['#0d0d2b', '#1a237e']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerDecorCircle} />
        <View style={styles.greetRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userData?.username?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text style={styles.greetText}>Welcome back,</Text>
            <Text style={styles.greetName}>{userData?.username || 'User'} 👋</Text>
          </View>
          
          {/* Language Toggle */}
          <View style={styles.langToggle}>
            <TouchableOpacity 
              style={[styles.langBtn, lang === 'English' && styles.langBtnActive]} 
              onPress={() => setLang('English')}
            >
              <Text style={[styles.langText, lang === 'English' && styles.langTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.langBtn, lang === 'Hindi' && styles.langBtnActive]} 
              onPress={() => setLang('Hindi')}
            >
              <Text style={[styles.langText, lang === 'Hindi' && styles.langTextActive]}>HI</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.tagline}>
          Nagrik Aur Samvidhan — Learn. Play. Grow.
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Modules', value: '5' },
            { label: 'Cases', value: '10+' },
            { label: 'Articles', value: '395+' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Feature Cards */}
      <Animated.ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        // opacity and translate are applied via wrapping animated view
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.sectionLabel}>Explore Features</Text>
          {FEATURES.map((feature, index) => (
            <TouchableOpacity
              key={feature.id}
              onPress={() => handleNavigation(feature.id)}
              activeOpacity={0.85}
              style={styles.featureCard}
            >
              <LinearGradient
                colors={feature.gradient}
                style={styles.featureGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.featureIconCircle}>
                  <Ionicons name={feature.icon} size={28} color={colors.white} />
                </View>
                <View style={styles.featureTextBlock}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                </View>
                <View style={styles.featureArrowRow}>
                  {feature.badge && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{feature.badge}</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 55,
    paddingBottom: 28,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  headerDecorCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,111,0,0.08)',
    top: -60,
    right: -40,
  },
  greetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  avatarText: {
    fontSize: 22,
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  greetText: {
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
  },
  greetName: {
    fontSize: 20,
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  tagline: {
    fontSize: 13,
    fontFamily: fonts.Italic,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  statValue: {
    fontSize: 20,
    fontFamily: fonts.Bold,
    color: colors.accentLight,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  scrollArea: {
    flex: 1,
  },
  cardsContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.SemiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  featureCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingRight: 14,
  },
  featureIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  featureTextBlock: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.white,
    marginBottom: 3,
  },
  featureSubtitle: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.65)',
  },
  featureArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeContainer: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: fonts.Bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  langBtnActive: {
    backgroundColor: colors.accent,
  },
  langText: {
    fontSize: 12,
    fontFamily: fonts.Bold,
    color: 'rgba(255,255,255,0.5)',
  },
  langTextActive: {
    color: colors.white,
  },
});