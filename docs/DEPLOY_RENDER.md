# Deploy no Render.com - Assistente LinkedIn

## 🚀 Passo a Passo Completo

### 1. Preparar o Repositório Git

```bash
# Adicionar arquivos de configuração
git add docs/render.yaml docs/requirements.txt docs/.env.example
git commit -m "feat: Adiciona configuração para deploy no Render.com"
git push origin main
```

### 2. Criar Conta no Render.com

1. Acesse: https://render.com
2. Clique em **"Get Started"**
3. Faça login com sua conta GitHub (ThiagoMilanezPinheiro/LLMs_Negocios)

### 3. Criar Novo Web Service

1. No dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub: `LLMs_Negocios`
3. Configure:
   - **Name**: `linkedin-assistant` (ou nome de sua preferência)
   - **Region**: `Frankfurt (Central EU)` ou `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `docs`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `streamlit run agent_linkedin.py --server.port=$PORT --server.address=0.0.0.0 --server.headless=true`
   - **Plan**: `Free` (750h/mês)

### 4. Configurar Variáveis de Ambiente

No painel do Render, vá em **"Environment"** e adicione:

| Key | Value |
|-----|-------|
| `GROQ_API_KEY` | `sua-api-key-aqui` (copie do arquivo .env local) |
| `GROQ_MODEL_ID` | `llama-3.3-70b-versatile` |
| `GROQ_TEMPERATURE` | `0.7` |
| `CONTENT_PATH_LINKEDIN` | `./content_linkedin` |
| `EMBEDDING_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` |
| `FAISS_INDEX_DIR_LINKEDIN` | `index_faiss_linkedin` |
| `PYTHONUNBUFFERED` | `1` |

⚠️ **IMPORTANTE**: Copie sua `GROQ_API_KEY` do arquivo `.env` local

### 5. Deploy Automático

1. Clique em **"Create Web Service"**
2. Aguarde o build (5-10 minutos na primeira vez):
   - ✅ Installing dependencies...
   - ✅ Building Streamlit app...
   - ✅ Starting service...
3. Sua URL pública será: `https://linkedin-assistant-XXXXX.onrender.com`

### 6. Verificar Deploy

Acesse a URL gerada e teste:
- Pergunte: "Qual sua experiência profissional?"
- Verifique logs no painel do Render em **"Logs"**

---

## 📊 Características do Plano Gratuito

### ✅ Vantagens:
- **750 horas/mês** (suficiente para uso 24/7)
- **512MB RAM** (suficiente para seu app)
- **SSL automático** (HTTPS)
- **Deploy automático** a cada push no GitHub
- **Logs em tempo real**
- **URL pública** compartilhável

### ⚠️ Limitações:
- **Sleep após 15min** de inatividade
- **Primeira requisição leva ~30-50s** (cold start)
- **Build a cada deploy** (~5-10min)
- **Sem disco persistente** (FAISS é recriado no boot)

---

## 🔧 Otimizações Implementadas

### 1. Cache do FAISS
O índice FAISS é salvo localmente e reutilizado entre requisições na mesma sessão.

### 2. Embeddings Leves
Usando `all-MiniLM-L6-v2` (90MB) em vez de modelos maiores.

### 3. Logs Estruturados
Arquivo `app_linkedin.log` para debug em produção.

---

## 🚨 Troubleshooting

### Erro: "Application failed to start"
**Solução**: Verifique logs no Render:
```bash
# Procure por:
ModuleNotFoundError: No module named 'streamlit'
# → requirements.txt não foi encontrado
```

### Erro: "GROQ_API_KEY não encontrada"
**Solução**: Adicione a variável de ambiente no painel do Render.

### Erro: "Port already in use"
**Solução**: Render define `$PORT` automaticamente, não precisa configurar.

### Sleep/Cold Start muito lento
**Solução**: Considere upgrade para plano pago ($7/mês):
- Sem sleep automático
- 512MB → 2GB RAM
- Builds mais rápidos

---

## 🔄 Deploy Contínuo

Após configurar, todo `git push` dispara deploy automático:

```bash
# Fazer mudanças no código
git add docs/agent_linkedin.py
git commit -m "feat: Melhora prompt do assistente"
git push origin main

# Render detecta push e faz redeploy automático (~5min)
```

---

## 💡 Próximos Passos

### 1. Domínio Customizado (Opcional)
- Configure domínio próprio: `curriculo.thiagomilanez.com`
- Instruções: https://render.com/docs/custom-domains

### 2. Monitoramento
- Configure notificações de deploy no Render
- Integre com StatusCake ou UptimeRobot para monitorar uptime

### 3. Analytics
- Adicione Google Analytics ao Streamlit
- Monitore quantas pessoas acessam seu currículo

---

## 📞 Suporte

- **Render Docs**: https://render.com/docs
- **Streamlit Docs**: https://docs.streamlit.io/deploy/streamlit-community-cloud
- **LangChain Docs**: https://python.langchain.com/docs/get_started/introduction

---

## 🎯 URL Final

Após deploy completo, compartilhe sua URL:

**LinkedIn**: "Acesse meu currículo interativo com IA: https://linkedin-assistant.onrender.com"

**Portfolio**: Adicione botão no `index.html`:
```html
<a href="https://linkedin-assistant.onrender.com" target="_blank">
    💼 Currículo Interativo (IA)
</a>
```
