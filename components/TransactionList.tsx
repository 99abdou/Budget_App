import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'Revenu' | 'Dépense';
}

interface TransactionListProps {
  transactions: Transaction[];
  isFullList?: boolean; // Détermine si toutes les transactions doivent être affichées
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, isFullList = false,  }) => {
  const router = useRouter();

  // Limiter à 3 transactions si ce n'est pas la liste complète
  const displayedTransactions = isFullList ? transactions : transactions.slice(0, 3);

  return (
    <View>
      <View className="flex-row justify-between p-4">
        <Text className="text-lg font-bold text-center mb-2">Historique</Text>
        {!isFullList && (
          <TouchableOpacity onPress={() => router.push('/transaction')} className="rounded-lg">
            <Text className="text-lg text-black text-center mb-4">Voir tout</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayedTransactions}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }} 
        renderItem={({ item }) => (
          <View className="flex-row justify-between bg-white rounded-lg p-4 shadow mb-2">
            <View>
              <Text className='text-lg font-bold'>{item.description}</Text>
              <Text>Vous avez une {item.type} </Text>
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

export default TransactionList;
