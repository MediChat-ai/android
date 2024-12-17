import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Image, BackHandler, Alert } from 'react-native';
import * as Font from 'expo-font';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const evaluatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++; // 길이 체크
  if (/[A-Z]/.test(password)) strength++; // 대문자 포함
  if (/[0-9]/.test(password)) strength++; // 숫자 포함
  if (/[^a-zA-Z0-9]/.test(password)) strength++; // 특수문자 포함
  return strength;
};

const Register = ({ navigation }: { navigation: any }) => {
  const [fontLoading, setFontLoading] = useState(false);
  const [id, setId] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (newPassword) => {
    setPassword(newPassword);
    setPasswordStrength(evaluatePasswordStrength(newPassword));
  };

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
    const backAction = () => {
      navigation.navigate('Landing');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleRegister = async () => {
    if (password !== rePassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordStrength < 4) {
      Alert.alert('오류', '비밀번호 보안성이 낮습니다. 영어 대소문자, 숫자, 특수문자가 포함된 8자 이상의 비밀번호를 입력해주세요.');
      return;
    }
    try {
      const response = await axios.post(`https://api.medichat.site/users/register`, {
        user_id: id,
        user_name: userName,
        pw: password,
        auth_provider: 'local'
      }, { validateStatus: (status) => status !== 500 });

      if (response.status === 200) {
        await SecureStore.setItemAsync('token', response.data.token);
        Alert.alert('알림', '로그인 성공!', [
          { text: '확인', onPress: () => navigation.navigate('ChatTabs') }
        ]);
      } else {
        Alert.alert('오류', response.data.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        Alert.alert('오류', err.message);
        console.error('로그인 에러:', err);
      } else {
        Alert.alert('오류', '알 수 없는 에러가 발생했습니다.');
        console.error('로그인 에러:', err);
      }
    }
  };

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
          <Text style={styles.title}>회원가입</Text>

          <TextInput
            style={styles.input}
            placeholder="아이디"
            value={id}
            onChangeText={setId}
          />

          <TextInput
            style={styles.input}
            placeholder="닉네임"
            value={userName}
            onChangeText={setUserName}
          />

          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
          />

          <View style={[styles.strengthBar, {
            width: `${(passwordStrength / 4) * 100}%`,
            backgroundColor:
              passwordStrength === 1
                ? '#f73a34'
                : passwordStrength === 2
                  ? '#ed8337'
                  : passwordStrength === 3
                    ? '#ffe600'
                    : '#37ed3a',
          }]} />

          <TextInput
            style={styles.input}
            placeholder="비밀번호 재입력"
            secureTextEntry
            value={rePassword}
            onChangeText={setRePassword}
          />

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
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
    width: '100%',
    marginBottom: 20,
    fontFamily: 'NanumSquareRoundR',
  },
  registerButton: {
    backgroundColor: "#0070FF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  strengthBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    width: '0%',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
});

export default Register;
