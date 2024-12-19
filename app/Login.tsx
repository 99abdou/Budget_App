import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';


const LoginScreen = () => {

  return (
    <View className="flex-1 bg-gray-100">

      {/* Form */}
      <View className="flex-1 justify-center items-center px-9">
        <View className="w-full bg-white rounded-lg p-6 shadow">
          <Text className="text-xl text-center font-semibold mb-4">Connexion</Text>

          <TextInput
            placeholder="exemple@mail.com"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Mot de passe"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            secureTextEntry
          />

          <View className="flex-row justify-end items-center mb-4">
            <TouchableOpacity>
              <Text className="text-black font-semibold">Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-orange-500 rounded-lg py-3">
            <Link href="/dashboard">
              <Text className="text-white text-center font-bold">Connexion</Text>
            </Link>
          </TouchableOpacity>

          <View className='mt-5'>
            <Link href="/SignUp">
              <Text className="text-blue-500 text-center font-bold">S'inscrire</Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
