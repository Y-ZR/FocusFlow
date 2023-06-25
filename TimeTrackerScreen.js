
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { LineChart, Table } from 'react-native-chart-kit';
import AppUsageStats from 'react-native-app-usage';

const TimeTrackerScreen = () => {
  const [timePeriod, setTimePeriod] = useState('Today');
  const [appUsageData, setAppUsageData] = useState([]);
  const navigation = useNavigation();

  const handleTimePeriodChange = (value) => {
    setTimePeriod(value);

    // Define the start and end time for the selected time period
    let startTime, endTime;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (value === 'Today') {
      startTime = today;
      endTime = new Date();
    } else if (value === 'Yesterday') {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      startTime = yesterday;
      endTime = today;
    } else if (value === 'One Week') {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      startTime = oneWeekAgo;
      endTime = today;
    } else if (value === 'One Month') {
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      startTime = oneMonthAgo;
      endTime = today;
    } else if (value === 'One Year') {
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      startTime = oneYearAgo;
      endTime = today;
    }

    // Retrieve app usage data based on the selected time period
    retrieveAppUsageData(startTime, endTime);
  };

  const retrieveAppUsageData = async (startTime, endTime) => {
    try {
      const appUsageData = await AppUsageStats.getUsageStats(startTime, endTime);
      setAppUsageData(appUsageData);
    } catch (error) {
      console.log('Error retrieving app usage data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Header */}
      {/* Implement the dropdown button to select the time period */}

      {/* Chart Section */}
      <View style={styles.chartContainer}>
        {/* Render the bar chart */}
      </View>

      {/* Table Section */}
      <View style={styles.tableContainer}>
        {/* Render the table */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black', // Set the background color to black
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
      color: '#FFF', // Set the text color to white
    },
    dropdownContainer: {
      marginTop: 20,
      marginRight: 16,
      marginLeft: 16,
    },
    dropdown: {
      backgroundColor: '#FFF',
    },
    dropdownItem: {
      justifyContent: 'flex-start',
    },
    dropdownMenu: {
      backgroundColor: '#FFF',
    },
    chartContainer: {
      flex: 1,
      marginVertical: 20,
      paddingHorizontal: 16,
    },
    tableContainer: {
      flex: 1,
      marginVertical: 20,
      paddingHorizontal: 16,
    },
  });

export default TimeTrackerScreen;