import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, BackHandler } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as Font from 'expo-font';

const backendURI = "https://api.medichat.site";

const PostList = ({ route, navigation }: { route: any; navigation: any }) => {
  const { id } = route.params;
  const [posts, setPosts] = useState([]);
  const [boardName, setBoardName] = useState("게시판 이름");
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        if (!token) {
          Alert.alert("오류", "로그인이 필요합니다.");
          navigation.navigate("Login");
          return;
        }

        const response = await axios.get(`${backendURI}/community/getPostList?board_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { posts: fetchedPosts, board_name } = response.data;

        if (!fetchedPosts || fetchedPosts.length === 0) {
          setPosts([]);
          setBoardName(board_name || "게시판 이름");
        } else {
          setPosts(fetchedPosts.reverse());
          setBoardName(board_name || "게시판 이름");
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setPosts([]);
          setBoardName("게시판 이름");
        } else {
          console.error("게시물 불러오기 오류:", err);
          Alert.alert("오류", "게시물을 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [id]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("BoardList");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("PostDetail", { post_id: item._id, board_id: id })}
    >
      <Text style={styles.cardTitle}>{item.post_title || "제목 없음"}</Text>
      <Text style={styles.cardDescription}>
        {item.post_content ? item.post_content.slice(0, 50) : "내용이 없습니다."}...
      </Text>
      <View style={styles.postInfo}>
        <Text style={styles.viewCount}>조회수: {item.view_count || 0}</Text>
        <Text style={styles.date}>
          {item.created_at
            ? new Date(item.created_at).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            : "날짜 없음"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{boardName || "게시판 이름"}</Text>
      {loading ? (
        <Text style={styles.loadingText}>로딩 중...</Text>
      ) : (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("WritePost", { board_id: id })}
          >
            <Text style={styles.addButtonText}>게시물 작성</Text>
          </TouchableOpacity>
          {posts.length === 0 ? (
            <Text style={styles.emptyText}>게시물이 없습니다.</Text>
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => item._id}
              renderItem={renderPost}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 15,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: "NanumSquareRoundB",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "NanumSquareRoundB",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 16,
    fontFamily: "NanumSquareRoundR",
    color: "#666666",
  },
  postInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  viewCount: {
    fontSize: 14,
    color: "#888888",
    fontFamily: "NanumSquareRoundR",
  },
  date: {
    fontSize: 14,
    color: "#888888",
    fontFamily: "NanumSquareRoundR",
  },
  emptyText: {
    textAlign: "center",
    color: "#666666",
    fontFamily: "NanumSquareRoundR",
    marginTop: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666666",
    fontFamily: "NanumSquareRoundR",
  },
  addButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "NanumSquareRoundR",
  },
});

export default PostList;
