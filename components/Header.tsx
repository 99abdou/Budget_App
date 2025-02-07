import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logoutUser } from '../Actions/authSlice';
import Toast from 'react-native-toast-message';

const Header: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    Toast.show({
      type: 'info',
      text1: 'Confirmation',
      text2: 'Voulez-vous vraiment vous déconnecter ?',
      onPress: () => {
        performLogout();
      },
      onHide: () => {
        console.log('Déconnexion annulée');
      },
    });
  };

  const performLogout = async () => {
    try {
      // Déclenche l'action de déconnexion
      dispatch(logoutUser());

      // Supprimer manuellement les données de AsyncStorage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('user_id');

      // Afficher un toast de confirmation
      Toast.show({
        type: 'success',
        text1: 'Déconnexion réussie',
        text2: 'Vous avez été déconnecté avec succès.',
      });

      // Redirige vers la page de connexion
      router.push('/Login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Une erreur est survenue lors de la déconnexion.',
      });
    }
  };

  return (
    <View className="flex-row justify-between mb-4 bg-white p-4 drop-shadow-lg">
      <Text className="text-2xl font-bold text-center">Tableau de bord</Text>
      <TouchableOpacity onPress={handleLogout} className="bg-orange-500 rounded-lg p-3">
        <Text className="text-white text-center font-bold">Déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

