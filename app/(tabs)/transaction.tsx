import React, { useState } from 'react';
import { View, Text, TextInput, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'Revenu' | 'Dépense';
}

interface TransactionsPageProps {
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = () => {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: 'Café', amount: -3, type: 'Dépense' },
    { id: 2, description: 'Supermarché', amount: -50, type: 'Dépense' },
  ]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Exemple de filtre : filtre par montant si les champs sont remplis
  const filteredTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.id); // Supposons que `id` est un timestamp
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && date < start) return false;
    if (end && date > end) return false;

    return true;
  });

  return (
    <View className="flex-1 bg-gray-100 p-4 mt-5">
      <Text className="text-lg font-bold text-center mb-4">Toutes les Transactions</Text>

      <View className= " bg-white rounded-lg p-4 shadow mb-4">
        <Text className="text-lg text-center mt-3 mb-3 font-semibold">Filtrer par date</Text>
        <TextInput
          placeholder="Date de début (YYYY-MM-DD)"
          value={startDate}
          onChangeText={setStartDate}
          className="border border-gray-300 rounded-lg p-3 mb-4"
        />
        <TextInput
          placeholder="Date de fin (YYYY-MM-DD)"
          value={endDate}
          onChangeText={setEndDate}
          className="border border-gray-300 rounded-lg p-3 mb-4"
        />
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row justify-between bg-white rounded-lg p-4 shadow mb-2">
            <View>
              <Text>{item.description}</Text>
              <Text>{item.type}</Text>
            </View>
            <Text className={item.amount < 0 ? 'text-red-500' : 'text-green-500'}>
              {item.amount > 0 ? `+${item.amount}fr` : `${item.amount}fr`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default TransactionsPage;
