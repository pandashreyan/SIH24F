import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import API from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import Tts from 'react-native-tts';

const ChatbotScreen = ({ route }) => {
  const { lang = 'English' } = route.params || {};
  const navigation = useNavigation();
  // ... existing state ...
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Jai Hind! 🇮🇳 I'm your AI Legal Assistant for Nagrik Aur Samvidhan. Ask me anything about the Indian Constitution, Fundamental Rights, or landmark cases!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: false }).start();
  }, []);

  const handleSend = async () => {
    const text = userInput.trim();
    if (!text) return;

    const userMessage = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        API.CHATBOT,
        { message: text, lang: lang },
        { headers: { 'Content-Type': 'application/json' }, timeout: 120000 }
      );
      const botMessage = {
        sender: 'bot',
        text: response.data.response || 'I apologize, I could not process that request.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: 'bot',
        text: 'Sorry, I am currently unavailable. The AI service may be offline. Please try again later.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    'What are Fundamental Rights?',
    'Who drafted the Constitution?',
    'Article 21 explained',
    'What is DPSP?',
  ];

  const speakMessage = (text) => {
    Tts.stop();
    Tts.speak(text);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <LinearGradient
        colors={['#0d0d2b', '#1a237e']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>⚖️</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Legal Assistant</Text>
            <Text style={styles.headerSubtitle}>
              {loading ? 'Typing...' : 'AI-Powered · Constitution Expert'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => Tts.stop()} style={{marginLeft: 'auto'}}>
          <Ionicons name="volume-mute-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.keyboardWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <Animated.View
              key={index}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userBubble : styles.botBubble,
              ]}
            >
              {msg.sender === 'bot' && (
                <View style={styles.botAvatarSmall}>
                  <Text style={{ fontSize: 14 }}>⚖️</Text>
                </View>
              )}
              <View
                style={[
                  styles.bubbleContent,
                  msg.sender === 'user' ? styles.userBubbleContent : styles.botBubbleContent,
                  msg.isError && styles.errorBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4}}>
                  {msg.sender === 'bot' && (
                    <TouchableOpacity onPress={() => speakMessage(msg.text)}>
                      <Ionicons name="volume-high-outline" size={16} color={colors.primary} />
                    </TouchableOpacity>
                  )}
                  <Text style={[styles.timeText, msg.sender === 'user' && { color: 'rgba(255,255,255,0.6)' }]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}

          {loading && (
            <View style={[styles.messageBubble, styles.botBubble]}>
              <View style={styles.botAvatarSmall}>
                <Text style={{ fontSize: 14 }}>⚖️</Text>
              </View>
              <View style={styles.botBubbleContent}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Prompts */}
        <ScrollView
          horizontal
          style={styles.quickPromptsRow}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickPromptsContent}
        >
          {QUICK_PROMPTS.map((prompt, i) => (
            <TouchableOpacity
              key={i}
              style={styles.promptChip}
              onPress={() => {
                setUserInput(prompt);
              }}
            >
              <Text style={styles.promptChipText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about the Constitution..."
            placeholderTextColor={colors.textLight}
            value={userInput}
            onChangeText={setUserInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton, !userInput.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={loading || !userInput.trim()}
          >
            <LinearGradient
              colors={userInput.trim() ? colors.gradientAccent : ['#E0E0E0', '#E0E0E0']}
              style={styles.sendGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons
                name="send"
                size={18}
                color={userInput.trim() ? colors.white : colors.grayDark}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatbotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  botAvatarText: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 11,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
  },
  keyboardWrapper: {
    flex: 1,
  },
  chatArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  botBubble: {
    justifyContent: 'flex-start',
    gap: 8,
  },
  botAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleContent: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 12,
    paddingHorizontal: 16,
  },
  userBubbleContent: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  botBubbleContent: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  errorBubble: {
    backgroundColor: colors.errorLight,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.Regular,
  },
  userMessageText: {
    color: colors.white,
  },
  botMessageText: {
    color: colors.textPrimary,
  },
  timeText: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 4,
    fontFamily: fonts.Regular,
    textAlign: 'right',
  },
  quickPromptsRow: {
    maxHeight: 48,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  quickPromptsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  promptChip: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.gray,
    elevation: 1,
    marginRight: 8,
  },
  promptChipText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: colors.background,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.gray,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 3,
  },
  sendButtonDisabled: {
    elevation: 0,
  },
  sendGradient: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
