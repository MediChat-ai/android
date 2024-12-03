import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import * as Font from 'expo-font';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
// import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';

const backendURI = process.env.REACT_APP_BACKEND_URI;
const CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;

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
  useEffect(() => {
    // const naverLogin = new (window as any).naver.LoginWithNaverId({
    //   clientId: CLIENT_ID,
    //   callbackUrl: REDIRECT_URI,
    //   isPopup: 0,
    //   loginButton: { color: 'green', type: 3, height: 50 },
    // });
    // naverLogin.init();

    // GoogleSignin.configure({
    //   webClientId: process.env.REACT_APP_GOOGLE_WEB_CLIENT_ID,
    //   offlineAccess: true,
    // });
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`https://api.medichat.site/users/login`, {
        user_id: id,
        pw: password,
      }, { validateStatus: (status) => status !== 500 });

      if (response.status === 200) {
        await SecureStore.setItemAsync('token', response.data.token);
        alert('로그인 성공!');
        navigation.navigate('Chat');
      } else if (response.status === 401) {
        alert(response.data.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
        console.error('로그인 에러:', err);
      } else {
        alert('알 수 없는 에러가 발생했습니다.');
        console.error('로그인 에러:', err);
      }
    }
  };

  // const handleGoogleLogin = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const { idToken } = userInfo;

  //     const res = await axios.post(`${backendURI}/users/oauth/google`, { accessToken: idToken });
  //     await SecureStore.setItemAsync('token', res.data.token);
  //     navigation.navigate('Home');
  //   } catch (error) {
  //     if (error instanceof Error && (error as any).code === statusCodes.SIGN_IN_CANCELLED) {
  //       alert('로그인 취소');
  //     } else if (error instanceof Error && (error as any).code === statusCodes.IN_PROGRESS) {
  //       if (error instanceof Error && (error as any).code === statusCodes.IN_PROGRESS) {
  //         alert('로그인 진행 중');
  //       } else {
  //         alert('구글 로그인 실패: ' + (error as Error).message);
  //       }
  //     }
  //   }
  // }

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
            onPress={handleLogin}
          >
            <Text style={styles.buttonText1}>로그인</Text>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <Text style={styles.socialLoginText}>소셜 계정으로 간편하게 로그인하세요!</Text>

            {/* <TouchableOpacity style={styles.signupButton1} onPress={() => naverLogin()}>
              <Text style={styles.buttonText2}>네이버 로그인</Text>
            </TouchableOpacity> */}

            {/* <GoogleSigninButton
              style={styles.signupButton1}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={handleGoogleLogin}
            /> */}
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
});

export default Login;
