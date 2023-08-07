/* eslint-disable react-native/no-inline-styles */
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function () {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.boxContainer}>
        <View
          style={{
            alignItems: 'flex-start',
          }}>
          <Icon name="user" size={48} color="white" />
        </View>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <Text style={styles.textTitle}>Pendaftar Sidang KP</Text>
          <Text style={styles.textNumber}>6</Text>
        </View>
      </View>
      <View style={styles.boxContainer}>
        <View
          style={{
            alignItems: 'flex-start',
          }}>
          <Icon name="user" size={48} color="white" />
        </View>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <Text style={styles.textTitle}>Pendaftar Seminar Proporsal</Text>
          <Text style={styles.textNumber}>28</Text>
        </View>
      </View>
      <View style={styles.boxContainer}>
        <View
          style={{
            alignItems: 'flex-start',
          }}>
          <Icon name="user" size={48} color="white" />
        </View>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <Text style={styles.textTitle}>Pendaftar Sidang Skripsi</Text>
          <Text style={styles.textNumber}>6</Text>
        </View>
      </View>
      <View style={styles.boxContainer}>
        <View
          style={{
            alignItems: 'flex-start',
          }}>
          <Icon name="user" size={48} color="white" />
        </View>
        <View
          style={{
            alignItems: 'flex-end',
          }}>
          <Text style={styles.textTitle}>Pendaftar Sidang Komprehensif</Text>
          <Text style={styles.textNumber}>6</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boxContainer: {
    marginLeft: 16,
    padding: 16,
    backgroundColor: '#1E5F74',
    width: 300,
    height: 150,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTitle: {fontSize: 24, color: 'white', fontWeight: 'bold'},
  textNumber: {fontSize: 36, color: 'white', fontWeight: 'bold'},
});
