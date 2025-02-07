import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Types pour l'état de l'authentification
export interface AuthState {
  user: any | null;
  token: string | null;
  refresh: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface LoginPayload {
  phone_number: string;
  password: string;
}

const BASE_URL = 'https://gestion-budget-rwdz.onrender.com/api/';

// Helper function pour afficher des notifications
const showToast = (type: 'success' | 'error', text1: string, text2?: string) => {
  Toast.show({
    type,
    text1,
    text2,
    position: 'bottom',
    visibilityTime: 4000,
    autoHide: true,
  });
};

// **Action : Connexion utilisateur**
export const loginUser = createAsyncThunk<any, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast('error', 'Échec de connexion', data.message || 'Numéro ou mot de passe invalide.');
        return rejectWithValue(data.message || 'Numéro ou mot de passe invalide.');
      }

      if (data.access && data.refresh) {
        await AsyncStorage.setItem('token', data.access);
        await AsyncStorage.setItem('refresh', data.refresh);
        await AsyncStorage.setItem('user_id', data.user_id.toString());
        showToast('success', 'Connexion réussie', 'Bienvenue !');
      } else {
        showToast('error', 'Erreur de connexion', 'Tokens manquants dans la réponse.');
        return rejectWithValue('Tokens manquants dans la réponse.');
      }

      return data;
    } catch (error: any) {
      showToast('error', 'Erreur de connexion', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// **Action : Inscription utilisateur**
export const registerUser = createAsyncThunk<any, RegisterPayload, { rejectValue: string }>(
  'auth/registerUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast('error', 'Échec d\'inscription', data.message || 'Erreur d\'inscription');
        return rejectWithValue(data.message || 'Erreur d\'inscription');
      }

      if (data.access && data.refresh) {
        await AsyncStorage.setItem('token', data.access);
        await AsyncStorage.setItem('refresh', data.refresh);
        showToast('success', 'Inscription réussie', 'Compte créé avec succès !');
      }

      return data;
    } catch (error: any) {
      showToast('error', 'Erreur d\'inscription', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// **Action : Déconnexion utilisateur**
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const refresh = await AsyncStorage.getItem('refresh');

      if (!refresh) {
        showToast('error', 'Erreur de déconnexion', 'Le jeton refresh est introuvable.');
        return rejectWithValue('Le jeton refresh est introuvable.');
      }

      const response = await fetch(`${BASE_URL}logout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }), // Envoi dans le corps
      });

      const data = await response.json();

      if (!response.ok) {
        showToast('error', 'Erreur de déconnexion', data.message || 'Erreur lors de la déconnexion.');
        return rejectWithValue(data.message || 'Erreur lors de la déconnexion.');
      }

      await Promise.all([
        AsyncStorage.removeItem('token'),
        AsyncStorage.removeItem('refresh'),
        AsyncStorage.removeItem('user_id'),
      ]);
      showToast('success', 'Déconnexion réussie', 'À bientôt !');
    } catch (error: any) {
      showToast('error', 'Erreur de déconnexion', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// **Slice d'authentification**
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    refresh: null,
    isLoading: false,
    error: null,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refresh = null;
      AsyncStorage.clear();
      showToast('success', 'Déconnexion réussie', 'À bientôt !');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refresh = action.payload.refresh;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access;
        state.refresh = action.payload.refresh;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refresh = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
