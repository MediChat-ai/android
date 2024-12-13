import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import * as Font from 'expo-font';
import Icon from "react-native-vector-icons/Ionicons";

const backendURI = "https://api.medichat.site";

const PostDetail = ({ route }: { route: any }) => {
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const [fontLoading, setFontLoading] = useState(false);
  const [editingComment, setEditingComment] = useState({ id: "", content: "" });
  const [inputHeight, setInputHeight] = useState(40);
  const [editingPost, setEditingPost] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [editedPostTitle, setEditedPostTitle] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  const { board_id, post_id } = route.params;

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

  const fetchPostAndComments = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("로그인이 필요합니다.");

      const postResponse = await axios.get(
        `${backendURI}/community/getPostList?board_id=${board_id}&id=${post_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fetchedPost = postResponse.data.posts;
      setPost(fetchedPost);

      const commentsResponse = await axios.get(
        `${backendURI}/community/getCommentList?post_id=${post_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(commentsResponse.data.comments);

      const decodedToken: any = JSON.parse(atob(token.split(".")[1]));
      setIsAuthor(decodedToken.user_name === fetchedPost.author_name);
      setCurrentUser(decodedToken.user_name);
    } catch (err) {
      console.error("불러오기 실패:", err);
      Alert.alert("오류", "데이터를 불러오는 중 문제가 발생했습니다.");
    }
  };
  const editPost = async () => {
    if (!editedPostTitle.trim() || !editedPostContent.trim()) {
      Alert.alert("오류", "제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("로그인이 필요합니다.");

      await axios.put(
        `${backendURI}/community/editPost`,
        { 
          post_id, 
          title: editedPostTitle,
          content: editedPostContent, 
          token 
        },
      );

      setEditingPost(false);
      fetchPostAndComments();
    } catch (err) {
      console.error("게시물 수정 실패:", err);
      Alert.alert("오류", "게시물 수정 중 문제가 발생했습니다.");
    }
  };

  const deletePost = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("로그인이 필요합니다.");

      await axios.delete(`${backendURI}/community/deletePost`, {
        data: { post_id, token },
      });

      Alert.alert("완료", "게���물이 삭제되었습니다.", [{ text: "확인", onPress: () => console.log("Navigate to list") }]);
    } catch (err) {
      console.error("게시물 삭제 실패:", err);
      Alert.alert("오류", "게시물 삭제 중 문제가 발생했습니다.");
    }
  };


  const addComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("오류", "댓글을 입력해주세요.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("로그인이 필요합니다.");

      await axios.post(
        `${backendURI}/community/writeComment`,
        { post_id, content: newComment, token },
      );

      setNewComment("");
      fetchPostAndComments();
    } catch (err) {
      console.error("댓글 추가 실패:", err);
      Alert.alert("오류", "댓글 작성 중 문제가 발생했습니다.");
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("로그인이 필요합니다.");

      await axios.delete(`${backendURI}/community/deleteComment`, {
        data: { comment_id: commentId, token },
      });

      fetchPostAndComments();
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      Alert.alert("오류", "댓글 삭제 중 문제가 발생했습니다.");
    }
  };

  const editComment = async () => {
    if (!editingComment.content.trim()) {
      Alert.alert("오류", "댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");
      if (!token) throw new Error("로그인이 필요합니다.");

      await axios.put(
        `${backendURI}/community/editComment`,
        { comment_id: editingComment.id, content: editingComment.content, token },
      );

      setEditingComment({ id: "", content: "" });
      fetchPostAndComments();
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      Alert.alert("오류", "댓글 수정 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, []);

  if (!post) {
    return (
      <View style={styles.spinnerContainer}>
        <Text style={styles.spinnerText}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.postContainer}>
        {editingPost ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="제목을 입력하세요"
              value={editedPostTitle}
              onChangeText={setEditedPostTitle}
            />
            <TextInput
              style={[styles.input, { height: Math.max(40, inputHeight) }]}
              placeholder="게시물 내용을 입력하세요"
              value={editedPostContent}
              onChangeText={setEditedPostContent}
              multiline={true}
              onContentSizeChange={(e) =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
            />
            <TouchableOpacity onPress={editPost} style={styles.button}>
              <Text style={styles.buttonText}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditingPost(false)}
              style={[styles.button, { backgroundColor: "gray" }]}
            >
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>{post.post_title}</Text>
            <Text style={styles.author}>
              작성자: {post.author_name} | 작성 시간: {new Date(post.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
            </Text>
            <View style={styles.iconContainer}>
              {isAuthor && (
                <>
                  <Icon
                    name="create-outline"
                    size={24}
                    color="#007bff"
                    onPress={() => {
                      setEditedPostTitle(post.post_title);
                      setEditedPostContent(post.post_content);
                      setEditingPost(true);
                    }}
                    style={styles.icon}
                  />
                  <Icon
                    name="trash-outline"
                    size={24}
                    color="red"
                    onPress={() => {
                      Alert.alert(
                        "게시물 삭제",
                        "게시물을 삭제하시겠습니까?",
                        [
                          { text: "취소", style: "cancel" },
                          { text: "삭제", onPress: deletePost, style: "destructive" },
                        ]
                      );
                    }}
                    style={styles.icon}
                  />
                </>
              )}
            </View>
            <Text style={styles.content}>{post.post_content}</Text>
          </>
        )}
      </View>

      <Text style={styles.commentsTitle}>댓글</Text>
      <View style={styles.addCommentSection}>
        <Text style={styles.addCommentTitle}>댓글 작성</Text>
        <TextInput
          style={[styles.input, { height: Math.max(40, inputHeight) }]}
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChangeText={setNewComment}
          multiline={true}
          onContentSizeChange={(e) =>
            setInputHeight(e.nativeEvent.contentSize.height)
          }
        />
        <TouchableOpacity onPress={addComment} style={styles.button}>
          <Text style={styles.buttonText}>댓글 등록</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.commentsSection}>
        {comments.map((comment) => (
          <View key={comment._id} style={styles.commentContainer}>
            {editingComment.id === comment._id ? (
              <>
                <TextInput
                  placeholder="댓글 내용을 입력하세요"
                  value={editingComment.content}
                  onChangeText={(text) =>
                    setEditingComment((prev) => ({ ...prev, content: text }))
                  }
                  multiline={true}
                  numberOfLines={4}
                  style={[styles.input, { height: Math.max(40, inputHeight) }]}
                />
                <TouchableOpacity onPress={editComment} style={styles.button}>
                  <Text style={styles.buttonText}>저장</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setEditingComment({ id: "", content: "" })}
                  style={[styles.button, { backgroundColor: "gray" }]}
                >
                  <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAuthor}>
                    {comment.author_name}{" "}
                    {new Date(comment.created_at).toLocaleString("ko-KR", {
                      timeZone: "Asia/Seoul",
                    })}
                  </Text>
                  {comment.author_name === currentUser && (
                    <View style={styles.iconContainer}>
                      <Icon
                        name="create-outline"
                        size={20}
                        color="#007bff"
                        onPress={() =>
                          setEditingComment({ id: comment._id, content: comment.content })
                        }
                        style={styles.icon}
                      />
                      <Icon
                        name="trash-outline"
                        size={20}
                        color="red"
                        onPress={() => {
                          Alert.alert(
                            "댓글 삭제",
                            "댓글을 삭제하시겠습니까?",
                            [
                              { text: "취소", style: "cancel" },
                              {
                                text: "삭제",
                                onPress: () => deleteComment(comment._id),
                                style: "destructive",
                              },
                            ]
                          );
                        }}
                        style={styles.icon}
                      />
                    </View>
                  )}
                </View>
                <Text style={styles.commentContent}>{comment.content}</Text>
              </>
            )}

          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
    backgroundColor: "#ffffff",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  spinnerText: {
    fontSize: 16,
    color: "#555",
    fontFamily: 'NanumSquareRoundR',
  },
  postContainer: {
    padding: 0,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontFamily: 'NanumSquareRoundB',
  },
  author: {
    fontSize: 14,
    marginBottom: 30,
    fontFamily: 'NanumSquareRoundR',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  commentsSection: {
    marginTop: 16,
  },
  commentsTitle: {
    fontSize: 20,
    marginBottom: 8,
    fontFamily: 'NanumSquareRoundB',
  },
  commentContainer: {
    padding: 12,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  commentAuthor: {
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'NanumSquareRoundR',
  },
  commentContent: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'NanumSquareRoundR',
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addCommentSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
  },
  addCommentTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'NanumSquareRoundR',
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: "#ffffff",
    fontFamily: 'NanumSquareRoundR',
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 8,
  },
  button: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#ffffff",
    fontFamily: 'NanumSquareRoundR',
    fontSize: 16,
  },
});

export default PostDetail;
