import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  SafeAreaView, 
  StatusBar,
  Alert,
  RefreshControl,
  TouchableOpacity // Necessário para o Botão Flutuante (FAB) e botões de ação
} from 'react-native';
import axios from 'axios';

// Importa o componente que você criou
import MedicamentoForm from './src/components/MedicamentoForm'; 

// --- CONFIGURAÇÃO DA API ---
// Sua URL do Codespace, ajustada (sem a barra final)
const API_URL = 'https://cuddly-halibut-97j7jqx45pgq395wq-3000.app.github.dev'; 

export default function App() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  
  // NOVO ESTADO: Armazena o objeto do medicamento sendo editado
  const [medicamentoToEdit, setMedicamentoToEdit] = useState(null); 

  // --- FUNÇÃO PARA BUSCAR DADOS (READ) ---
  const fetchMedicamentos = async () => {
    try {
      const response = await axios.get(`${API_URL}/medicamentos`);
      setMedicamentos(response.data);
    } catch (error) {
      console.error("Erro ao buscar medicamentos:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados. Verifique a URL ou o servidor.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carrega os dados assim que o App abre
  useEffect(() => {
    fetchMedicamentos();
  }, []);

  // Função para recarregar ao puxar a lista para baixo (usada no onSaveSuccess também)
  const onRefresh = () => {
    setRefreshing(true);
    fetchMedicamentos();
  };
  
  // --- FUNÇÕES DE CONTROLE DO MODAL ---
  
  // Função para abrir o modal em modo de Edição (UPDATE)
  const openEditModal = (item) => {
    setMedicamentoToEdit(item); // Carrega os dados do item
    setIsModalVisible(true); // Abre o modal
  };

  // Função para fechar o Modal (Geral)
  const closeModal = () => {
    setIsModalVisible(false);
    setMedicamentoToEdit(null); // Limpa o estado de edição ao fechar
  };

  // --- FUNÇÃO PARA DELETAR DADOS (DELETE) ---
  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este medicamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              // Faz a chamada DELETE para /medicamentos/:id
              await axios.delete(`${API_URL}/medicamentos/${id}`);
              
              // Se a exclusão for bem-sucedida, recarrega a lista
              fetchMedicamentos(); 

              Alert.alert("Sucesso", "Medicamento excluído.");
            } catch (error) {
              console.error("Erro ao deletar:", error);
              Alert.alert("Erro", "Não foi possível excluir o medicamento.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };


  // --- COMPONENTE DE ITEM DA LISTA ---
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.medNome}>{item.nome}</Text>
        <Text style={styles.medHorario}>{item.horario}</Text>
      </View>
      <Text style={styles.medDosagem}>Dosagem: {item.dosagem}</Text>
      
      {/* Botões de Ação */}
      <View style={styles.actionButtons}> 
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)} // Chama a função de edição
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)} // Chama a função de exclusão
        >
          <Text style={styles.actionText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- RENDERIZAÇÃO DA TELA ---
  return (
    <SafeAreaView style={styles.container}>
      
      <StatusBar barStyle="dark-content" backgroundColor="#f0f2f5" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Medicamentos 💊</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={medicamentos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          // Configuração do "Pull to Refresh"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // Mostra isso se a lista estiver vazia
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum medicamento cadastrado. Clique no '+' para adicionar.</Text>
          }
        />
      )}
      
      {/* Botão Flutuante (FAB) para Abrir o Cadastro */}
      <TouchableOpacity 
        style={styles.fab}
        // Ao clicar, garante que o modo de edição está nulo antes de abrir
        onPress={() => { setMedicamentoToEdit(null); setIsModalVisible(true); }} 
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Componente Modal de Cadastro/Edição */}
      <MedicamentoForm
        isVisible={isModalVisible}
        onClose={closeModal} // Fecha e limpa o estado de edição
        onSaveSuccess={onRefresh} 
        API_URL={API_URL} 
        medicamentoToEdit={medicamentoToEdit} // Passa o item para o formulário
      />
    </SafeAreaView>
  );
}

// --- ESTILOS (CSS in JS) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  medHorario: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  medDosagem: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
  // ESTILOS: FAB (Botão Flutuante)
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007bff',
    borderRadius: 30,
    elevation: 8,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    lineHeight: 30,
  },
  // NOVOS ESTILOS: Botões de Ação do Card
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#ffc107', // Amarelo
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Vermelho
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});