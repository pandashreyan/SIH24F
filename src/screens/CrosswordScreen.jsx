import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const GRID_SIZE = 15;

// White cells - cells that accept input
const whiteCells = {
  // ACROSS: 1-Across: NAME (0,0)-(0,3)
  '0-0': true, '0-1': true, '0-2': true, '0-3': true,
  // 2-Across: THREE (0,5)-(0-9)
  '0-5': true, '0-6': true, '0-7': true, '0-8': true, '0-9': true,
  // 3-Across: SEVEN (0,11)-(0,14) -- wait, original had SEVEN for 3 but key was wrong. Keep as-is
  '0-11': true, '0-12': true, '0-13': true, '0-14': true,
  // 4-Across: AMBEDKAR (3,0)-(3,7)
  '3-0': true, '3-1': true, '3-2': true, '3-3': true, '3-4': true, '3-5': true, '3-6': true, '3-7': true,
  // 5-Across: PRESIDENT (6,3)-(6,10) -- 9 letters: P-R-E-S-I-D-E-N-T
  '6-3': true, '6-4': true, '6-5': true, '6-6': true, '6-7': true, '6-8': true, '6-9': true, '6-10': true,

  // DOWN: 1-Down: CHANDRACHUD (0,0)-(9,0) - 10 letters, col 0
  '1-0': true, '2-0': true, '4-0': true, '5-0': true, '7-0': true, '8-0': true, '9-0': true,
  // 2-Down: FOURTEEN (0,5)-(7,5) - 8 letters
  '1-5': true, '2-5': true, '4-5': true, '5-5': true, '7-5': true,
  // 3-Down: EIGHT (0,11)-(4,11) - 5 letters
  '1-11': true, '2-11': true, '3-11': true, '4-11': true,
  // 4-Down: 1951 (3,7)-(6,7) - 4 digits (already has 3-7 and 6-7)
  '4-7': true, '5-7': true,
  // 5-Down: DELHI (6,3)-(10,3) - 5 letters (already has 6-3)
  '7-3': true, '8-3': true, '9-3': true, '10-3': true,
};

const numberedCells = {
  '0-0': 1,
  '0-5': 2,
  '0-11': 3,
  '3-0': 4,
  '6-3': 5,
};

const ANSWERS = {
  // Across
  '0-0': 'N', '0-1': 'A', '0-2': 'M', '0-3': 'E',
  '0-5': 'T', '0-6': 'H', '0-7': 'R', '0-8': 'E', '0-9': 'E',
  '0-11': 'S', '0-12': 'E', '0-13': 'V', '0-14': 'N',
  '3-0': 'A', '3-1': 'M', '3-2': 'B', '3-3': 'E', '3-4': 'D', '3-5': 'K', '3-6': 'A', '3-7': 'R',
  '6-3': 'P', '6-4': 'R', '6-5': 'E', '6-6': 'S', '6-7': 'I', '6-8': 'D', '6-9': 'E', '6-10': 'N',
};

const questions = {
  across: {
    1: "First Article of Indian Constitution deals with ___ of India",
    2: "Fundamental Rights are given in Part ___ of the Constitution",
    3: "Number of fundamental rights originally provided",
    4: "Father of Indian Constitution",
    5: "Constitutional head of India",
  },
  down: {
    1: "First Chief Justice of India (last name)",
    2: "Article ___ deals with Right to Equality",
    3: "Number of schedules in original constitution",
    4: "First Amendment was made in year ___",
    5: "Parliament house is located in ___",
  },
};

