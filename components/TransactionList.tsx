import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../Actions/transactionReducer';
import { RootState, AppDispatch } from '../store';

const TransactionList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector((state: RootState) => state.transactions);

  // Charger les transactions au montage
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    Alert.alert('Erreur', error);
    return null;
  }

  return (
    <View className="p-4">
      <Text className="text-2xl font-bold mb-4">Liste des Transactions</Text>
      {transactions.length > 0 ? (
        transactions.map((transaction) => (
          <View key={transaction.id} className="p-4 mb-2 bg-gray-100 rounded-lg shadow-lg">
            <Text className="text-lg font-bold">{transaction.description}</Text>
            <Text className="text-base">{transaction.montant} cfa</Text>
            <Text className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
        ))
      ) : (
        <Text className="text-center text-gray-500">Aucune transaction disponible</Text>
      )}
    </View>
  );
};

export default TransactionList;
