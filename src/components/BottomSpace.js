import React from 'react';
import {StyleSheet, View} from 'react-native';

const BottomSpace = ({marginBottom}) => {
  const styles = StyleSheet.create({
    bottomSpace: {
      marginBottom: marginBottom || 0,
    },
  });

  return <View style={styles.bottomSpace} />;
};

export default BottomSpace;
