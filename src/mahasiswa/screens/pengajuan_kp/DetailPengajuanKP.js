import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DetailPengajuanKP = ({route, navigation}) => {
  const {itemId} = route.params;
  const [pengajuanData, setPengajuanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pengajuan')
      .doc(itemId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setPengajuanData(documentSnapshot.data());
        } else {
          console.log('Pengajuan tidak ditemukan');
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error mengambil data pengajuan:', error);
        setIsLoading(false);
      });

    return () => unsubscribe();
  }, [itemId]);

  const handleEditButtonPress = () => {
    navigation.navigate('EditPengajuanKP', {itemId});
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detail Pengajuan KP</Text>
      {pengajuanData ? (
        <View style={styles.detailContainer}>
          <Text style={styles.detailText}>Judul: {pengajuanData.judul}</Text>
          <Text style={styles.detailText}>Status: {pengajuanData.status}</Text>
          <Text style={styles.detailText}>
            Jenis Proposal: {pengajuanData.jenisProporsal}
          </Text>
          {/* ... Tambahkan properti lainnya sesuai kebutuhan */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditButtonPress}>
            <Text style={styles.editButtonText}>Edit Pengajuan</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Data pengajuan tidak ditemukan.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  editButton: {
    marginTop: 20,
    backgroundColor: '#59C1BD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetailPengajuanKP;
