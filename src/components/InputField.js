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
  inputContainer: {},
  inputEmail: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#176B87',
    borderRadius: 15,
    color: 'black',
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#176B87',
    marginBottom: 10,
  },
});
