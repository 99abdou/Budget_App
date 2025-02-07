import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../store';
import { setInitialBudget, getBudget } from '../Actions/Budget/budgetSlice';
import Toast from 'react-native-toast-message';

const BudgetInfo: React.FC<{ setBudgetId: (id: string) => void }> = ({ setBudgetId }) => {
  const [localBudget, setLocalBudget] = useState<string>('');
  const [isBudgetSet, setIsBudgetSet] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { budget, totalAmount, isLoading, error } = useSelector((state: RootState) => state.budget);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenAndUserId = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('user_id');
      console.log('TOKEN:', storedToken);
      console.log('USER ID:', storedUserId);
      setToken(storedToken);
      setUserId(storedUserId);
    };
    fetchTokenAndUserId();
  }, []);

  useEffect(() => {
    if (userId && token) {
      dispatch(getBudget(userId));
    }
  }, [userId, token, dispatch]);

  const handleSetBudget = async () => {
    const budgetValue = parseFloat(localBudget);

    if (!budgetValue || budgetValue <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez entrer un budget valide.',
      });
      return;
    }

    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Token d\'authentification manquant. Veuillez vous reconnecter.',
      });
      return;
    }

    try {
      const result = await dispatch(setInitialBudget({ montant: budgetValue })).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: `Budget initial défini : ${result.budget_initial.montant} fr`,
      });
      
      setBudgetId(result.budget_initial.id);
      setIsBudgetSet(true);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error || 'Une erreur est survenue.',
      });
    }
  };

  return (
    <View className="bg-white rounded-lg p-4 shadow mb-4">
      <Text className="text-lg font-semibold text-center">Budget Actuel</Text>
      {isLoading ? (
        <Text>Chargement...</Text>
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : (
        <Text className="mt-2">Total : {totalAmount} CFA</Text>
      )}
      <Text className="mt-2">Budget initial :</Text>
      <TextInput
        value={localBudget}
        onChangeText={setLocalBudget}
        keyboardType="numeric"
        editable={!isBudgetSet}
        className={`border border-gray-300 rounded-lg p-3 mb-4 ${isBudgetSet ? 'bg-gray-100' : 'bg-orange-600'}`}
      />
      <Button
        title={isLoading ? 'Chargement...' : 'Définir le budget'}
        onPress={handleSetBudget}
        disabled={isLoading || isBudgetSet}
      />
    </View>
  );
};

export default BudgetInfo;

