// components/SearchBar.tsx
import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface SearchBarProps {
  busquedaId: string;
  setBusquedaId: (text: string) => void;
  onBuscar: () => void;
}

export default function SearchBar({ busquedaId, setBusquedaId, onBuscar }: SearchBarProps) {
  return (
    <View style={styles.row}>
      <TextInput
        style={styles.inputFlex}
        placeholder="Buscar por ID"
        value={busquedaId}
        onChangeText={setBusquedaId}
        keyboardType="numeric"
      />
      <Button title="Buscar" onPress={onBuscar} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  inputFlex: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 },
});
