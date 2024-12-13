import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const backendURI = "https://api.medichat.site";

const Profile = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const loadProfileFromToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }
      const decodedToken = jwtDecode<{ user_id: string; user_name: string }>(token);
      setUserId(decodedToken.user_id);
      setNickname(decodedToken.user_name);
    } catch (err) {
      console.error("토큰 디코딩 실패:", err);
      Alert.alert("오류", "프로필 정보를 로드하는 중 문제가 발생했습니다.");
    }
  };

  const handleNicknameChange = async () => {
    if (!nickname.trim()) {
      Alert.alert("오류", "닉네임을 입력해주세요.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      const response = await axios.post(`${backendURI}/users/change/username`, {
        new_username: nickname,
        token,
      });
      await SecureStore.setItemAsync("token", response.data.token);

      Alert.alert("성공", "닉네임이 성공적으로 변경되었습니다.");
      setIsEditing(false);
    } catch (err) {
      console.error("닉네임 변경 실패:", err);
      Alert.alert("오류", "닉네임 변경 중 문제가 발생했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      Alert.alert("성공", "로그아웃되었습니다.");
      navigation.navigate("Landing");
    } catch (err) {
      console.error("로그아웃 실패:", err);
      Alert.alert("오류", "로그아웃 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadProfileFromToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필</Text>
      <Text style={styles.label}>사용자 ID</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        value={userId}
        editable={false}
      />

      <Text style={styles.label}>닉네임</Text>
      <View style={styles.nicknameContainer}>
        <TextInput
          style={[
            styles.input,
            { width: "100%" }, // 너비 고정
            isEditing ? null : styles.disabledInput,
          ]}
          value={nickname}
          onChangeText={setNickname}
          editable={isEditing}
        />
      </View>

      {isEditing && (
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleNicknameChange}
        >
          <Text style={styles.saveButtonText}>완료</Text>
        </TouchableOpacity>
      )}

      {!isEditing && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>수정</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 30,
    backgroundColor: "#ffffff",
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontFamily: "NanumSquareRoundB",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "NanumSquareRoundR",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#aaa",
  },
  nicknameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#0070FF",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  editButtonText: {
    color: "#ffffff",
    fontFamily: "NanumSquareRoundR",
  },
  saveButton: {
    backgroundColor: "#28a745",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  saveButtonText: {
    color: "#ffffff",
    fontFamily: "NanumSquareRoundR",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontFamily: "NanumSquareRoundR",
  },
  title: {
    fontSize: 28,
    fontFamily: "NanumSquareRoundB",
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default Profile;
