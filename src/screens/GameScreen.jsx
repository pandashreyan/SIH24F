import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const GameScreen = () => {
  const navigation = useNavigation();

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E0E0E0']} // White to Light Gray
      style={styles.gradientContainer}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Image - you might want to replace this with a game-related image */}
        <Image source={require('../assets/icon.png')} style={styles.image} />

        {/* Translucent Box */}
        <ScrollView contentContainerStyle={styles.translucentBox}>
          <Text style={styles.heading}>Game Selection</Text>

          {/* Buttons */}
          {[
            { title: 'Interactive Storytelling', screen: 'Fight' },
            { title: 'Crossword', screen: 'Crossword' }
          ].map((game) => (
            <TouchableOpacity
              key={game.screen}
              style={styles.button}
              onPress={() => handleNavigation(game.screen)}
            >
              <Text style={styles.buttonText}>{game.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 100,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 20,
    borderRadius: 20,
    paddingTop: 50
  },
  translucentBox: {
    width: '90%', 
    borderRadius: 15,
    paddingVertical: 20,
    marginVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  heading: {
    fontSize: 40,
    color: '#000000', // Changed back to black
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#686D76', 
    width: 250, 
    borderRadius: 10,
    paddingVertical: 12,
    marginVertical: 10, 
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF', // Kept white for contrast
    fontSize: 20,
    fontWeight: '600',
  },
});

export default GameScreen; 