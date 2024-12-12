import React, { useEffect, useState } from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Chat from "./screens/Chat";
import HospitalInfo from "./screens/HospitalInfo";
import BoardList from "./screens/BoardList";
import PostList from "./screens/PostList";
import PostDetail from "./screens/PostDetail";
import Profile from "./screens/Profile";
import * as SecureStore from "expo-secure-store";
import { Text, View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder 컴포넌트 (화면 준비 중일 때 사용)
const Placeholder = ({ name }: { name: string }) => (
  <View style={styles.placeholder}>
    <Text>{name} 화면</Text>
  </View>
);

// 탭 네비게이터 (채팅, 병원 정보, 커뮤니티, 프로필)
const ChatTabs = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Chat"
      component={Chat}
      options={{
        headerShown: false,
        tabBarIcon: () => <Icon name="comments" size={20} color="#000" />,
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontFamily: "NanumSquareRoundR", color: focused ? "#0070FF" : "#000" }}>
            채팅
          </Text>
        ),
      }}
    />
    <Tab.Screen
      name="HospitalInfo"
      component={HospitalInfo || (() => <Placeholder name="병원 정보" />)}
      options={{
        headerShown: false,
        tabBarIcon: () => <Icon name="hospital-o" size={20} color="#000" />,
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontFamily: "NanumSquareRoundR", color: focused ? "#0070FF" : "#000" }}>
            병원 정보
          </Text>
        ),
      }}
    />
    <Tab.Screen
      name="Community"
      component={CommunityStack} // CommunityStack으로 연결
      options={{
        headerShown: false,
        tabBarIcon: () => <Icon name="users" size={20} color="#000" />,
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontFamily: "NanumSquareRoundR", color: focused ? "#0070FF" : "#000" }}>
            커뮤니티
          </Text>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={Profile || (() => <Placeholder name="프로필" />)}
      options={{
        headerShown: false,
        tabBarIcon: () => <Icon name="user" size={20} color="#000" />,
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontFamily: "NanumSquareRoundR", color: focused ? "#0070FF" : "#000" }}>
            프로필
          </Text>
        ),
      }}
    />
  </Tab.Navigator>
);

// 커뮤니티 스택 네비게이터
const CommunityStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BoardList"
      component={BoardList}
      options={{ title: "게시판 목록", headerShown: false }}
    />
    <Stack.Screen
      name="PostList"
      component={PostList}
      options={{ title: "게시물 목록", headerShown: false }}
    />
    <Stack.Screen
      name="PostDetail"
      component={PostDetail}
      options={{ title: "게시물", headerShown: false }}
    />
  </Stack.Navigator>
);

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync("token");
      console.log("토큰:", token);
      setInitialRoute(token ? "ChatTabs" : "Landing");
    };
    checkToken();
  }, []);

  if (initialRoute === null) {
    return null; // 로딩 중 표시
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Landing" component={Landing} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="ChatTabs" component={ChatTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
});
