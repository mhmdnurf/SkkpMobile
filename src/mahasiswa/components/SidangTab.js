import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import About from '../../screens/About';
import Info from '../../screens/Info';

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
        tabBarIndicatorStyle: {
          backgroundColor: 'white',
          height: 2,
        },
        tabBarStyle: {
          backgroundColor: '#59C1BD',
        },
        tabBarLabelStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
      }}>
      <Tab.Screen name="Kerja Praktek" component={About} />
      <Tab.Screen name="Seminar Proposal" component={Info} />
      <Tab.Screen name="Sidang Kompre" component={Info} />
      <Tab.Screen name="Sidang Akhir" component={Info} />
    </Tab.Navigator>
  );
};

export default SidangTab;
