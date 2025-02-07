import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { registerUser } from '../Actions/authSlice'; // Assurez-vous que le chemin est correct
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const SignupScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignup = async () => {
    // Validation des champs
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Tous les champs doivent être remplis',
      });
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Email invalide',
      });
      return;
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Numéro de téléphone invalide',
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

    setLoading(true); // Afficher le loader

    try {
      const resultAction = await dispatch(
        registerUser({
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phoneNumber,
          password,
        })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'Succès',
          text2: 'Inscription réussie',
        });
        router.push('/Login'); // Rediriger vers la page de connexion
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: resultAction.payload || 'Inscription échouée',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error.message || 'Une erreur est survenue',
      });
    } finally {
      setLoading(false); // Masquer le loader après la requête
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-1 justify-center items-center px-9">
        <View className="w-full bg-white rounded-lg p-6 shadow">
          <Text className="text-xl text-center font-semibold mb-4">Inscription</Text>

          <TextInput
            placeholder="Prénom"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            value={firstName}
            onChangeText={setFirstName}
          />

          <TextInput
            placeholder="Nom"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            value={lastName}
            onChangeText={setLastName}
          />

          <TextInput
            placeholder="Email"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Numéro de téléphone"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <TextInput
            placeholder="Mot de passe"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className="bg-orange-500 rounded-lg py-3"
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold">S'inscrire</Text>
            )}
          </TouchableOpacity>

          <View className="mt-5">
            <TouchableOpacity onPress={() => router.push('/Login')}>
              <Text className="text-blue-500 text-center font-bold">Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;

