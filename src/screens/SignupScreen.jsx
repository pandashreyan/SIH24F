import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { useNavigation } from '@react-navigation/native';
import API from '../utils/api';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: false }),
    ]).start();
  }, []);

  const validateEmail = (emailStr) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API.REGISTER, { username, email, password });
      if (response.status === 201) {
        Alert.alert('Account Created! 🎉', 'Your account has been created. Please log in.', [
          { text: 'Go to Login', onPress: () => navigation.navigate('LOGIN') },
        ]);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert('Account Exists', error.response.data || 'Username or email already registered.');
      } else if (error.response) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      } else {
        Alert.alert('Connection Error', 'Unable to reach the server. Check your network.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />
      <LinearGradient
        colors={['#1a237e', '#0d0d2b']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Let's Get Started 🚀</Text>
        <Text style={styles.headerSubtitle}>Create your free account</Text>
      </LinearGradient>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formWrapper}
          keyboardVerticalOffset={60}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={[styles.formCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
            >
              {/* Username */}
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color={colors.primaryLight} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Choose a username"
                  placeholderTextColor={colors.textLight}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={colors.primaryLight} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primaryLight} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password (min. 6 chars)"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={secureEntry}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />
                <TouchableOpacity onPress={() => setSecureEntry(prev => !prev)}>
                  <Ionicons
                    name={secureEntry ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.grayDark}
                  />
                </TouchableOpacity>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.signupButtonWrapper}
                onPress={handleSignup}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={loading ? ['#9E9E9E', '#9E9E9E'] : colors.gradientPrimary}
                  style={styles.signupGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.signupText}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('LOGIN')}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.65)',
  },
  formWrapper: {
    flex: 1,
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 24,
    elevation: 6,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.SemiBold,
    color: colors.textSecondary,
    marginBottom: 8,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.gray,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: colors.background,
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontFamily: fonts.Regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  signupButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 24,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  signupGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signupText: {
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.SemiBold,
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  footerText: {
    color: colors.textSecondary,
    fontFamily: fonts.Regular,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontFamily: fonts.Bold,
    fontSize: 14,
  },
});
