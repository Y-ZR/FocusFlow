import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ChangeUsernameScreen = () => {
  const [newUsername, setNewUsername] = useState('');
  const navigation = useNavigation();

  const handleUsernameUpdate = () => {
    // Implement username update logic
    // Example: Update username in the database, display success message, etc.
    console.log('New username:', newUsername);
    // Reset input field
    setNewUsername('');
  };

  const handleCancel = () => {
    navigation.goBack(); // Navigate back to the previous screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Change Username</Text>
      <TextInput
        style={styles.input}
        placeholder="New Username"
        value={newUsername}
        onChangeText={setNewUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleUsernameUpdate}>
        <Text style={styles.buttonText}>Update Username</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
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
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
  },
  input: {
    width: 200,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00FF00',
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ChangeUsernameScreen;