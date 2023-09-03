import React from 'react';
import {Button, View} from 'react-native';
import notifee, {
  AndroidStyle,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';

const About = () => {
  const handleNotification = async () => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display a notification
    await notifee.displayNotification({
      title: 'Notification Title',
      body: 'Main body content of the notification',
      android: {
        channelId,
        visibility: AndroidVisibility.PUBLIC,
        headless: false, // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  return (
    <View>
      <Button title="Show Notification" onPress={handleNotification} />
    </View>
  );
};

export default About;
