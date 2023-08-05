import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import SidangTab from './src/components/SidangTab';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Sesuaikan dengan pustaka ikon yang Anda gunakan
import PengajuanTab from './src/components/PengajuanTab';
import NotifikasiTab from './src/components/NotifikasiTab';
import Home from './src/screens/Home';
import Splash from './src/screens/Splash';
import Menu from './src/screens/Menu';
Icon.loadFont(); // Memuat font ikon
const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Ganti 3000 dengan durasi yang Anda inginkan dalam milidetik (misalnya, 5000 untuk 5 detik)
  }, []);

  if (isLoading) {
    return <Splash />;
  }
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Dashboard"
          component={Home}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Pengajuan"
          component={PengajuanTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="hand-paper-o" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Sidang"
          component={SidangTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="calendar-check-o" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Notifikasi"
          component={NotifikasiTab}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="bell-o" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Menu dan Akun"
          component={Menu}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon name="th-list" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
