import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const InputField = ({
  value,
  onChangeText,
  placeholder,
  label,
  editable,
  secureTextEntry,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
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
        secureTextEntry={!isPasswordVisible}
      />
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={togglePasswordVisibility}>
        <View style={styles.checkbox}>
          {isPasswordVisible && <View style={styles.checkedCheckbox} />}
        </View>
        <Text style={styles.checkboxLabel}>Show Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 15,
  },
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#176B87',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    width: 12,
    height: 12,
    backgroundColor: '#176B87',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#176B87',
  },
});
