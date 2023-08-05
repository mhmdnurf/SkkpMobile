import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import About from '../screens/About';
import Info from '../screens/Info';

const Tab = createMaterialTopTabNavigator();

const PengajuanTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: true,
        tabBarShowIcon: true,
        tabBarItemStyle: {
          flexDirection: 'row',
        },
      }}>
      <Tab.Screen name="Kerja Praktek" component={About} />
      <Tab.Screen name="Skripsi" component={Info} />
    </Tab.Navigator>
  );
};

export default PengajuanTab;
