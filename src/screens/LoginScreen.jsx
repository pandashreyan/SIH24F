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
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { useNavigation } from '@react-navigation/native';
import API from '../utils/api';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both username and password.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(API.LOGIN, { username, password });
      if (response.status === 200) {
        navigation.navigate('Welcome', {
          userData: {
            username: response.data.username,
            email: response.data.email,
          },
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        Alert.alert('Login Failed', 'Invalid username or password.');
      } else if (error.response) {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      } else {
        Alert.alert('Connection Error', 'Unable to reach the server. Check your network connection.');
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
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.miniLogoWrapper}>
            <Image 
              source={require('../assets/newman.png')} 
              style={styles.miniLogo}
              resizeMode="contain"
            />
          </View>
        </View>
        <Text style={styles.headerTitle}>Welcome Back 👋</Text>
        <Text style={styles.headerSubtitle}>Sign in to continue your journey</Text>
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
                  placeholder="Enter your username"
                  placeholderTextColor={colors.textLight}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.primaryLight} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry={secureEntry}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity onPress={() => setSecureEntry(prev => !prev)}>
                  <Ionicons
                    name={secureEntry ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={colors.grayDark}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotWrapper}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButtonWrapper}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={loading ? ['#9E9E9E', '#9E9E9E'] : colors.gradientAccent}
                  style={styles.loginGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.loginText}>
                    {loading ? 'Signing In...' : 'Login'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signupLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default LoginScreen;

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
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  miniLogoWrapper: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  miniLogo: {
    width: 32,
    height: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 30,
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
    marginTop: 8,
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
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  forgotText: {
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    fontSize: 13,
  },
  loginButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    elevation: 4,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  loginGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginText: {
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.SemiBold,
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray,
  },
  dividerText: {
    marginHorizontal: 14,
    color: colors.textLight,
    fontFamily: fonts.Regular,
    fontSize: 13,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.textSecondary,
    fontFamily: fonts.Regular,
    fontSize: 14,
  },
  signupLink: {
    color: colors.primary,
    fontFamily: fonts.Bold,
    fontSize: 14,
  },
});
