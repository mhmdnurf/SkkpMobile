import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HomePengajuanKP = ({navigation}) => {
  const [userPengajuanData, setUserPengajuanData] = useState([]);

  useEffect(() => {
    const user = auth().currentUser;

    const unsubscribe = firestore()
      .collection('pengajuan')
      .where('createdBy', '==', user.uid)
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
        });
        setUserPengajuanData(data);
      });

    return () => unsubscribe();
  }, []);

  const handleNavigateToAddPengajuanKP = () => {
    const blockedStatuses = ['Diproses', 'Revisi', 'Sah'];
    const hasBlockedStatus = userPengajuanData.some(item =>
      blockedStatuses.includes(item.status),
    );
    if (hasBlockedStatus) {
      // Menampilkan pesan peringatan jika ada pengajuan yang sedang diproses
      Alert.alert(
        'Peringatan',
        'Anda memiliki pengajuan yang sedang diproses. Tunggu hingga pengajuan sebelumnya selesai diproses sebelum membuat pengajuan baru.',
      );
    } else {
      navigation.navigate('AddPengajuanKP');
    }
  };

  const handleDetailPress = itemId => {
    navigation.navigate('DetailPengajuanKP', {itemId});
  };

  const renderPengajuanItem = ({item}) => (
    <View key={item.id} style={styles.card}>
      <Text
        style={[
          styles.cardStatus,
          {
            backgroundColor:
              item.status === 'Diproses'
                ? '#75C2F6'
                : item.status === 'Sah'
                ? '#AAFCA5'
                : item.status === 'Revisi'
                ? '#F7E987'
                : '#75C2F6', // Warna default jika status tidak sesuai
          },
        ]}>
        {item.status}
      </Text>
      <Text style={styles.cardTitle}>{item.judul}</Text>
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => handleDetailPress(item.id)}>
        <Text style={styles.detailButtonText}>Detail</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleNavigateToAddPengajuanKP}>
          <Text style={styles.textAddButton}>Buat Pengajuan KP</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.scrollContainer}
        data={userPengajuanData}
        keyExtractor={item => item.id}
        renderItem={renderPengajuanItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#CFF5E7',
  },
  addButton: {
    backgroundColor: '#59C1BD',
    padding: 10,
    width: '50%',
    margin: 10,
    marginBottom: 25,
    marginTop: 15,
    borderRadius: 5,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 5,
  },
  textAddButton: {
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: 'black',
  },
  cardStatus: {
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
    maxHeight: 30,
    maxWidth: 80,
    textAlign: 'center',
    borderRadius: 10,
    color: 'white',
  },
  titleData: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
    color: 'white',
  },
  detailButton: {
    backgroundColor: '#59C1BD',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  detailButtonText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
});

export default HomePengajuanKP;
