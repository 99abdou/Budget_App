import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Assurez-vous d'installer ce package si nécessaire.

interface AddTransactionFormProps {
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  type: 'Revenu' | 'Dépense';
  setType: (value: 'Revenu' | 'Dépense') => void;
  addTransaction: () => void;
}

const TransactionForm: React.FC<AddTransactionFormProps> = ({
  description,
  setDescription,
  amount,
  setAmount,
  type,
  setType,
  addTransaction,
}) => (
  <View className="bg-white rounded-lg p-4 shadow mb-4">
    {/* Champ Description */}
    <TextInput
      placeholder="Description"
      value={description}
      onChangeText={setDescription}
      className="border border-gray-300 rounded-lg p-3 mb-4"
    />

    {/* Champ Montant */}
    <TextInput
      placeholder="Montant"
      value={amount}
      onChangeText={setAmount}
      keyboardType="numeric"
      className="border border-gray-300 rounded-lg p-3 mb-4"
    />

    {/* Sélecteur Type avec Picker */}
    <View className="mb-4">
      <Text className="mb-2 font-semibold">Type :</Text>
      <View className="border border-gray-300 rounded-lg">
        <Picker
          selectedValue={type}
          onValueChange={(itemValue) => setType(itemValue as 'Revenu' | 'Dépense')}
          style={{ height: 50 }}
        >
          <Picker.Item label="Revenu" value="Revenu" />
          <Picker.Item label="Dépense" value="Dépense" />
        </Picker>
      </View>
    </View>

    {/* Bouton Ajouter */}
    <TouchableOpacity onPress={addTransaction} className="bg-orange-500 rounded-lg py-3">
      <Text className="text-white text-center font-bold">Ajouter</Text>
    </TouchableOpacity>
  </View>
);

export default TransactionForm;
