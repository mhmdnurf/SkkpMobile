import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

export default function DataPendaftar() {
  const [totalPendaftarKP, setTotalPendaftarKP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPendaftarKP = async () => {
      try {
        const querySnapshot = await firestore()
          .collection('pengajuan')
          .where('jenisProporsal', '==', 'KP')
          .get();

        const totalPendaftar = querySnapshot.size;
        setTotalPendaftarKP(totalPendaftar);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    const unsubscribe = firestore()
      .collection('pengajuan')
      .where('jenisProporsal', '==', 'KP')
      .onSnapshot(snapshot => {
        const totalPendaftar = snapshot.size;
        setTotalPendaftarKP(totalPendaftar);
      });

    fetchPendaftarKP();
    return () => {
      unsubscribe();
    };
  }, []);

  const data = [
    {
      title: 'Pendaftar Sidang KP',
      number: isLoading ? 'Loading...' : totalPendaftarKP.toString(),
    },
    {
      title: 'Pendaftar Sempro',
      number: isLoading ? 'Loading...' : totalPendaftarKP.toString(),
    },
    {
      title: 'Pendaftar Sidang Komprehensif',
      number: isLoading ? 'Loading...' : totalPendaftarKP.toString(),
    },
    {
      title: 'Pendaftar Sidang Akhir',
      number: isLoading ? 'Loading...' : totalPendaftarKP.toString(),
    },
  ];

  const renderItem = ({item}) => (
    <View style={styles.boxContainer}>
      <View style={{alignItems: 'flex-start'}}>
        <Icon name="user" size={48} color="#A0E4CB" />
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text style={styles.textTitle}>{item.title}</Text>
        <Text style={styles.textNumber}>{item.number}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      horizontal
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    marginLeft: 16,
    padding: 16,
    backgroundColor: 'white',
    width: 300,
    height: 150,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 10,
  },
  textTitle: {fontSize: 24, color: '#0D4C92', fontWeight: 'bold'},
  textNumber: {fontSize: 36, color: '#0D4C92', fontWeight: 'bold'},
});
