import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const EditPengajuanKP = ({route, navigation}) => {
  const {itemId} = route.params;
  console.log(itemId);

  const user = auth().currentUser;
  const handleSaveButtonPress = async () => {
    try {
      await firestore().collection('pengajuan').doc(itemId).update({
        createdAt: 20,
        createdBy: user.uid,
        dokumenProporsal: 1,
        formKrs: 2,
        formPendaftaranKP: 3,
        jenisProporsal: 4,
        judul: 1000,
        slipPembayaranKP: 6,
        status: 7,
        transkipNilai: 10,
      });

      Alert.alert('Sukses', 'Data pengajuan berhasil diubah');
      navigation.navigate('Pengajuan');
    } catch (error) {
      console.error('Error mengubah data pengajuan:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat mengubah data pengajuan');
    }
  };
  const handleDeleteButtonPress = async () => {
    try {
      await firestore().collection('pengajuan').doc(itemId).delete();
      Alert.alert('Sukses', 'Data pengajuan berhasil dihapus');
      navigation.navigate('Pengajuan');
    } catch (error) {
      console.error('Error menghapus data pengajuan:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat menghapus data pengajuan');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Pengajuan KP</Text>
      {/* <TextInput
        style={styles.input}
        placeholder="Masukkan Judul"
        value={judul}
        onChangeText={text => setJudul(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Masukkan Jenis Proposal"
        value={jenisProporsal}
        onChangeText={text => setJenisProporsal(text)}
      /> */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={handleSaveButtonPress}>
        <Text style={styles.editButtonText}>Simpan Perubahan</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteButtonPress}>
        <Text style={styles.deleteButtonText}>Hapus Pengajuan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#FF5733',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditPengajuanKP;
