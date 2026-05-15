import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import API from '../utils/api';

const AccountScreen = ({ route, navigation }) => {
  const { user } = route.params || {};
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Delete Account',
      'This action cannot be undone. All your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const response = await axios.delete(API.DELETE_USER(user?.username));
              if (response.status === 200) {
                Alert.alert('Account Deleted', 'Your account has been removed.', [
                  {
                    text: 'OK',
                    onPress: () =>
                      navigation.reset({ index: 0, routes: [{ name: 'HOME' }] }),
                  },
                ]);
              }
            } catch (error) {
              const msg = error.response
                ? 'Failed to delete account. Please try again.'
                : 'Unable to connect to the server.';
              Alert.alert('Error', msg);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: () =>
          navigation.reset({ index: 0, routes: [{ name: 'HOME' }] }),
      },
    ]);
  };

  const INFO_ITEMS = [
    { icon: 'person-outline', label: 'Username', value: user?.username || '—' },
    { icon: 'mail-outline', label: 'Email', value: user?.email || '—' },
    { icon: 'shield-checkmark-outline', label: 'Account Type', value: 'Standard User' },
    { icon: 'calendar-outline', label: 'Member Since', value: 'SIH 2024' },
  ];

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

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {user?.username?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.username || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Active Member</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Profile Information</Text>
          {INFO_ITEMS.map((item, index) => (
            <View
              key={index}
              style={[styles.infoRow, index < INFO_ITEMS.length - 1 && styles.infoRowBorder]}
            >
              <View style={styles.infoIconWrapper}>
                <Ionicons name={item.icon} size={18} color={colors.primary} />
              </View>
              <View style={styles.infoTextCol}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievement Card */}
        <View style={styles.achievementCard}>
          <LinearGradient
            colors={['#FF6F00', '#FFA040']}
            style={styles.achievementGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.achievementEmoji}>🏆</Text>
            <View>
              <Text style={styles.achievementTitle}>SIH 2024 Participant</Text>
              <Text style={styles.achievementSubtitle}>
                Nagrik Aur Samvidhan — Empowering Citizens
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Actions */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Account Actions</Text>

          <TouchableOpacity style={styles.actionRow} onPress={handleLogout} activeOpacity={0.8}>
            <View style={[styles.actionIcon, { backgroundColor: colors.primaryLight + '20' }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.primary} />
            </View>
            <Text style={styles.actionText}>Log Out</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.grayDark} />
          </TouchableOpacity>

          <View style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDeleteAccount}
            disabled={deleting}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: colors.error + '20' }]}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </View>
            <Text style={[styles.actionText, { color: colors.error }]}>
              {deleting ? 'Deleting...' : 'Delete Account'}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <Text style={styles.appInfo}>
          Nagrik Aur Samvidhan · SIH 2024 · v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarSection: {
    width: '100%',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarLetter: {
    fontSize: 34,
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  userName: {
    fontSize: 22,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#69F0AE',
  },
  activeText: {
    fontSize: 12,
    fontFamily: fonts.Medium,
    color: 'rgba(255,255,255,0.8)',
  },
  body: {
    flex: 1,
    marginTop: -20,
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  bodyContent: {
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
    fontSize: 12,
    fontFamily: fonts.SemiBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  infoIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: fonts.Medium,
    color: colors.textPrimary,
  },
  achievementCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 4,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  achievementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  achievementEmoji: {
    fontSize: 36,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  achievementSubtitle: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.Medium,
    color: colors.textPrimary,
  },
  actionDivider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: 8,
  },
  appInfo: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.textLight,
    marginTop: 4,
  },
});
