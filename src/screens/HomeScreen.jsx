import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const buttonSlide = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 700,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: false,
        }),
      ]),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(buttonSlide, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <LinearGradient
        colors={colors.gradientHero}
        style={styles.gradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative circle */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* Logo + Title */}
        <Animated.View
          style={[
            styles.topContent,
            { opacity: fadeAnim, transform: [{ scale: logoScale }] },
          ]}
        >
          <View style={styles.logoWrapper}>
            <Image
              source={require('../assets/newman.png')}
              style={styles.bannerImage}
              resizeMode="contain"
            />
          </View>
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <Text style={styles.title}>Nagrik</Text>
            <Text style={styles.titleAccent}>Aur Samvidhan</Text>
            <Text style={styles.subtitle}>
              🏛️ Gaming Your Way to{'\n'}Constitutional Wisdom!
            </Text>
          </Animated.View>
        </Animated.View>

        {/* Buttons */}
        <Animated.View
          style={[styles.bottomContent, { transform: [{ translateY: buttonSlide }] }]}
        >
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LOGIN')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={colors.gradientAccent}
              style={styles.loginGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => navigation.navigate('SignUp')}
            activeOpacity={0.85}
          >
            <Text style={styles.signupButtonText}>Create an Account →</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            SIH 2024 · Nagrik Aur Samvidhan Project
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBg: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 111, 0, 0.08)',
    top: -60,
    right: -80,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(83, 75, 174, 0.15)',
    bottom: 100,
    left: -50,
  },
  topContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  bannerImage: {
    height: 110,
    width: 110,
    borderRadius: 55, // Make the image itself circular if possible
  },
  title: {
    fontSize: 40,
    fontFamily: fonts.Bold,
    color: colors.white,
    textAlign: 'center',
    letterSpacing: 1,
  },
  titleAccent: {
    fontSize: 28,
    fontFamily: fonts.Medium,
    color: colors.accentLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  bottomContent: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 20,
  },
  loginButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  loginGradient: {
    paddingVertical: 17,
    alignItems: 'center',
    borderRadius: 16,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    letterSpacing: 0.5,
  },
  signupButton: {
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  signupButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.Medium,
  },
  disclaimer: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    fontFamily: fonts.Regular,
    textAlign: 'center',
  },
});
