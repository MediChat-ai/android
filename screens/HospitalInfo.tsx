import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import * as Font from 'expo-font';

const BACKEND_URI = 'https:/api.medichat.site';

const HospitalSearch = () => {
  const [fontLoading, setFontLoading] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { value: '', label: '진료과목 선택' },
    { value: "00", label: "일반의" },
    { value: "01", label: "내과" },
    { value: "02", label: "신경과" },
    { value: "03", label: "정신건강의학과" },
    { value: "04", label: "외과" },
    { value: "05", label: "정형외과" },
    { value: "06", label: "신경외과" },
    { value: "07", label: "심장혈관흉부외과" },
    { value: "08", label: "성형외과" },
    { value: "09", label: "마취통증의학과" },
    { value: "10", label: "산부인과" },
    { value: "11", label: "소아청소년과" },
    { value: "12", label: "안과" },
    { value: "13", label: "이비인후과" },
    { value: "14", label: "피부과" },
    { value: "15", label: "비뇨의학과" },
    { value: "16", label: "영상의학과" },
    { value: "17", label: "방사선종양학과" },
    { value: "18", label: "병리과" },
    { value: "19", label: "진단검사의학과" },
    { value: "20", label: "결핵과" },
    { value: "21", label: "재활의학과" },
    { value: "22", label: "핵의학과" },
    { value: "23", label: "가정의학과" },
    { value: "24", label: "응급의학과" },
    { value: "25", label: "직업환경의학과" },
    { value: "26", label: "예방의학과" },
    { value: "27", label: "기타1(치과)" },
    { value: "28", label: "기타4(한방)" },
    { value: "31", label: "기타2" },
    { value: "40", label: "기타2(2)" },
    { value: "41", label: "보건" },
    { value: "42", label: "기타3" },
    { value: "43", label: "보건기관치과" },
    { value: "44", label: "보건기관한방" },
    { value: "49", label: "치과" },
    { value: "50", label: "구강악안면외과" },
    { value: "51", label: "치과보철과" },
    { value: "52", label: "치과교정과" },
    { value: "53", label: "소아치과" },
    { value: "54", label: "치주과" },
    { value: "55", label: "치과보존과" },
    { value: "56", label: "구강내과" },
    { value: "57", label: "영상치의학과" },
    { value: "58", label: "구강병리과" },
    { value: "59", label: "예방치과" },
    { value: "60", label: "치과소계" },
    { value: "61", label: "통합치의학과" },
    { value: "80", label: "한방내과" },
    { value: "81", label: "한방부인과" },
    { value: "82", label: "한방소아과" },
    { value: "83", label: "한방안·이비인후·피부과" },
    { value: "84", label: "한방신경정신과" },
    { value: "85", label: "침구과" },
    { value: "86", label: "한방재활의학과" },
    { value: "87", label: "사상체질과" },
    { value: "88", label: "한방응급" },
    // { value: "89", label: "한방응급" },
    { value: "90", label: "한방소계" }
    // 추가적인 진료과목 데이터 생략...
  ]);

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

  const handleSearch = async () => {
    setError('');
    setLoading(true);

    if (!searchName.trim()) {
      setError('병원명을 입력해주세요.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URI}/hospital/getHospList`, {
        params: {
          name: searchName,
          pageNo: 1,
          subjectCode: selectedSubjectCode || undefined,
        },
      });

      const items = response.data.response.body.items.item;

      if (Array.isArray(items)) {
        setHospitals(items);
      } else if (items) {
        setHospitals([items]);
      } else {
        setHospitals([]);
        setError('검색 결과가 없습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('병원 정보를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.hospitalItem}>
      <Text style={styles.hospitalName}>{item.yadmNm}</Text>
      <Text style={styles.hospitalLocation}>
        {item.sgguCdNm} {item.emdongNm}
      </Text>
    </View>
  );

  return (
    fontLoading && (
      <View style={styles.container}>
        <Text style={styles.title}>병원 검색</Text>
        <TextInput
          style={styles.input}
          placeholder="병원명 입력"
          value={searchName}
          onChangeText={setSearchName}
        />
        <View style={styles.row}>
          <View style={styles.dropdownWrapper}>
            <DropDownPicker
              open={open}
              value={selectedSubjectCode}
              items={items}
              setOpen={setOpen}
              setValue={setSelectedSubjectCode}
              setItems={setItems}
              placeholder="진료과목 선택"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              dropDownContainerStyle={styles.dropdownBox}
            />
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>검색</Text>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size="large" color="#0070FF" />}
        {error && <Text style={styles.error}>{error}</Text>}
        <FlatList
          data={hospitals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            !loading && !error && (
              <Text style={styles.noResults}>검색 결과가 없습니다.</Text>
            )
          }
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
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'NanumSquareRoundB',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'NanumSquareRoundR',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dropdownWrapper: {
    flex: 1,
    marginRight: 10,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
    borderRadius: 10,
  },
  dropdownText: {
    fontFamily: 'NanumSquareRoundR',
    fontSize: 16,
  },
  dropdownBox: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CCCCCC',
  },
  searchButton: {
    backgroundColor: '#0070FF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'NanumSquareRoundR',
  },
  hospitalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  hospitalName: {
    fontSize: 18,
    fontFamily: 'NanumSquareRoundR',
  },
  hospitalLocation: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'NanumSquareRoundR',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'NanumSquareRoundR',
  },
  noResults: {
    textAlign: 'center',
    color: '#666666',
    marginTop: 20,
    fontFamily: 'NanumSquareRoundR',
  },
});

export default HospitalSearch;
