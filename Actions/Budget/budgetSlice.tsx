import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const BASE_URL = 'https://gestion-budget-rwdz.onrender.com/api/';

// Action pour définir le budget initial
export const setInitialBudget = createAsyncThunk<
  any,
  { montant: number },
  { rejectValue: string }
>(
  'budget/setInitialBudget',
  async ({ montant }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: "Token d'authentification manquant.",
        });
        return rejectWithValue("Token d'authentification manquant.");
      }

      const response = await fetch(`${BASE_URL}budget/initial/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ montant }),
      });

      const data = await response.json();
      if (!response.ok) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: data.message || 'Erreur lors de la définition du budget',
        });
        throw new Error(data.message || 'Erreur lors de la définition du budget');
      }

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Le budget initial a été défini avec succès.',
      });
      return data;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error.message,
      });
      return rejectWithValue(error.message);
    }
  }
);

// Action pour récupérer le budget de l'utilisateur
export const getBudget = createAsyncThunk<
  any,
  string,  // UserID
  { rejectValue: string }
>(
  'budget/getBudget',
  async (userId, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: "Token d'authentification manquant.",
        });
        return rejectWithValue("Token d'authentification manquant.");
      }

      const response = await fetch(`${BASE_URL}budget/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        Toast.show({
          type: 'error',
          text1: 'Erreur',
          text2: data.message || 'Erreur lors de la récupération du budget',
        });
        throw new Error(data.message || 'Erreur lors de la récupération du budget');
      }

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Le budget a été récupéré avec succès.',
      });
      return data;
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: error.message,
      });
      return rejectWithValue(error.message);
    }
  }
);

interface BudgetState {
  budget: number | null;
  initialBudget: number | null;
  totalAmount: string | null;  
  isLoading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  budget: null,
  initialBudget: null,
  totalAmount: null,
  isLoading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setInitialBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setInitialBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.initialBudget = action.payload.montant;
        state.budget = action.payload.budget;
      })
      .addCase(setInitialBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur inattendue';
      })
      .addCase(getBudget.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totalAmount = action.payload.total_amount; 
        state.budget = action.payload.budget;
      })
      .addCase(getBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Erreur inattendue';
      });
  },
});

export default budgetSlice.reducer;

