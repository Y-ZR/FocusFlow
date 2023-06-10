import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import firebase from './firebase';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [registerPage, setRegisterPage] = useState(false);

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
      .then(() => {
        setLoggedIn(true);
      })
      .catch((error) => {
        Alert.alert(
          'Invalid credentials',
          'Would you like to register as a member or reset your password?',
          [
            { text: 'Register', onPress: handleRegister },
            { text: 'Forgot Password', onPress: handleForgotPassword },
          ]
        );
      });
  };

  const handleRegister = () => {
    setRegisterPage(true);
  };

  const handleForgotPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, username)
      .then(() => {
        Alert.alert('Password Reset Email Sent', 'Please check your email to reset your password.');
      })
      .catch((error) => {
        Alert.alert('Forgot Password Error', error.message);
      });
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setLoggedIn(false);
        setUsername('');
        setPassword('');
      })
      .catch((error) => {
        Alert.alert('Logout Error', error.message);
      });
  };

  const handleRegisterPageBack = () => {
    setRegisterPage(false);
  };

  const handleRegisterUser = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, username, password)
      .then(() => {
        Alert.alert(
          'Account Created',
          'Your account has been successfully created. Please return to the main login page to log in with your new account.'
        );
      })
      .catch((error) => {
        Alert.alert('Registration Error', error.message);
      });
  };

  if (registerPage) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Register as a user!</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button title="Register" onPress={handleRegisterUser} />
          <Button title="Back" onPress={handleRegisterPageBack} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FocusFlow</Text>
      {!loggedIn ? (
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <Button title="Login" onPress={handleLogin} />
          <Text style={[styles.registerText, { textAlignVertical: 'center' }]}>Not a user?</Text>
          <Button title="Register" onPress={handleRegister} />
        </View>
      ) : (
        <View style={styles.loggedInContainer}>
          <Text style={styles.loggedInText}>Logged in as {username}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  loginContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  loggedInContainer: {
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  registerText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  loggedInText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default App;