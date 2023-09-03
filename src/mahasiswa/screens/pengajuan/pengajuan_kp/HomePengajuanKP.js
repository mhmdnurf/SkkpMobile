import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from 'react-native-alert-notification';
import {useIsFocused} from '@react-navigation/native';

const HomePengajuanKP = ({navigation}) => {
  const [userPengajuanData, setUserPengajuanData] = useState([]);
  const [jadwalPengajuanData, setJadwalPengajuanData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const user = auth().currentUser;

    const unsubscribe = firestore()
      .collection('pengajuan')
      .where('user_uid', '==', user.uid)
      .where('jenisPengajuan', '==', 'Kerja Praktek')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          data.push({id: doc.id, ...doc.data()});
        });
        setUserPengajuanData(data);
        setIsLoading(false);
      });
    const unsubscribeJadwal = firestore()
      .collection('jadwalPengajuan')
      .where('status', '==', 'Aktif')
      .onSnapshot(querySnapshot => {
        const data = [];
        querySnapshot.forEach(doc => {
          const jadwalData = doc.data();
          if (jadwalData.jenisPengajuan.includes('Kerja Praktek')) {
            data.push(jadwalData);
          }
        });
        setJadwalPengajuanData(data);
        setIsLoading(false);
      });

    return () => {
      unsubscribe();
      unsubscribeJadwal();
    };
  }, [isFocused]);

  const handleNavigateToAddPengajuanKP = () => {
    const activeJadwal = jadwalPengajuanData.find(
      item =>
        item.status === 'Aktif' &&
        item.jenisPengajuan.includes('Kerja Praktek'),
    );
    if (!activeJadwal) {
      Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Peringatan',
        textBody: 'Pengajuan Kerja Praktek belum dibuka saat ini.',
        button: 'Tutup',
      });
    } else {
      const blockedStatuses = ['Belum Diverifikasi', 'Ditolak', 'Sah'];
      const hasBlockedStatus = userPengajuanData.some(item =>
        blockedStatuses.includes(item.status),
      );
      if (hasBlockedStatus) {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Peringatan',
          textBody:
            'Anda memiliki pengajuan yang sedang diproses. Tunggu hingga pengajuan sebelumnya selesai diproses sebelum membuat pengajuan baru.',
          button: 'Tutup',
        });
      } else {
        navigation.navigate('AddPengajuanKP');
      }
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
              item.status === 'Belum Diverifikasi'
                ? '#FFC436'
                : item.status === 'Sah'
                ? '#A0C49D'
                : item.status === 'Ditolak'
                ? '#f87171'
                : '#75C2F6',
          },
        ]}>
        {item.status}
      </Text>
      <Text style={styles.cardTopTitle}>Judul</Text>
      <Text style={styles.cardTitle}>{item.judul}</Text>
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => handleDetailPress(item.id)}>
        <Text style={styles.detailButtonText}>Detail</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        {userPengajuanData.length > 0 ? (
          <FlatList
            style={styles.scrollContainer}
            data={userPengajuanData}
            keyExtractor={item => item.id}
            renderItem={renderPengajuanItem}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Belum ada Pengajuan</Text>
          </View>
        )}
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleNavigateToAddPengajuanKP}>
            <Text style={{color: 'white', fontSize: 18}}>Buat Pengajuan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white',
  },
  scrollContainer: {
    marginTop: 30,
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
    borderWidth: 2,
    borderColor: 'whitesmoke',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 20,
    marginTop: 5,
    color: 'gray',
  },
  cardTopTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: 'black',
    marginTop: 20,
  },
  cardStatus: {
    fontWeight: 'bold',
    marginBottom: 10,
    padding: 5,
    width: 'auto',
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
    backgroundColor: '#7895CB',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  detailButtonText: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
  },
  wrapperButton: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 20,
  },
  floatingButton: {
    padding: 15,
    backgroundColor: '#7895CB',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'gray',
    fontWeight: 'bold',
  },
});

export default HomePengajuanKP;
