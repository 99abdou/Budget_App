import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

interface BudgetInfoProps {
  budget: number;
  initialBudget: number;
  setInitialBudget: (value: number) => void;
}

const BudgetInfo: React.FC<BudgetInfoProps> = ({ budget, initialBudget, setInitialBudget }) => {
  const [isBudgetSet, setIsBudgetSet] = useState(false); // État pour vérifier si le budget est défini

  const handleSetBudget = () => {
    if (initialBudget > 0) {
      setIsBudgetSet(true); // Verrouille le budget après confirmation
    }
  };

  return (
    <View className="bg-white rounded-lg p-4 shadow mb-4">
      <Text className="text-lg font-semibold text-center">Budget Actuel</Text>
      <Text className="mt-2">Valeur restante : {budget}fr</Text>
      <Text className="mt-2">Budget initial :</Text>
      <TextInput
        value={initialBudget.toString()}
        onChangeText={(value) => setInitialBudget(parseFloat(value) || 0)}
        keyboardType="numeric"
        editable={!isBudgetSet} // Rend le TextInput non modifiable
        className={`border border-gray-300 rounded-lg p-3 mb-4 ${
          isBudgetSet ? 'bg-gray-100' : ''
        }`}
      />
      {!isBudgetSet && (
        <Button title="Définir le budget" onPress={handleSetBudget} />
      )}
    </View>
  );
};

export default BudgetInfo;
