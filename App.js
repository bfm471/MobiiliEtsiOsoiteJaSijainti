import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput, Button, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState({})
  const api_key = process.env.EXPO_PUBLIC_API_KEY;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude:location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.03,
      });
      console.log(location.coords);
    })();
  }, []);

  const handlePress = () => {
    getCoordinates();
    setAddress('')
  }

  const getCoordinates = () => {
    fetch(`https://geocode.maps.co/search?q=${address}&api_key=${api_key}`)
    .then(response => response.json())
    .then(data => setLocation({...location, latitude:data[0].lat, longitude:data[0].lon}))  
    .catch(error => console.error(error))
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <MapView
        style={styles.map}
        region={location}
      >
        <Marker 
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude
          }}
        />
      </MapView>
      <View style={{ flex: 1 }}>
        <TextInput 
        style={{ width: '100%', borderWidth:1, fontSize: 20 }}
        placeholder='Enter address'
        onChangeText={text => setAddress(text)}
        value={address}/>
      </View>
      <View>
        <Button title='SHOW' onPress={handlePress} />
      </View>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '85%'
  }
});
