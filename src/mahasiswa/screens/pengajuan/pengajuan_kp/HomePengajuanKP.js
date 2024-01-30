import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
} from 'react-native-alert-notification';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Logo from '../../../../assets/pengajuan_kp.svg';

const HomePengajuanKP = ({navigation}) => {
  const [userPengajuanData, setUserPengajuanData] = useState([]);
  const [jadwalPengajuanData, setJadwalPengajuanData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchJadwal = firestore()
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

    fetchData();
    return () => fetchJadwal();
  }, [fetchData, isFocused]);

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    fetchData().then(() => setIsRefreshing(false));
  }, [fetchData]);

  const fetchData = React.useCallback(async () => {
    const user = auth().currentUser;
    try {
      await firestore()
        .collection('pengajuan')
        .where('mahasiswa_uid', '==', user.uid)
        .where('jenisPengajuan', '==', 'Kerja Praktek')
        .get()
        .then(querySnapshot => {
          const data = [];
          querySnapshot.forEach(doc => {
            data.push({id: doc.id, ...doc.data()});
          });
          setUserPengajuanData(data);
        });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleNavigateToCreatePengajuanKP = () => {
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
        navigation.navigate('CreatePengajuanKP');
      }
    }
  };

  const handleDetailPress = itemId => {
    navigation.navigate('DetailPengajuanKP', {itemId});
  };

  const renderPengajuanItem = ({item}) => (
    <View key={item.id} style={styles.card}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={styles.cardTopTitle}>Judul</Text>
        <View style={styles.cardStatus}>
          {item.status === 'Belum Diverifikasi' && (
            <Icon name="hourglass-half" size={30} color="#F6C358" />
          )}
          {item.status === 'Sah' && (
            <Icon name="square-check" size={30} color="#176B87" />
          )}
          {item.status === 'Ditolak' && (
            <Icon name="times-circle" size={30} color="#BF3131" />
          )}
        </View>
      </View>
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
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#176B87" />
      </View>
    );
  }

  return (
    <AlertNotificationRoot>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Pengajuan Kerja Praktek</Text>
          <Logo width={300} height={200} style={{alignSelf: 'center'}} />
        </View>
        {userPengajuanData.length > 0 ? (
          <FlatList
            style={styles.scrollContainer}
            data={userPengajuanData}
            keyExtractor={item => item.id}
            renderItem={renderPengajuanItem}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#176B87']}
              />
            }
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>Belum ada Pengajuan</Text>
          </View>
        )}
        <View style={styles.wrapperButton}>
          <Pressable
            style={styles.floatingButton}
            onPress={handleNavigateToCreatePengajuanKP}>
            <Text style={{color: 'white', fontSize: 18}}>Buat Pengajuan</Text>
          </Pressable>
        </View>
      </View>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    minHeight: 275,
    backgroundColor: '#176B87',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: 'white',
    textAlign: 'center',
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
    borderColor: '#EEF5FF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 20,
    marginTop: 5,
    color: '#6F7789',
  },
  cardTopTitle: {
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#176B87',
    marginTop: 20,
  },
  cardStatus: {
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  titleData: {
    fontSize: 20,
    padding: 10,
    textAlign: 'center',
    color: 'white',
  },

  detailButton: {
    backgroundColor: '#86B6F6',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    elevation: 2,
  },
  detailButtonText: {
    fontSize: 18,
    fontWeight: '600',
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
    backgroundColor: '#176B87',
    borderRadius: 8,
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
