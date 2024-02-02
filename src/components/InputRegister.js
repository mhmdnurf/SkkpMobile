import React from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';

const InputRegister = ({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry,
}) => {
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={'#6F7789'}
      />
    </>
  );
};

export default InputRegister;

const styles = StyleSheet.create({
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#176B87',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    color: 'black',
  },
});
