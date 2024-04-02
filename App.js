import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  // State to hold the fetched data
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [rainData, setRainData] = useState([]);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relative_humidity_2m,rain&timezone=GMT&forecast_days=1');
      const data = await response.json();
  
      if (response.ok) {
        setTemperatureData(data.hourly.temperature_2m);
        setHumidityData(data.hourly.relative_humidity_2m);
        setRainData(data.hourly.rain);
      } else {
        throw new Error(`API responded with status: ${response.status}`);
      }
    } catch (error) {
    }
  };

  // useEffect to call fetchData when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Labels for all data points
  const allLabels = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];

  // Creating the chart configuration
  const chartConfig = {
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
  };

  // Customizing the x-axis to display specific labels
  const formatXAxis = (value) => {
    // Only show labels for 00:00, 06:00, 12:00, 18:00
    return ['00:00', '06:00', '12:00', '18:00'].includes(value) ? value : '';
  };

  // Render each LineChart for Temperature, Humidity, and Rain
  const renderLineChart = (title, dataset, color) => {
    // Check if the dataset is empty and return a message if it is
    if (dataset.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text>No chart data to display!</Text>
        </View>
      );
    }

    // Render the LineChart if the dataset is not empty
    return (
      <View style={styles.chartContainer}>
        <Text>{title}</Text>
        <LineChart
          data={{
            labels: allLabels,
            datasets: [{ data: dataset, color: () => color, strokeWidth: 2 }]
          }}
          width={Dimensions.get('window').width - 16}
          height={220}
          yAxisLabel=''
          yAxisSuffix=''
          yAxisInterval={1}
          chartConfig={chartConfig}
          formatXLabel={formatXAxis}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 17
          }}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Weather App</Text>
      <Text style={styles.subheader}>Today Weather</Text>
      {renderLineChart('Temperature (°C)', temperatureData, 'rgba(255, 0, 0, 1)')}
      {renderLineChart('Relative Humidity (%)', humidityData, 'rgba(0, 0, 255, 1)')}
      {renderLineChart('Rain (mm)', rainData, 'rgba(0, 255, 0, 1)')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 10, // Added padding for the entire content within the ScrollView
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20, // Additional top padding for the header
    marginLeft: 10, // Additional left padding for the header
  },
  subheader: {
    fontSize: 18,
    textAlign: 'center',
    margin: 5,
    marginLeft: 10, // Additional left padding for the subheader
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    borderRadius: 17,
    padding: 16,
    backgroundColor: '#f5f5f5', // Optional: if you want to style the container of the 'no data' message
  },
});
