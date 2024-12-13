import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, BackHandler } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as Font from "expo-font";

const backendURI = "https://api.medichat.site";

const WritePost = ({ route, navigation }: { route: any; navigation: any }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fontLoading, setFontLoading] = useState(false);
  const { board_id } = route.params;

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        NanumSquareRoundB: require("../assets/fonts/NanumSquareRoundB.ttf"),
        NanumSquareRoundR: require("../assets/fonts/NanumSquareRoundR.ttf"),
      });
      setFontLoading(true);
    };
    loadFonts();
  }, []);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('PostList', { id: board_id });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, board_id]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        Alert.alert("오류", "로그인이 필요합니다.");
        return;
      }

      const response = await axios.post(
        `${backendURI}/community/writePost`,
        { title, content, board_id, token },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("성공", "게시글이 작성되었습니다.", [
        { text: "확인", onPress: () => navigation.navigate('PostList', { id: board_id }) },
      ]);
    } catch (err) {
      console.error("게시글 작성 실패:", err);
      Alert.alert("오류", "게시글 작성 중 문제가 발생했습니다.");
    }
  };

  if (!fontLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <Text style={styles.spinnerText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>게시물 작성</Text>
      <Text style={styles.label}>제목</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="제목을 입력하세요"
      />
      <Text style={styles.label}>내용</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={content}
        onChangeText={setContent}
        placeholder="내용을 입력하세요"
        multiline
        textAlignVertical="top"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>게시글 작성</Text>
      </TouchableOpacity>
    </ScrollView>
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
    borderColor: "#DDDDDD",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    fontFamily: "NanumSquareRoundR",
  },
  textarea: {
    height: 150,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "NanumSquareRoundR",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerText: {
    fontSize: 18,
    fontFamily: "NanumSquareRoundR",
  },
  title: {
    fontSize: 28,
    fontFamily: "NanumSquareRoundB",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default WritePost;
