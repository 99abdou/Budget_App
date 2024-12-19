import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const Index = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Remplace la page actuelle par la page Login
    }, 3000); // 

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View className="flex-1 bg-white justify-center items-center">
      {/* Logo */}
      <View className="w-32 h-32 bg-indigo-500 rounded-2xl shadow-lg justify-center items-center">
        <Image
          source={require('../../assets/images/budget.png')}
          className="w-16 h-16"
        />
      </View>

      {/* Titre */}
      <Text className="mt-5 text-4xl font-bold">
        My
        <Text className="text-orange-500">Budget</Text>
      </Text>
    </View>
  );
}

export default Index;
