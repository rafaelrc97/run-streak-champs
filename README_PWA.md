# SpeedRun - PWA Setup Guide

## 📱 Sobre o App

SpeedRun é um aplicativo de corrida inteligente e gamificado que registra todas as suas métricas de treino, permite competir com amigos através de rankings e desafios, e participar de torneios mensais com premiação via PIX.

## ✨ Funcionalidades

### 🏃 Rastreamento de Atividades
- Corrida, caminhada e ciclismo
- GPS em tempo real com mapa de calor de velocidade
- Métricas completas: distância, tempo, ritmo, velocidade
- Histórico completo de atividades
- Fotos pós-treino

### 🏆 Gamificação
- Sistema de desafios com recompensas
- Rankings semanais e mensais
- Medalhas e conquistas
- Registro de recordes pessoais

### 💰 Torneios
- Competições mensais com premiação
- Sistema de apostas via PIX
- Inscrição e pagamento integrados

### 👥 Social
- Feed de atividades
- Curtir e comentar
- Criar grupos de competição
- Notificações de desafios

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <seu-repo-url>

# Entre na pasta do projeto
cd speedrun

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O app estará rodando em `http://localhost:8080`

## 📦 Build para Produção

```bash
# Gere a build otimizada
npm run build

# Teste a build localmente
npm run preview
```

## 🌐 Deploy

### Netlify

1. Conecte seu repositório no [Netlify](https://netlify.com)
2. Configure o build:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy!

### Vercel

1. Conecte seu repositório no [Vercel](https://vercel.com)
2. O Vercel detecta automaticamente as configurações
3. Deploy!

### Firebase Hosting

```bash
# Instale o Firebase CLI
npm install -g firebase-tools

# Faça login
firebase login

# Inicialize o projeto
firebase init hosting

# Configure:
# - Public directory: dist
# - Single-page app: Yes

# Deploy
firebase deploy
```

## 📱 Instalação como PWA

### Android
1. Abra o app no Chrome
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"
4. Confirme

### iOS
1. Abra o app no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Confirme

### Desktop
1. Abra o app no Chrome/Edge
2. Clique no ícone de instalação na barra de endereço
3. Confirme a instalação

## 🔧 Configurações

### Mapbox Token
O token já está configurado no código. Para usar seu próprio token:

1. Crie uma conta em [Mapbox](https://mapbox.com)
2. Obtenha seu token público
3. Substitua em `src/pages/Activity.tsx`:

```typescript
mapboxgl.accessToken = "SEU_TOKEN_AQUI";
```

### PIX para Torneios
Configure sua chave PIX na tela de Torneios para receber prêmios.

## 🎨 Personalização

### Cores e Design
As cores e estilos do app estão definidos em:
- `src/index.css` - Variáveis CSS e tokens de design
- `tailwind.config.ts` - Configuração do Tailwind

### Ícones
Substitua os ícones em:
- `public/icon-192.png`
- `public/icon-512.png`

## 🔒 HTTPS

Para funcionalidades PWA completas (Service Worker, Geolocalização), é necessário HTTPS. Todos os serviços de deploy mencionados fornecem HTTPS automaticamente.

## 📄 Licença

© 2025 SpeedRun. Todos os direitos reservados a Rafael Carlos de Assis Santos.

## 🐛 Problemas?

Se encontrar algum problema:
1. Verifique se todas as dependências estão instaladas
2. Limpe o cache: `rm -rf node_modules && npm install`
3. Verifique se o Service Worker está registrado no DevTools

## 🎯 Próximos Passos

Para integração completa com backend (autenticação real, banco de dados, etc.):
1. Ative o Lovable Cloud no painel
2. Configure as tabelas de dados
3. Implemente a autenticação real
4. Conecte com APIs de pagamento (PIX)

---

Desenvolvido com ❤️ usando Lovable, React, TypeScript e Tailwind CSS
