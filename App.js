import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location'; // Importing expo-location
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

// Location data for Tokyo, Hong Kong, and New York
const locations = {
  Tokyo: { latitude: 35.6895, longitude: 139.6917 },
  HongKong: { latitude: 22.3193, longitude: 114.1694 },
  NewYork: { latitude: 40.7128, longitude: -74.0060 }
};

export default function App() {
  const [selectedCity, setSelectedCity] = useState('Tokyo');
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [rainData, setRainData] = useState([]);

  // Function to fetch data from the API for a given location or the current GPS location
  const fetchData = async (latitude = null, longitude = null) => {
    if (!latitude || !longitude) {
      ({ latitude, longitude } = locations[selectedCity]);
    }
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,rain&timezone=GMT&forecast_days=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setTemperatureData(data.hourly.temperature_2m);
        setHumidityData(data.hourly.relative_humidity_2m);
        setRainData(data.hourly.rain);
      } else {
        throw new Error(`API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCity]);

  // Fetch the user's GPS location using expo-location
  const fetchGPSLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    fetchData(location.coords.latitude, location.coords.longitude);
  };

  // Render each LineChart for Temperature, Humidity, and Rain
  const renderLineChart = (title, dataset, color) => {
    if (dataset.length === 0) {
      return <View style={styles.chartContainer}><Text>No data available for {title}</Text></View>;
    }

    return (
      <View style={styles.chartContainer}>
        <Text>{title}</Text>
        <LineChart
          data={{
            labels: ['0:00', '6:00', '12:00', '18:00', '24:00'],
            datasets: [{ data: dataset, color: () => color }],
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726'
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Weather App</Text>
      <Picker
        selectedValue={selectedCity}
        style={{ height: 50, width: 150, alignSelf: 'center' }}
        onValueChange={(itemValue, itemIndex) => setSelectedCity(itemValue)}>
        <Picker.Item label="Tokyo" value="Tokyo" />
        <Picker.Item label="Hong Kong" value="HongKong" />
        <Picker.Item label="New York" value="NewYork" />
      </Picker>
      {renderLineChart('Temperature (°C)', temperatureData, 'rgba(255, 0, 0, 1)')}
      {renderLineChart('Relative Humidity (%)', humidityData, 'rgba(0, 0, 255, 1)')}
      {renderLineChart('Rain (mm)', rainData, 'rgba(0, 255, 0, 1)')}
      <Button title="Use My Location" onPress={fetchGPSLocation} color="#841584" />
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Hugo</Text>
        <Text style={[styles.footerText, styles.link]} onPress={() => Linking.openURL('https://github.com/HugoLi0213')}>GitHub</Text>
      </View>
    </ScrollView>
  );
}

// Styles, including an update to use boxShadow for web compatibility
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    margin: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    backgroundColor: '#f5f5f5',
    // boxShadow for web compatibility; adjust as necessary
    boxShadow: '0px 2px 4px rgba(0,0,0,0.25)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    marginRight: 10,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
