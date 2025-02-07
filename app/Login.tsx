import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Actions/authSlice'; // Assurez-vous que l'import correspond à votre projet
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Tous les champs sont obligatoires',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Le mot de passe doit comporter au moins 6 caractères',
      });
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(
        loginUser({ phone_number: phoneNumber, password })
      );

      if (loginUser.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Connexion réussie',
        });
        router.push('/dashboard');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: resultAction.payload || 'Connexion échouée',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Une erreur inattendue est survenue',
      });
      console.error('Erreur de connexion :', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Form */}
      <View className="flex-1 justify-center items-center px-9">
        <View className="w-full bg-white rounded-lg p-6 shadow">
          <Text className="text-xl text-center font-semibold mb-4">Connexion</Text>

          <TextInput
            placeholder="Numéro de téléphone"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <TextInput
            placeholder="Mot de passe"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            className={`bg-orange-500 rounded-lg py-3 ${loading ? 'opacity-50' : ''}`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text className="text-white text-center font-bold">Connexion</Text>
            )}
          </TouchableOpacity>

          <View className="mt-5">
            <TouchableOpacity onPress={() => router.push('/SignUp')}>
              <Text className="text-blue-500 text-center font-bold">S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

