import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import addTransaction from '../Actions/transactionReducer';
import Toast from 'react-native-toast-message';

interface AddTransactionFormProps {
  budgetId: number;
}

const TransactionForm: React.FC<AddTransactionFormProps> = ({ budgetId }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'depense' | 'revenu'>('depense');
  const [token, setToken] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (!storedToken) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Token non disponible. Veuillez vous reconnecter.',
        });
        return;
      }
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const validateFields = () => {
    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'La description ne peut pas être vide.',
      });
      return false;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez entrer un montant valide.',
      });
      return false;
    }
    return true;
  };

  const handleAddTransaction = async () => {
    if (!validateFields() || !token) return;

    try {
      const response = await axios.post(
        'https://gestion-budget-rwdz.onrender.com/api/transactions/',
        {
          budget: budgetId,
          transaction_type: type,
          montant: parseFloat(amount),
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newTransaction = response.data;
      dispatch(addTransaction(newTransaction));

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Transaction ajoutée avec succès.',
      });
      setDescription('');
      setAmount('');
      setType('depense');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Une erreur est survenue lors de l\'ajout de la transaction.',
      });
    }
  };

  return (
    <View className="bg-white rounded-lg p-4 shadow mb-4">
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <TextInput
        placeholder="Montant"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />

      <View className="mb-4">
        <Text className="mb-2 font-semibold">Type :</Text>
        <View className="border border-gray-300 rounded-lg">
          <Picker
            selectedValue={type}
            onValueChange={(itemValue) => setType(itemValue as 'depense' | 'revenu')}
            style={{ height: 55 }}
          >
            <Picker.Item label="depense" value="depense" />
            <Picker.Item label="revenu" value="revenu" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity onPress={handleAddTransaction} className="bg-orange-500 rounded-lg py-3">
        <Text className="text-white text-center font-bold">Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionForm;

