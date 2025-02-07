import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Header from '../../components/Header';
import BudgetInfo from '../../components/BudgetInfo';
import TransactionForm from '../../components/TransactionForm';
import TransactionList from '../../components/TransactionList';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
}

const BudgetApp: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Suppression des données par défaut
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'Income' | 'Expense'>('Income'); // Options en anglais
  const [initialBudget, setInitialBudget] = useState(0); // Initialisé à zéro
  const [budgetId, setBudgetId] = useState<string | null>(null); // Gestion de l'ID du budget
  const [token, setToken] = useState<string | null>(null); // Gestion du token d'authentification

  const addTransaction = () => {
    if (description.trim() && !isNaN(Number(amount)) && budgetId) {
      const transactionAmount = parseFloat(amount) * (type === 'Expense' ? -1 : 1);
      const newTransaction: Transaction = {
        id: Date.now(),
        description,
        amount: transactionAmount,
        type,
      };

      // Ajouter localement
      setTransactions([newTransaction, ...transactions]);

      // Réinitialiser les champs
      setDescription('');
      setAmount('');

      // Envoi à l'API
      fetch('https://gestion-budget-rwdz.onrender.com/api/transactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          budget: budgetId,
          transaction_type: type,
          montant: Math.abs(transactionAmount),
          description,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error adding transaction.');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Transaction added:', data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <ScrollView>
        <SafeAreaView>
        <View className="flex-1 bg-gray-100 p-4 mt-5">
          <Header />

          {/* BudgetInfo */}
          <BudgetInfo
            setBudgetId={setBudgetId}
            budget={transactions.reduce((acc, transaction) => acc + transaction.amount, initialBudget)}
            initialBudget={initialBudget}
            setInitialBudget={setInitialBudget}
          />

          {/* TransactionForm */}
          <TransactionForm
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            type={type}
            setType={setType}
            addTransaction={addTransaction}
            budgetId={budgetId}
            token={token}
          />

         

          {/* TransactionList */}
          <TransactionList />
          
        </View>
    </SafeAreaView>
      </ScrollView>
  );
};

export default BudgetApp;
