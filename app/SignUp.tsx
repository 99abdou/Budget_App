import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";

const SignupScreen = () => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View className="flex-1 bg-gray-100">

      {/* Form */}
      <View className="flex-1 justify-center items-center px-6"> 
        <View className="w-full bg-white rounded-lg p-6 shadow">
          <Text className="text-xl font-semibold mb-4">Créer un compte</Text>

          {/* Nom et Prénom */}
          <TextInput
            placeholder="Votre nom complet"
            className="border border-gray-300 rounded-lg p-3 mb-4" 
          />

          {/* Adresse mail */}
          <TextInput
            placeholder="exemple@mail.com"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            keyboardType="email-address"
          />

          {/* Numéro de téléphone */}
          <TextInput
            placeholder="telephone"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            keyboardType="phone-pad"
          />

          {/* Mot de passe */}
          <TextInput
            placeholder="Mot de passe"
            className="border border-gray-300 rounded-lg p-3 mb-4"
            secureTextEntry
          />

          {/* Se souvenir de moi + Mot de passe oublié */}
          <View className="flex-row justify-end items-center mb-4">
            <TouchableOpacity>
              <Text className="text-black font-semibold">Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          {/* Bouton Inscription */}
          <TouchableOpacity  className="bg-orange-500  rounded-lg py-3">
            <Text className="text-white text-center font-bold">Inscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignupScreen;
