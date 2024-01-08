import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Header = ({title}) => {
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    marginVertical: 20,
  },
  headerText: {
    fontSize: 24,
    marginHorizontal: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
    color: '#6F7789',
  },
});
