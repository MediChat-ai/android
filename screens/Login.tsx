import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as Font from 'expo-font';

function Login({ navigation }: { navigation: any }) {
  const [fontLoading, setFontLoading] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>로그인</Text>

          <TextInput
            style={styles.input}
            placeholder="아이디"
            value={id}
            onChangeText={setId}
          />

          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Home')} // 로그인 버튼 클릭 시 Home 화면으로 이동
          >
            <Text style={styles.buttonText1}>로그인</Text>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <Text style={styles.socialLoginText}>소셜 계정으로 간편하게 로그인하세요!</Text>

            <TouchableOpacity style={styles.signupButton1}>
              {/* <Image source={require('../assets/images/google_logo.png')} style={styles.logo} /> */}
              <Text style={styles.buttonText2}>구글 로그인</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.signupButton2}>
              <Text style={styles.buttonText3}>네이버 로그인</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    marginTop: '20%',
    marginBottom: '10%',
    fontFamily: 'NanumSquareRoundEB',
  },
  input: {
    height: 40,
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#0070FF',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
    height: 40,
  },
  signupButton1: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButton2: {
    backgroundColor: '#20C801',
    borderRadius: 10,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText1: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  buttonText2: {
    color: '#000000',
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  buttonText3: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  socialContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  socialLoginText: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'NanumSquareRoundR',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default Login;
