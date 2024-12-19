// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
// import { Link } from 'expo-router';

// const BudgetApp = () => {
//   const [transactions, setTransactions] = useState([
//     { id: 1, description: 'Café', amount: -3, type: 'Dépense' },
//     { id: 2, description: 'Supermarché', amount: -50, type: 'Dépense' },
//     { id: 3, description: 'Salaire', amount: 1500, type: 'Revenu' },
//   ]);

//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [type, setType] = useState('Revenu');
//   const [initialBudget, setInitialBudget] = useState(1000);

//   const addTransaction = () => {
//     if (description.trim() && !isNaN(amount)) {
//       const newTransaction = {
//         id: Date.now(),
//         description,
//         amount: parseFloat(amount),
//         type,
//       };
//       setTransactions([newTransaction, ...transactions]);
//       setDescription('');
//       setAmount('');
//     }
//   };

//   const calculateBudget = () => {
//     const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
//     return total + initialBudget;
//   };

//   return (
//     <View className="flex-1 bg-gray-100 p-4 mt-5">
//       {/* Header */}
//       <View className="flex-row justify-between mb-4">
//         <Text className="text-2xl font-bold text-center">Tableau de bord</Text>
//         <Link href="/index">
//           <TouchableOpacity> 
//             <Text className="text-lg font-bold text-blue-500">Se déconnecter</Text>
//           </TouchableOpacity>
//         </Link>
//       </View>

//       {/* Budget Info */}
//       <View className="bg-white rounded-lg p-4 shadow mb-4">
//         <Text className="text-lg font-semibold text-center">Budget Actuel</Text>
//         <Text className="mt-2">Valeur restante : {calculateBudget()}€</Text>
//         <Text>Budget initial :</Text>
//         <TextInput
//           value={initialBudget.toString()}
//           onChangeText={(value) => setInitialBudget(parseFloat(value) || 0)}
//           keyboardType="numeric"
//           className="border border-gray-300 rounded-lg p-3 mb-4"
//         />
//       </View>

//       {/* Add Transaction */}
//       <Text className="text-lg font-bold text-center mb-4">Ajouter une Transaction</Text>
//       <View className="bg-white rounded-lg p-4 shadow mb-4">
//         <TextInput
//           placeholder="Description"
//           value={description}
//           onChangeText={setDescription}
//           className="border border-gray-300 rounded-lg p-3 mb-4"
//         />
//         <TextInput
//           placeholder="Montant"
//           value={amount}
//           onChangeText={setAmount}
//           keyboardType="numeric"
//           className="border border-gray-300 rounded-lg p-3 mb-4"
//         />
//         <View className="flex-row items-center mb-4">
//           <Text className="mr-4">Type :</Text>
//           <TouchableOpacity onPress={() => setType('Revenu')}>
//             <Text className={`mr-4 ${type === 'Revenu' ? 'text-blue-500 font-bold' : ''}`}>
//               Revenu
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setType('Dépense')}>
//             <Text className={`${type === 'Dépense' ? 'text-blue-500 font-bold' : ''}`}>
//               Dépense
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity onPress={addTransaction} className="bg-orange-500 rounded-lg py-3">
//           <Text className="text-white text-center font-bold">Ajouter</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Transaction List */}
//       <Text className="text-lg font-bold text-center mb-4">Historique</Text>
//       <FlatList
//         data={transactions}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View className="flex-row justify-between bg-white rounded-lg p-4 shadow mb-2">
//             <Text>{item.description}</Text>
//             <Text className={item.amount < 0 ? 'text-red-500' : 'text-green-500'}>
//               {item.amount > 0 ? `+${item.amount}€` : `${item.amount}€`}
//             </Text>
//           </View>
//         )}
//       />
//     </View>
//   );
// };

// export default BudgetApp;


import React, { useState } from 'react';
import { View } from 'react-native';
import Header from '../../components/Header';
import BudgetInfo from '../../components/BudgetInfo';
import TransactionForm from '../../components/TransactionForm'
import TransactionList from '../../components/TransactionList';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'Revenu' | 'Dépense';
}

const BudgetApp: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, description: 'Café', amount: -3, type: 'Dépense' },
    { id: 2, description: 'Supermarché', amount: -50, type: 'Dépense' },
    { id: 3, description: 'Salaire', amount: 1500, type: 'Revenu' },
  ]);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Revenu' | 'Dépense'>('Revenu');
  const [initialBudget, setInitialBudget] = useState(1000);

  const addTransaction = () => {
    if (description.trim() && !isNaN(Number(amount))) {
      const transactionAmount = parseFloat(amount) * (type === 'Dépense' ? -1 : 1);
      const newTransaction: Transaction = {
        id: Date.now(),
        description,
        amount: transactionAmount,
        type,
      };
      setTransactions([newTransaction, ...transactions]);
      setDescription('');
      setAmount('');
    }
  };

  const calculateBudget = () => {
    return transactions.reduce((acc, transaction) => acc + transaction.amount, initialBudget);
  };

  return (
    <View className="flex-1 bg-gray-100 p-4 mt-5">
      <Header />
      <BudgetInfo
        budget={calculateBudget()}
        initialBudget={initialBudget}
        setInitialBudget={setInitialBudget}
      />
      <TransactionForm
        description={description}
        setDescription={setDescription}
        amount={amount}
        setAmount={setAmount}
        type={type}
        setType={setType}
        addTransaction={addTransaction}
      />
      <TransactionList transactions={transactions} />
    </View>
  );
};

export default BudgetApp;
