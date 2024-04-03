import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
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

  // Function to fetch data from the API for a given location
  const fetchData = async () => {
    const { latitude, longitude } = locations[selectedCity];
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

  // Fetch data for the selected city when the component mounts or the selectedCity changes
  useEffect(() => {
    fetchData();
  }, [selectedCity]);

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
            labels: Array.from({ length: dataset.length }, (_, i) => `${i}:00`),
            datasets: [{ data: dataset, color: () => color }],
          }}
          width={Dimensions.get('window').width - 16} // from react-native
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 1, // optional, defaults to 2dp
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
    </ScrollView>
  );
}

// Styles
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#f5f5f5', // Optional: if you want to style the container of the chart
  },
});
