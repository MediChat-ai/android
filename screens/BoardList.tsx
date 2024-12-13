import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert, BackHandler } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import * as Font from 'expo-font';

const backendURI = 'https://api.medichat.site';

const BoardList = ({ navigation }) => {
  const [boardList, setBoardList] = useState([]);
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
    const fetchBoardList = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        try {
          const response = await axios.get(`${backendURI}/community/getBoardList`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setBoardList(response.data.boards);
          } else {
            Alert.alert('오류', response.data.error || '데이터를 불러오지 못했습니다.');
          }
        } catch (error) {
          console.error('데이터 가져오기 실패:', error);
          Alert.alert('오류', '데이터를 가져오는 데 실패했습니다.');
        }
      } else {
        Alert.alert('로그인 필요', '로그인이 필요합니다.');
        navigation.navigate('Login');
      }
    };
    fetchBoardList();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert("MediChat 종료", "앱을 종료하시겠습니까?", [
          {
            text: "취소",
            onPress: () => null,
            style: "cancel"
          },
          { text: "확인", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
      }
    );

    return () => backHandler.remove();
  }, []);

  const renderBoard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PostList', { id: item._id })}
    >
      <Image source={{ uri: item.cover_url }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    fontLoading && (
      <View style={styles.container}>
        <Text style={styles.title}>게시판 목록</Text>
        <FlatList
          data={boardList}
          keyExtractor={(item) => item._id}
          renderItem={renderBoard}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>게시판이 없습니다.</Text>}
        />
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontFamily: 'NanumSquareRoundB',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  image: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'NanumSquareRoundB',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'NanumSquareRoundR',
    color: '#666666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666666',
    fontFamily: 'NanumSquareRoundR',
    marginTop: 20,
  },
});

export default BoardList;
