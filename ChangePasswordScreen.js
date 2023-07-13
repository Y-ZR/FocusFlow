import React, { useState } from 'react';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleChangePassword = async() => {
    if (currentPassword === '') {
      Alert.alert('Current Password', 'Please enter your current password.');
      return;
    }

    if (newPassword === '') {
      Alert.alert('New Password', 'Please enter a new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'The new password and confirm password do not match.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('User Not Found', 'Unable to find the current user.');
      return;
    }
    
    try {
      // reauthenticating
      await reauthenticate(currentPassword);
      // updating password
      await updatePassword(user, newPassword);
      Alert.alert('Password Changed', 'Your password has been successfully changed.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigation.goBack();
    } catch(error){
      console.log(error);
    }
  };

  const reauthenticate = currentPassword => {
    const user = auth.currentUser;
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    return reauthenticateWithCredential(user, cred);
  }

  const handleCancel = () => {
    navigation.goBack(); // Go back to the previous screen without making any changes
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={handleCancel}>
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
    width: '60%',
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00FF00',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ChangePasswordScreen;