import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';

const ScreenLockScreen = () => {
  const [time, setTime] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [isQuitting, setIsQuitting] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    let timer;

    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0 && earnedCoins > 0 && !isQuitting) {
      updateCoinBalance(earnedCoins);
      Alert.alert('Timer Completed', `You earned ${earnedCoins} coins!`);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown]);

  const handleStartCountdown = () => {
    const parsedTime = parseInt(time);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      Alert.alert('Invalid Time', 'Please enter a valid time in minutes.');
      return;
    }

    setTime('');
    setCountdown(parsedTime * 60);
    setEarnedCoins(parsedTime); // Set the earned coins to the parsedTime (1 coin per minute)
    setIsQuitting(false); // Reset the quitting flag
  };

  const handleQuitCountdown = () => {
    Alert.alert(
      'Quit Screen Lock Mode',
      'Are you sure you want to quit the Screen Lock Mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: handleQuitConfirmed },
      ]
    );
  };

  const handleQuitConfirmed = () => {
    setIsQuitting(true);
    setCountdown(0);
  };
  
  const handleBackButton = () => {
    navigation.goBack();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const updateCoinBalance = async (earnedCoins) => {
    try {
      const userId = auth.currentUser?.uid; // Get the currently authenticated user's ID
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(query(usersCollectionRef, where('userId', '==', userId)));

      if (!querySnapshot.empty) {
        const documentSnapshot = querySnapshot.docs[0];
        const userDocRef = doc(db, 'users', documentSnapshot.id);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const currentCoins = userData.coins || 0;
          const newBalance = currentCoins + earnedCoins;
          console.log(userDocRef);
          await updateDoc(userDocRef, { coins: newBalance });
          console.log(newBalance);
          console.log('Coin balance updated successfully.');
        }
      }
    } catch (error) {
      console.error('Error updating coin balance:', error);
    }
  };

  return (
    <View style={styles.container}>
      {countdown === 0 && (
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.heading}>Screen Lock Mode</Text>
      <Text style={styles.subText}>Please enter the amount of time (in mins) you would like to lock your phone:</Text>
      <View style={styles.timerContainer}>
        {countdown > 0 ? (
          <Text style={styles.timer}>{formatTime(countdown)}</Text>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Enter time in minutes"
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
            textAlign="center"
            fontSize={48}
            autoFocus
          />
        )}
      </View>
      {countdown > 0 ? (
        <TouchableOpacity style={styles.button} onPress={handleQuitCountdown}>
          <Text style={styles.buttonText}>Quit</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleStartCountdown}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      )}
      {countdown > 0 && (
        <View style={styles.coinBalanceContainer}>
          <Text style={styles.coinBalanceText}>Coins to be earned: {earnedCoins}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
  },
  subText: {
    fontSize: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 32,
    color: '#FFF',
    textAlign: 'center',
  },
  timerContainer: {
    marginBottom: 32,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
  },
  input: {
    width: 200,
    height: 80,
    backgroundColor: '#000',
    color: '#FFF',
    fontSize: 48,
    fontWeight: 'bold',
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
    textAlign: 'center',
    paddingBottom: 8,
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00FF00',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  coinBalanceContainer: {
    marginTop: 16,
  },
  coinBalanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default ScreenLockScreen;