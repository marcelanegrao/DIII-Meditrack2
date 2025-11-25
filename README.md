# MEDITRACK: Gerenciador de Medicamentos
Este é um aplicativo mobile simples de gerenciamento de medicamentos, com funcionalidades de Cadastro (Create), Visualização (Read), Atualização (Update) e Exclusão (Delete).

Tecnologias
Front-end (Mobile): React Native com Expo.

Back-end (API): Node.js com Express (usa banco de dados em memória, ou seja, os dados resetam ao reiniciar o servidor).

Como Rodar o Projeto
O projeto é dividido em Front-end (App) e Back-end (API).

1. Back-end (API)
Acesse a pasta da API.

Instale: npm install

Inicie o servidor: node server.js

Importante (Codespaces): A porta 3000 precisa estar configurada como Pública para o celular acessar.

2. Front-end (App Mobile)
Acesse a pasta do Front-end.

Instale: npm install

Ajuste a Conexão: No arquivo App.js, altere a variável API_URL para o endereço público do seu Codespaces (Ex: https://...-3000.app.github.dev).

Inicie o Expo: npx expo start --tunnel 

Se tiver erros de versão, use o comando de correção de dependências: npx expo install --fix
caso o comando não funcione force a instalção da versão requisitada (Ex: npm install react@19.1.1)

Escaneie o QR Code com o aplicativo Expo Go.