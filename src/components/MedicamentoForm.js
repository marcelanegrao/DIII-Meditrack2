import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

// O componente Formulario será um modal que recebe funções por prop
// Recebe medicamentoToEdit para saber se está no modo edição
const MedicamentoForm = ({ isVisible, onClose, onSaveSuccess, API_URL, medicamentoToEdit }) => {
  // Inicializa os estados com base no item de edição, se existir
  const [nome, setNome] = useState(medicamentoToEdit ? medicamentoToEdit.nome : '');
  const [dosagem, setDosagem] = useState(medicamentoToEdit ? medicamentoToEdit.dosagem : '');
  const [horario, setHorario] = useState(medicamentoToEdit ? medicamentoToEdit.horario : '');
  const [loading, setLoading] = useState(false);

  // Efeito para preencher o formulário quando o medicamentoToEdit mudar (ao abrir o modal)
  // Isso garante que o formulário é limpo para novo cadastro ou preenchido para edição.
  useEffect(() => {
    if (medicamentoToEdit) {
      setNome(medicamentoToEdit.nome);
      setDosagem(medicamentoToEdit.dosagem);
      setHorario(medicamentoToEdit.horario);
    } else {
      clearForm(); // Limpa se for um novo cadastro
    }
  }, [medicamentoToEdit]);

  // Função para Limpar o Formulário
  const clearForm = () => {
    setNome('');
    setDosagem('');
    setHorario('');
  };

  // Função para enviar os dados para o Backend (POST ou PUT)
  const handleSubmit = async () => {
    if (!nome || !dosagem || !horario) {
      Alert.alert("Erro", "Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const dadosDoFormulario = { nome, dosagem, horario };
      
      if (medicamentoToEdit) {
        // MODO EDIÇÃO (UPDATE - PUT)
        const id = medicamentoToEdit.id;
        await axios.put(`${API_URL}/medicamentos/${id}`, dadosDoFormulario);
        Alert.alert("Sucesso", "Medicamento atualizado!");
      } else {
        // MODO CADASTRO (CREATE - POST)
        await axios.post(`${API_URL}/medicamentos`, dadosDoFormulario);
        Alert.alert("Sucesso", "Medicamento cadastrado!");
      }

      clearForm();
      onSaveSuccess(); // Recarrega a lista
      onClose(); // Fecha o modal
      
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao conectar ou salvar. Verifique a URL e o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Título dinâmico */}
          <Text style={styles.modalTitle}>
            {medicamentoToEdit ? "Editar Medicamento ✏️" : "Novo Medicamento 📝"}
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome do Medicamento (Ex: Dipirona)"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Dosagem (Ex: 500mg, 1x ao dia)"
            value={dosagem}
            onChangeText={setDosagem}
          />
          <TextInput
            style={styles.input}
            placeholder="Horário (Ex: 08:00, 12:00, 18:00)"
            value={horario}
            onChangeText={setHorario}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
                style={[styles.button, styles.buttonClose]} 
                onPress={onClose}
                disabled={loading}
            >
              <Text style={styles.textStyle}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.textStyle}>{medicamentoToEdit ? "Salvar Alterações" : "Salvar Medicamento"}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    button: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonSave: {
        backgroundColor: '#007bff', 
    },
    buttonClose: {
        backgroundColor: '#aaa', 
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default MedicamentoForm;