import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  View,
} from 'react-native';
import Header from '../../../../components/Header';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import BottomSpace from '../../../../components/BottomSpace';
import Icon from 'react-native-vector-icons/FontAwesome';

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
      const res = await query;
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

  const removeFile = fileRemove => {
    setUploadedFiles(uploadedFiles.filter(file => file !== fileRemove));
  };

  return (
    <>
      <ScrollView style={styles.mainContainer}>
        <Header title="Buat Pengajuan KP" />
        <Text style={styles.inputTitle}>
          Judul Kerja Praktek<Text style={{color: 'red'}}>*</Text>
        </Text>
        <TextInput
          placeholder="Sistem Informasi..."
          placeholderTextColor={'#6F7789'}
          style={[styles.input, styles.border]}
          multiline
          numberOfLines={3}
          value={judul}
          onChangeText={text => setJudul(text)}
        />
        <Text style={styles.inputTitle}>
          Upload Berkas Persyaratan<Text style={{color: 'red'}}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPersyaratan}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedPersyaratan(itemValue)
            }>
            {listPersyaratan.map((item, index) => (
              <Picker.Item
                style={styles.optionText}
                key={index}
                label={item}
                value={item}
              />
            ))}
          </Picker>
        </View>
        <Pressable style={styles.btnSubmit} onPress={uploadFile}>
          <Text style={styles.btnText}>Upload</Text>
        </Pressable>
        <Text style={styles.inputTitle}>Berkas yang telah diupload</Text>
        {uploadedFiles.map((item, index) => (
          <View key={index} style={styles.berkasContainer}>
            <Text style={styles.selectText}>{item}</Text>
            <Pressable onPress={() => removeFile(item)}>
              <Icon
                name="times"
                style={styles.iconRemove}
                size={25}
                color="#EF4040"
              />
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.btnSubmit}>
          <Text style={styles.btnText}>Submit</Text>
        </Pressable>
        <BottomSpace marginBottom={40} />
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
    borderColor: '#176B87',
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
  selectText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  optionText: {
    fontSize: 16,
    color: '#6F7789',
    fontWeight: '600',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#176B87',
    borderRadius: 5,
    marginBottom: 10,
  },
  berkasContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#86B6F6',
    borderRadius: 5,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRemove: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'white',
  },
});
