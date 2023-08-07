import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React, {useState, useEffect} from 'react';
import SidangTab from './src/mahasiswa/components/SidangTab';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PengajuanTab from './src/components/PengajuanTab';
import NotifikasiTab from './src/components/NotifikasiTab';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Splash from './src/screens/Splash';
import Menu from './src/screens/Menu';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
Icon.loadFont();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
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
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <MainTabs />
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
