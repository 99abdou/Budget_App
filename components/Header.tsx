import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';


const Header: React.FC = () => {
    const router = useRouter();

    return (
        <View className="flex-row justify-between mb-4 bg-white p-4 drop-shadow-lg fixed">
    <Text className="text-2xl font-bold text-center">Tableau de bord</Text>
    <Link href="/Test">
    <TouchableOpacity  onPress={() => router.push('/Login')} className="bg-orange-500 rounded-lg p-3">
      <Text className="text-white text-center font-bold">Déconnecter</Text>
    </TouchableOpacity>
    </Link>
  </View>
    )
  
};

export default Header;