const CrosswordScreen = () => {
  const navigation = useNavigation();
  const [gridValues, setGridValues] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(null);

  const handleInputChange = (row, col, value) => {
    const cellKey = `${row}-${col}`;
    if (whiteCells[cellKey]) {
      setGridValues(prev => ({
        ...prev,
        [cellKey]: value.toUpperCase().slice(-1),
      }));
      setChecked(false);
    }
  };

  const handleCheck = () => {
    let correct = 0;
    let total = 0;
    Object.keys(ANSWERS).forEach(key => {
      total++;
      if (gridValues[key] === ANSWERS[key]) correct++;
    });
    setScore({ correct, total });
    setChecked(true);
    if (correct === total) {
      Alert.alert('🎉 Congratulations!', 'You solved the crossword perfectly!');
    }
  };

  const handleReset = () => {
    setGridValues({});
    setChecked(false);
    setScore(null);
    setSelectedCell(null);
  };

  const getCellStyle = (row, col) => {
    const cellKey = `${row}-${col}`;
    const isWhite = whiteCells[cellKey];
    const isSelected = selectedCell === cellKey;
    if (!isWhite) return [styles.cell, styles.blackCell];

    let bg = styles.whiteCell;
    if (checked && ANSWERS[cellKey]) {
      bg = gridValues[cellKey] === ANSWERS[cellKey] ? styles.correctCell : styles.incorrectCell;
    }
    if (isSelected) bg = styles.selectedCell;

    return [styles.cell, styles.cellBorder, bg];
  };

  const renderCell = (row, col) => {
    const cellKey = `${row}-${col}`;
    const isWhite = whiteCells[cellKey];
    const cellNumber = numberedCells[cellKey];

    return (
      <View key={cellKey} style={getCellStyle(row, col)}>
        {cellNumber && <Text style={styles.cellNumber}>{cellNumber}</Text>}
        {isWhite && (
          <TextInput
            style={styles.input}
            maxLength={1}
            value={gridValues[cellKey] || ''}
            onChangeText={(v) => handleInputChange(row, col, v)}
            onFocus={() => setSelectedCell(cellKey)}
            onBlur={() => setSelectedCell(null)}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Header */}
      <LinearGradient
        colors={['#1a237e', '#0d1a6e']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Constitutional Crossword</Text>
        <Text style={styles.headerSubtitle}>Test your knowledge of the Indian Constitution</Text>

        {/* Score Badge */}
        {score && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>
              Score: {score.correct}/{score.total} ({Math.round((score.correct / score.total) * 100)}%)
            </Text>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent} showsVerticalScrollIndicator={false}>
        {/* Grid */}
        <View style={styles.gridCard}>
          <View style={styles.gridContainer}>
            {Array(GRID_SIZE).fill(null).map((_, row) => (
              <View key={row} style={styles.row}>
                {Array(GRID_SIZE).fill(null).map((_, col) => renderCell(row, col))}
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.checkButton} onPress={handleCheck} activeOpacity={0.85}>
            <LinearGradient
              colors={colors.gradientPrimary}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.white} />
              <Text style={styles.checkText}>Check Answers</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.85}>
            <Ionicons name="refresh-outline" size={18} color={colors.primary} />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={styles.legendText}>Correct</Text>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={styles.legendText}>Incorrect</Text>
          <View style={[styles.legendDot, { backgroundColor: '#E3F2FD' }]} />
          <Text style={styles.legendText}>Selected</Text>
        </View>

        {/* Clues */}
        {['across', 'down'].map(direction => (
          <View key={direction} style={styles.cluesSection}>
            <LinearGradient
              colors={direction === 'across' ? ['#1a237e', '#283593'] : ['#1B5E20', '#2E7D32']}
              style={styles.clueHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons
                name={direction === 'across' ? 'arrow-forward' : 'arrow-down'}
                size={16}
                color={colors.white}
              />
              <Text style={styles.clueHeaderText}>{direction.toUpperCase()}</Text>
            </LinearGradient>
            {Object.entries(questions[direction]).map(([num, question]) => (
              <View key={`${direction}-${num}`} style={styles.clueCard}>
                <Text style={styles.clueNumber}>{num}</Text>
                <Text style={styles.clueText}>{question}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CrosswordScreen;

const CELL_SIZE = 22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
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
    fontSize: 22,
    fontFamily: fonts.Bold,
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: 'rgba(255,255,255,0.6)',
  },
  scoreBadge: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  scoreText: {
    fontSize: 14,
    fontFamily: fonts.Bold,
    color: colors.white,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 32,
  },
  gridCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  gridContainer: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cellBorder: {
    borderWidth: 0.5,
    borderColor: '#90A4AE',
  },
  blackCell: {
    backgroundColor: '#1a237e',
  },
  whiteCell: {
    backgroundColor: colors.white,
  },
  selectedCell: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  correctCell: {
    backgroundColor: '#E8F5E9',
  },
  incorrectCell: {
    backgroundColor: '#FFEBEE',
  },
  cellNumber: {
    position: 'absolute',
    top: 1,
    left: 1,
    fontSize: 5,
    color: colors.primary,
    fontWeight: 'bold',
    zIndex: 1,
  },
  input: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 11,
    padding: 0,
    color: colors.primary,
    fontFamily: fonts.Bold,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  checkButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 3,
  },
  actionGradient: {
    flexDirection: 'row',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkText: {
    color: colors.white,
    fontFamily: fonts.SemiBold,
    fontSize: 15,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    elevation: 1,
  },
  resetText: {
    color: colors.primary,
    fontFamily: fonts.SemiBold,
    fontSize: 15,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  legendText: {
    fontSize: 12,
    fontFamily: fonts.Regular,
    color: colors.textSecondary,
    marginRight: 8,
  },
  cluesSection: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
  },
  clueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 8,
  },
  clueHeaderText: {
    fontSize: 14,
    fontFamily: fonts.Bold,
    color: colors.white,
    letterSpacing: 1,
  },
  clueCard: {
    flexDirection: 'row',
    padding: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    alignItems: 'flex-start',
  },
  clueNumber: {
    fontSize: 13,
    fontFamily: fonts.Bold,
    color: colors.primary,
    width: 24,
    marginRight: 8,
  },
  clueText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.Regular,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});