# React Native Weather App

This is a simple weather application built using React Native. It displays temperature, relative humidity, and rain data for a specific location for the current day.

## Features

- Fetches weather data from an external API
- Displays temperature, humidity, and rain data in a line chart format
- Customizable chart styling
- Responsive layout using ScrollView

## Installation

To run this application locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install' ,'npm install @react-native-picker/picker','expo install expo-location','npm install -g expo-cli'
4. Run the app on your device or emulator using 'npx expo start`
   ![image](https://github.com/HugoLi0213/weatherapp/assets/66012674/650fde9d-8e44-4a94-9000-b9a3a58601f6)


## Usage

Upon launching the application, it fetches weather data for a predefined location from an external API. The data is then displayed in three separate line charts representing temperature, relative humidity, and rain.

## Dependencies

This project utilizes the following dependencies:

- [React](https://reactjs.org/)
- [React Native](https://reactnative.dev/)
- [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- [Expo StatusBar](https://docs.expo.dev/versions/latest/react-native/statusbar/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## API Used

This application fetches weather data from the [Open-Meteo API](https://open-meteo.com/), providing hourly temperature, relative humidity, and rain forecasts for a given location.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
