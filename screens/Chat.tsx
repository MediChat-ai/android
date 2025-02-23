import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import * as Font from 'expo-font';
import { GROQ_API_KEY } from '@env';

const ChatScreen = () => {
  const [fontLoading, setFontLoading] = useState(false)

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
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '안녕하세요! 저는 MediChat AI입니다. 무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemma2-9b-it');
  const [modelName, setModelName] = useState('gemma2-9b-it');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownItems] = useState([
    { label: 'gemma2-9b-it', value: 'gemma2-9b-it' },
    { label: 'deepseek-r1-distill-llama-70b', value: 'deepseek-r1-distill-llama-70b' },
    { label: 'llama3-8b-8192', value: 'llama3-8b-8192' },
    { label: 'llama-3.3-70b-specdec', value: 'llama-3.3-70b-specdec' },
    { label: 'mixtral-8x7b-32768', value: 'mixtral-8x7b-32768' },
  ]);
  const chatBoxRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setLoading(true);
    setInput('');

    try {
      console.log(modelName);
      let aiResponse = '';
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: modelName,
          messages: [
            { role: 'system', content: '당신은 친절한 의료 상담 AI입니다. 한국어로 답변해주세요.' },
            { role: 'user', content: input },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      aiResponse = response.data.choices[0].message.content;

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error: unknown) {
      console.error('Error:', (error as any).response?.data || (error as any).message);
      setMessages((prev) => [...prev, { sender: 'ai', text: '오류가 발생했습니다. 다시 시도해주세요.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      chatBoxRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={dropdownOpen}
          value={selectedModel}
          items={dropdownItems}
          setOpen={setDropdownOpen}
          setValue={setSelectedModel}
          // onChangeValue={(value) => setModelName(value === '정확하지만 느림' ? 0 : 1)}
          onChangeValue={(value) => setModelName(value)}
          textStyle={{ fontFamily: 'NanumSquareRoundR', fontSize: 16, }}
        />
      </View>

      <FlatList
        ref={chatBoxRef}
        data={loading ? [...messages, { sender: 'ai', text: '로딩 중...' }] : messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
            {item.text === '로딩 중...' ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0070FF" />
                <Text>로딩 중...</Text>
              </View>
            ) : (
              <Text style={styles.messageText}>{item.text}</Text>
            )}
          </View>
        )}
        contentContainerStyle={styles.chatBox}
        onContentSizeChange={() => chatBoxRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요."
          value={input}
          onChangeText={setInput}
          editable={!loading}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendButtonText}>{loading ? '전송 중...' : '전송'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
  },
  dropdownContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'NanumSquareRoundR',
  },
  chatBox: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginRight: 10,
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  sendButton: {
    backgroundColor: '#0070FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontFamily: 'NanumSquareRoundR',
    fontSize: 16,
  },
});

export default ChatScreen;
