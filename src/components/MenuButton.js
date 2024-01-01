import React from 'react';
import {Dimensions, Pressable, StyleSheet, Text} from 'react-native';

const MenuButton = ({onPress, title}) => {
  return (
    <>
      <Pressable style={styles.btnContainer} onPress={onPress}>
        <Text style={styles.btnText}>{title}</Text>
      </Pressable>
    </>
  );
};

export default MenuButton;

const styles = StyleSheet.create({
  btnContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    fontWeight: '600',
    width: Dimensions.get('window').width - 35,
    paddingVertical: 15,
    backgroundColor: '#86B6F6',
    borderRadius: 10,
    color: 'white',
    marginTop: 15,
    textAlign: 'center',
  },
});
