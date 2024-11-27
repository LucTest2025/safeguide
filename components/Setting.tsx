import { SafeAreaView, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import { getUsers } from '../firebase';

const Setting = () => {
  useEffect(() => {
    const fetchData = async () => {
      const users = await getUsers();
      console.log('Users in Settings:', users);
    };
    fetchData();
  }, []);

  return (
    <SafeAreaView>
      <Text>Setting</Text>
    </SafeAreaView>
  );
};

export default Setting;

const styles = StyleSheet.create({});
