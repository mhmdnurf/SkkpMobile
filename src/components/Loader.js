import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const Loader = () => {
  return (
    <View>
      <ActivityIndicator size="large" color="#176B87" />
    </View>
  );
};

export default Loader;
