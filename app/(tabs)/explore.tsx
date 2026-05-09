import React, { useEffect, useState } from 'react';
import {Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initDB, guardarRegistro } from '../database/sqlite';
import DateTimePicker from '@react-native-community/datetimepicker';



export default function RegistroScreen() {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [edad, setEdad] = useState('');
  const [dueno, setDueno] = useState('');
  const [vacunas, setVacunas] = useState('');
  const [alergias, setAlergias] = useState('');
  const [condicion, setCondicion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [fecha, setFecha] = useState('');


  useEffect(() => {
    initDB();
  }, []);


  const handleGuardar = () => {
    guardarRegistro({
      nombre,
      especie,
      edad: Number(edad),
      dueno,
      vacunas,
      alergias,
      condicion,
      observaciones,
      fecha,
    });


    setNombre('');
    setEspecie('');
    setEdad('');
    setDueno('');
    setVacunas('');
    setAlergias('');
    setCondicion('');
    setObservaciones('');
    setFecha('');
  };


    // Aquí puedes guardar en AsyncStorage o en una base de datos


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Registro de Mascota</Text>


      <TextInput style={styles.input} placeholder="Nombre del animal" value={nombre} onChangeText={setNombre} />
      <TextInput style={styles.input} placeholder="Especie (perro, gato, conejo...)" value={especie} onChangeText={setEspecie} />
      <TextInput style={styles.input} placeholder="Edad aproximada" value={edad} onChangeText={setEdad} />
      <TextInput style={styles.input} placeholder="Nombre del dueño" value={dueno} onChangeText={setDueno} />


      <TextInput style={styles.input} placeholder="Vacunas aplicadas" value={vacunas} onChangeText={setVacunas} />
      <TextInput style={styles.input} placeholder="Alergias conocidas" value={alergias} onChangeText={setAlergias} />


      <TextInput style={styles.input} placeholder="Condición actual" value={condicion} onChangeText={setCondicion} />
      <TextInput style={styles.input} placeholder="Observaciones" value={observaciones} onChangeText={setObservaciones} />
      <TextInput style={styles.input} placeholder="Fecha de ingreso" value={fecha} editable={false}/>

      <DateTimePicker
  value={fecha ? new Date(fecha) : new Date()}
  mode="date"
  display="default"
  onChange={(event, selectedDate) => {
    if (selectedDate) {
      setFecha(selectedDate.toISOString().split('T')[0]);
    }
  }}
/>
      



      <Button title="Guardar registro" onPress={handleGuardar} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
});
