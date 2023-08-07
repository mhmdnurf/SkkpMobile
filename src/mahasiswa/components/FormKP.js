import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';

const transkipNilai = ({value, onPress}) => {
  <View style={styles.uploadContainer}>
    <TextInput
      style={styles.fileNameInput}
      placeholder="..."
      value={value}
      editable={false}
    />
    <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
      <Text style={styles.uploadButtonText}>Upload File</Text>
    </TouchableOpacity>
  </View>;
};

const FormKP = () => {
  return <transkipNilai />;
};

export default FormKP;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fileNameInput: {
    flex: 1,
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: '#1D2D50',
    padding: 15,
    marginLeft: 5,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
