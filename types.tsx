// types.ts
export interface TransactionData {
    budget: string; // ID du budget ou ID de l'utilisateur
    transaction_type: 'Revenu' | 'Dépense';
    montant: number;
    description: string;
  }