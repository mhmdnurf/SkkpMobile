import React from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

const InputField = ({value, onChangeText, placeholder, label, editable}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.inputEmail}
        placeholder={placeholder}
        placeholderTextColor="#6F7789"
        onChangeText={onChangeText}
        value={value}
        editable={editable}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 20,
  },
  inputEmail: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#176B87',
    borderRadius: 5,
    paddingHorizontal: 20,
    color: 'black',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#176B87',
    marginBottom: 10,
  },
});
