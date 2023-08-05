import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import Info from '../screens/Info';
import About from '../screens/About';

const Tab = createMaterialTopTabNavigator();

const SidangTab = () => {
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

export default SidangTab;
