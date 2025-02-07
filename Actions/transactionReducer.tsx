import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

interface Transaction {
  id: number;
  description: string;
  montant: number;
  date: string;
  transaction_type: 'depense' | 'revenu';
}

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

// Action pour récupérer les transactions
export const fetchTransactions = createAsyncThunk<Transaction[], undefined, { rejectValue: string }>(
  'transactions/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'user_id non trouvé',
        });
        throw new Error('user_id non trouvé');
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: 'Token non trouvé',
        });
        throw new Error('Token non trouvé');
      }

      const response = await fetch(
        `https://gestion-budget-rwdz.onrender.com/api/transactions/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: data.detail || 'Erreur de récupération des transactions',
        });
        throw new Error(data.detail || 'Erreur de récupération des transactions');
      }

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Transactions récupérées avec succès',
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur inattendue');
    }
  }
);

// Action pour créer une nouvelle transaction
export const createTransaction = createAsyncThunk<
  Transaction,
  Transaction,
  { rejectValue: string }
>('transactions/createTransaction', async (transaction, { rejectWithValue, dispatch }) => {
  try {
    const userId = await AsyncStorage.getItem('user_id');
    const token = await AsyncStorage.getItem('token');

    if (!userId) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'user_id non trouvé',
      });
      throw new Error('user_id non trouvé');
    }
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Token non trouvé',
      });
      throw new Error('Token non trouvé');
    }

    const response = await fetch(
      `https://gestion-budget-rwdz.onrender.com/api/transactions/${userId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
      }
    );

    const newTransaction = await response.json();
    if (!response.ok) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: newTransaction.detail || 'Erreur lors de la création de la transaction',
      });
      throw new Error(newTransaction.detail || 'Erreur lors de la création de la transaction');
    }

    // Met à jour la liste des transactions
    dispatch(fetchTransactions());

    Toast.show({
      type: 'success',
      text1: 'Succès',
      text2: 'Transaction créée avec succès',
    });
    return newTransaction;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Erreur inattendue');
  }
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur inconnue';
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Erreur lors de la création de la transaction';
      });
  },
});

export default transactionSlice.reducer;

