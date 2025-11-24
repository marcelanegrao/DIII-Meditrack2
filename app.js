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
  RefreshControl 
} from 'react-native';
import axios from 'axios';

// --- CONFIGURAÇÃO DA API ---
// Substitua o link abaixo pelo endereço "Local Address" da aba PORTS do Codespace
// Exemplo: 'https://seunome-codespace-3000.preview.app.github.dev'
// OBS: Não coloque a barra '/' no final.
const API_URL = 'https://cuddly-halibut-97j7jqx45pgq395wq-3000.app.github.dev/'; 

export default function App() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- FUNÇÃO PARA BUSCAR DADOS (READ) ---
  const fetchMedicamentos = async () => {
    try {
      // Faz a chamada GET para /medicamentos
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

  // Função para recarregar ao puxar a lista para baixo
  const onRefresh = () => {
    setRefreshing(true);
    fetchMedicamentos();
  };

  // --- COMPONENTE DE ITEM DA LISTA ---
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.medNome}>{item.nome}</Text>
        <Text style={styles.medHorario}>{item.horario}</Text>
      </View>
      <Text style={styles.medDosagem}>Dosagem: {item.dosagem}</Text>
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
            <Text style={styles.emptyText}>Nenhum medicamento cadastrado.</Text>
          }
        />
      )}
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
    // Sombra para dar efeito de cartão
    elevation: 2, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.1, // iOS
    shadowRadius: 4, // iOS
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
});