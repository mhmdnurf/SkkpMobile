import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Button,
  Pressable,
  Alert,
} from 'react-native';
import Header from '../../../../components/Header';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';

const CreatePengajuanKP = () => {
  const [judul, setJudul] = React.useState('');
  const [listPersyaratan, setListPersyaratan] = React.useState([]);
  const [selectedPersyaratan, setSelectedPersyaratan] = React.useState('');
  const [uploadedFiles, setUploadedFiles] = React.useState([]);

  React.useEffect(() => {
    fetchPersyaratan();
  }, [fetchPersyaratan]);

  const fetchPersyaratan = React.useCallback(async () => {
    try {
      const query = firestore()
        .collection('persyaratan')
        .where('jenisPersyaratan', '==', 'Pengajuan Kerja Praktek')
        .get();
      const res = await query``;
      const data = res.docs.map(doc => doc.data().berkasPersyaratan).flat();
      setListPersyaratan(data);
      console.log(data);
    } catch {
      console.log('error');
    }
  }, []);

  const uploadFile = () => {
    if (uploadedFiles.includes(selectedPersyaratan)) {
      Alert.alert('File already uploaded');
    } else {
      setUploadedFiles([...uploadedFiles, selectedPersyaratan]);
    }
  };

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <Header title="Buat Pengajuan KP" />
        <Text style={styles.inputTitle}>
          Judul Kerja Praktek<Text style={{color: 'red'}}>*</Text>
        </Text>
        <TextInput
          placeholder="Masukkan Judul"
          style={[styles.input, styles.border]}
          multiline
          numberOfLines={3}
          value={judul}
          onChangeText={text => setJudul(text)}
        />
        <Text style={styles.inputTitle}>
          Upload Berkas Persyaratan<Text style={{color: 'red'}}>*</Text>
        </Text>
        <Picker
          selectedValue={selectedPersyaratan}
          style={{height: 50, width: '100%'}}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedPersyaratan(itemValue)
          }>
          {listPersyaratan.map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))}
        </Picker>
        <Pressable style={styles.btnSubmit} onPress={uploadFile}>
          <Text style={styles.btnText}>Upload</Text>
        </Pressable>
        <Text style={styles.inputTitle}>Berkas yang telah diupload</Text>
        {uploadedFiles.map((item, index) => (
          <Text key={index}>{item}</Text>
        ))}
        <Pressable style={styles.btnSubmit}>
          <Text style={styles.btnText}>Submit</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

export default CreatePengajuanKP;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6F7789',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  border: {
    borderWidth: 1,
    borderColor: 'grey',
  },
  btnSubmit: {
    backgroundColor: '#176B87',
    borderRadius: 10,
    padding: 13,
    marginBottom: 20,
    marginTop: 20,
    elevation: 5,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
