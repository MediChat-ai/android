import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Font from 'expo-font';

function Chat({ navigation }: { navigation: any }) {
  const [fontLoading, setFontLoading] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'NanumSquareRoundB': require('../assets/fonts/NanumSquareRoundB.ttf'),
        'NanumSquareRoundEB': require('../assets/fonts/NanumSquareRoundEB.ttf'),
        'NanumSquareRoundL': require('../assets/fonts/NanumSquareRoundL.ttf'),
        'NanumSquareRoundR': require('../assets/fonts/NanumSquareRoundR.ttf'),
      });
      setFontLoading(true);
    };
    loadFonts();
  }, []);
  return (
    fontLoading && (
      <View style={styles.container}>
        <Text>채팅</Text>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 40,
    marginTop: '60%',
    marginBottom: 10,
    fontFamily: 'NanumSquareRoundEB',
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'NanumSquareRoundB',
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    height: 40
  },
  signupButton: {
    backgroundColor: '#0070FF',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText1: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  buttonText2: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
});

export default Chat;