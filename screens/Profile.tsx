import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

function ProfileSettings({navigation }: { navigation: any }) {
  const [email, setEmail] = useState(''); // 고정된 이메일
  const [nickname, setNickname] = useState(''); // 기본 닉네임
  const [newNickname, setNewNickname] = useState(nickname);

  const handleNicknameChange = () => {
    if (!newNickname.trim()) {
      Alert.alert('Error', '닉네임을 입력해주세요.');
      return;
    }
    setNickname(newNickname);
    Alert.alert('Success', '닉네임이 변경되었습니다.');
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel'
        },
        {
          text: '로그아웃',
          onPress: () => {
            SecureStore.deleteItemAsync('token').then(() => {
              navigation.navigate('Landing');
            }).catch((error) => {
              console.error('토큰 삭제 오류:', error);
              Alert.alert('오류', '로그아웃에 실패했습니다.');
            });
            Alert.alert('로그아웃 되었습니다.');
          },
          style: 'destructive'
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>내 프로필</Text>

      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>사용자 설정</Text>

        <View style={styles.field}>
          <Text style={styles.label}>ID</Text>
          <TextInput
            style={styles.input}
            value={email}
            editable={false} // 이메일은 수정 불가
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>닉네임</Text>
          <View style={styles.nicknameRow}>
            <TextInput
              style={[styles.input, styles.nicknameInput]}
              value={newNickname}
              onChangeText={setNewNickname}
              placeholder="닉네임 입력"
            />
            <TouchableOpacity style={styles.changeButton} onPress={handleNicknameChange}>
              <Text style={styles.changeButtonText}>닉네임 변경</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0070FF',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F0F0F0',
  },
  nicknameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nicknameInput: {
    flex: 1,
    marginRight: 10,
  },
  changeButton: {
    backgroundColor: '#0070FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 14,
    color: '#0070FF',
    marginBottom: 5,
  },
  footerText: {
    fontSize: 12,
    color: '#AAA',
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileSettings;
