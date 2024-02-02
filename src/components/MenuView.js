import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const MenuView = ({mainTitle, secondTitle, SvgComponent}) => {
  return (
    <>
      <View>
        <Text style={styles.mainTitle}>{mainTitle}</Text>
        <View style={styles.svgContainer}>
          <SvgComponent width={320} height={241} />
        </View>
        <Text style={styles.secondTitle}>{secondTitle}</Text>
      </View>
    </>
  );
};

export default MenuView;

const styles = StyleSheet.create({
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 48,
    textAlign: 'center',
    color: '#6F7789',
  },
  svgContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  secondTitle: {
    fontSize: 28,
    fontWeight: '600',
    paddingLeft: 20,
    color: '#6F7789',
  },
});
