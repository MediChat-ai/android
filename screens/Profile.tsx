import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const backendURI = "https://api.medichat.site";

const evaluatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++; // 길이 체크
  if (/[A-Z]/.test(password)) strength++; // 대문자 포함
  if (/[0-9]/.test(password)) strength++; // 숫자 포함
  if (/[^a-zA-Z0-9]/.test(password)) strength++; // 특수문자 포함
  return strength;
};

const Profile = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

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
      setIsEditingNickname(false);
    } catch (err) {
      console.error("닉네임 변경 실패:", err);
      Alert.alert("오류", "닉네임 변경 중 문제가 발생했습니다.");
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword.trim() || !newPassword.trim()) {
      Alert.alert("오류", "모든 필드를 입력해주세요.");
      return;
    }
    if (passwordStrength < 3) {
      Alert.alert("오류", "비밀번호 강도가 낮습니다.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      const response = await axios.post(`${backendURI}/users/change/password`, {
        token,
        password: currentPassword,
        new_password: newPassword,
      });

      if (response.status === 200) {
        Alert.alert("성공", "비밀번호가 변경되었습니다. 다시 로그인 해주세요.");
        await SecureStore.deleteItemAsync("token");
        navigation.navigate("Landing");
      } else {
        Alert.alert("오류", response.data.error || "비밀번호 변경 중 문제가 발생했습니다.");
      }
      setIsEditingPassword(false);
    } catch (err) {
      if (err.response) {
        Alert.alert("오류", err.response.data.error || "비밀번호 변경 중 문제가 발생했습니다.");
      } else {
        Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
      }
      console.error("비밀번호 변경 실패:", err);
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
            isEditingNickname ? null : styles.disabledInput,
          ]}
          value={nickname}
          onChangeText={setNickname}
          editable={isEditingNickname}
        />
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setIsEditingNickname((prev) => !prev)}
      >
        <Text style={styles.editButtonText}>
          {isEditingNickname ? "완료" : "닉네임 변경"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.label}>현재 비밀번호</Text>
      <TextInput
        style={[
          styles.input,
          isEditingPassword ? null : styles.disabledInput,
        ]}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        editable={isEditingPassword}
      />

      <Text style={styles.label}>새 비밀번호</Text>
      <TextInput
        style={[
          styles.input,
          isEditingPassword ? null : styles.disabledInput,
        ]}
        value={newPassword}
        onChangeText={(password) => {
          setNewPassword(password);
          setPasswordStrength(evaluatePasswordStrength(password));
        }}
        secureTextEntry
        editable={isEditingPassword}
      />
      <View style={[styles.strengthBar, {
        width: `${(passwordStrength / 4) * 100}%`,
        backgroundColor:
          passwordStrength === 1 ? "red" :
            passwordStrength === 2 ? "orange" :
              passwordStrength === 3 ? "green" : "blue",
      }]} />

      <TouchableOpacity
        style={isEditingPassword ? styles.saveButton : styles.editButton}
        onPress={() =>
          isEditingPassword
            ? handlePasswordChange()
            : setIsEditingPassword(true)
        }
      >
        <Text style={styles.saveButtonText}>
          {isEditingPassword ? "완료" : "비밀번호 변경"}
        </Text>
      </TouchableOpacity>

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
  title: {
    fontSize: 28,
    fontFamily: "NanumSquareRoundB",
    marginBottom: 30,
    textAlign: "center",
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
    width: '100%',
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
  strengthBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    width: "0%",
    marginBottom: 20,
  },
});

export default Profile;
