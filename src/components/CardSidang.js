import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
const CardSidang = ({
  title,
  tanggalBuka,
  tanggalSidang,
  tanggalTutup,
  icon = 'calendar-alt',
  color = '#F6B17A',
}) => {
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <Icon name={icon} size={30} color={color} />
          </View>
          <View style={styles.rightContentContainer}>
            <Text style={styles.contentTitle}>{title}</Text>
            <Text style={styles.contentText}>
              Jadwal Sidang : {tanggalSidang}
            </Text>
            <Text style={styles.contentText}>Tanggal Buka : {tanggalBuka}</Text>
            <Text style={styles.contentText}>
              Tanggal Tutup : {tanggalTutup}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardSidang;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    elevation: 2,
  },
  contentContainer: {display: 'flex', flexDirection: 'row', marginLeft: 20},
  contentTitle: {fontWeight: 'bold', color: '#176B87'},
  contentText: {fontWeight: '400', fontSize: 12, color: '#6F7789'},
  rightContentContainer: {marginLeft: 20},
  iconContainer: {justifyContent: 'center', alignItems: 'center'},
});
