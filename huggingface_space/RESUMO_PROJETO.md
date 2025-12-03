# 📋 Resumo do Projeto: Assistente Virtual de Currículo LinkedIn

## 🎯 Visão Geral

Assistente virtual interativo baseado em IA que responde perguntas sobre o currículo profissional de Thiago Milanez, hospedado no HuggingFace Spaces.

**Links:**
- 🌐 **App em produção**: https://tjdhmilanez-linkedin-cv-assistant.hf.space
- 📊 **Dashboard HF**: https://huggingface.co/spaces/TJDHMILANEZ/linkedin-cv-assistant
- 💻 **GitHub**: https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios

---

## 📁 Estrutura de Arquivos

### **app.py** ⭐ (Arquivo Principal)
**Função:** Aplicação Streamlit que implementa o chatbot interativo

**Características principais:**
- Interface conversacional com histórico de chat
- Sistema RAG (Retrieval-Augmented Generation) para buscar informações do CV
- Integração com Groq AI (modelo llama-3.3-70b-versatile)
- Cache de recursos com `@st.cache_resource` para performance
- Logs detalhados para debugging
- UI customizada com tema LinkedIn (azul #0077b5)

**Tecnologias:**
- Streamlit (interface)
- LangChain (orquestração LLM + RAG)
- FAISS (busca vetorial)
- HuggingFaceEmbeddings (modelo BAAI/bge-m3)
- PyMuPDF (processamento de PDF)

---

### **Dockerfile** 🐳
**Função:** Configuração do container Docker para HuggingFace Spaces

**Configurações importantes:**
```dockerfile
FROM python:3.11-slim
EXPOSE 7860  # Porta padrão do HuggingFace Spaces
CMD ["streamlit", "run", "app.py", "--server.port=7860"]
```

**Por que essa configuração:**
- HuggingFace Spaces Docker **obrigatoriamente** usa porta 7860
- Python 3.11-slim para otimizar tamanho da imagem
- Dependências mínimas do sistema (apenas build-essential)

---

### **requirements.txt** 📦
**Função:** Lista de dependências Python do projeto

**Pacotes principais:**
- `streamlit>=1.28.0` - Framework web
- `langchain>=0.1.0` - Framework LLM
- `langchain-groq>=0.0.1` - Integração Groq AI
- `langchain-huggingface>=0.0.1` - Embeddings do HuggingFace
- `faiss-cpu>=1.7.4` - Busca vetorial eficiente
- `sentence-transformers>=2.2.0` - Modelos de embeddings
- `pymupdf>=1.23.0` - Processamento de PDF

**Observação:** Todos os pacotes foram testados e são compatíveis com HuggingFace Spaces.

---

### **content_linkedin/** 📄
**Função:** Pasta contendo o conteúdo do currículo em PDF

**Arquivos:**
- `CV_TiagoMilanez_AI_Optimized.pdf` - Currículo otimizado para IA
- `README.md` - Documentação da pasta

**Importância:**
Este é o arquivo que alimenta o sistema RAG. O PDF é processado para criar chunks de texto que são transformados em embeddings e armazenados no índice FAISS.

---

### **.streamlit/config.toml** ⚙️
**Função:** Configurações do servidor Streamlit

**Configurações críticas:**
```toml
[server]
port = 7860
address = "0.0.0.0"
enableCORS = true
enableXsrfProtection = true
```

**Por que essas configurações:**
- `enableCORS = true` - Necessário para HuggingFace Spaces (avisos resolvidos)
- `enableXsrfProtection = true` - Segurança contra CSRF
- `port = 7860` - Porta padrão do HuggingFace

---

### **README.md** 📖
**Função:** Documentação do projeto exibida no HuggingFace Spaces

**Conteúdo:**
- Metadados YAML do Space (sdk: docker, title, emoji)
- Descrição do projeto
- Como usar o assistente
- Stack técnica
- Links para LinkedIn e GitHub

**Importância:**
Este arquivo é a "página inicial" do Space no HuggingFace. Os metadados YAML são essenciais para configuração correta.

---

### **create_index.py** 🔧
**Função:** Script utilitário para criar índice FAISS localmente

**Uso:**
```bash
python create_index.py
```

**Quando usar:**
- Para pré-processar o índice FAISS antes do deploy
- Para testar embeddings localmente
- Para evitar processamento pesado durante startup

**Observação:** Atualmente o app cria o índice automaticamente na primeira execução, então este script é **opcional**.

---

### **.gitignore** 🚫
**Função:** Define arquivos ignorados pelo Git

**Principais exclusões:**
```
__pycache__/
*.log
.streamlit/secrets.toml  # Secrets locais
cache/
index_faiss_linkedin/  # Índice é gerado dinamicamente
```

**Por que ignorar `index_faiss_linkedin/`:**
O índice é criado automaticamente na primeira execução do app no HuggingFace Spaces, baseado no PDF do currículo.

---

## 🔄 Fluxo de Funcionamento

### 1. **Inicialização** (Startup do Container)
```
Docker Build → Instala dependências → Inicia Streamlit (porta 7860)
```

### 2. **Primeira Execução do App**
```
Carrega app.py → Verifica índice FAISS
├─ Se existe: Carrega (rápido ~10s)
└─ Se não existe: Cria do PDF (~3-5min)
```

### 3. **Processamento de Perguntas** (RAG Pipeline)
```
Pergunta do usuário
    ↓
Reformulação com LLM (contexto do histórico)
    ↓
Busca vetorial no FAISS (top 3 chunks)
    ↓
Monta contexto com chunks relevantes
    ↓
LLM gera resposta baseada no contexto
    ↓
Exibe resposta + fontes utilizadas
```

---

## 🔐 Variáveis de Ambiente / Secrets

### **GROQ_API_KEY** (Obrigatório)
- **Onde configurar:** Settings → Repository secrets no HuggingFace
- **Formato:** `gsk_xxxxxxxxxxxxxxxxxxxx`
- **Uso:** Autenticação na API do Groq AI

### Variáveis Opcionais (com defaults)
- `GROQ_MODEL_ID` - Modelo LLM (default: llama-3.3-70b-versatile)
- `GROQ_TEMPERATURE` - Criatividade (default: 0.7)
- `EMBEDDING_MODEL` - Modelo embeddings (default: BAAI/bge-m3)
- `CONTENT_PATH_LINKEDIN` - Pasta do CV (default: ./content_linkedin)

---

## 🚀 Deploy no HuggingFace Spaces

### **Passo a Passo:**
1. Criar Space no HuggingFace (tipo: Docker, visibilidade: Public)
2. Clonar repositório localmente
3. Configurar Git remote:
   ```bash
   git remote add space https://huggingface.co/spaces/USUARIO/SPACE-NAME
   ```
4. Adicionar secret `GROQ_API_KEY` no dashboard do HF
5. Fazer push:
   ```bash
   git push space main
   ```
6. Aguardar build (~5-7 minutos)

### **Troubleshooting Comum:**
- ❌ **Runtime error**: Verificar logs no dashboard
- ❌ **Port timeout**: Confirmar porta 7860 no Dockerfile
- ❌ **Module not found**: Verificar requirements.txt
- ❌ **Secret not found**: Configurar GROQ_API_KEY no HF

---

## 📊 Especificações Técnicas

### **Performance:**
- **Cold start**: ~3-5 minutos (primeira vez)
- **Warm start**: ~10-15 segundos (após índice criado)
- **Resposta média**: 3-8 segundos por pergunta

### **Recursos do HuggingFace Spaces:**
- **RAM**: 16GB (tier gratuito)
- **CPU**: Compartilhado
- **Storage**: Efêmero (índice FAISS recriado após restart)

### **Modelo LLM:**
- **Provider**: Groq AI (inference ultrarrápida)
- **Modelo**: llama-3.3-70b-versatile
- **Context window**: 8192 tokens
- **Temperatura**: 0.7 (balanceada)

### **Modelo de Embeddings:**
- **Nome**: BAAI/bge-m3
- **Dimensão**: 1024
- **Linguagem**: Multilíngue (PT-BR suportado)
- **Tamanho**: ~2.3GB

---

## 🎯 Funcionalidades Implementadas

✅ **Chat interativo** com histórico persistente  
✅ **Sistema RAG** com busca vetorial FAISS  
✅ **Reformulação de perguntas** com contexto  
✅ **Exibição de fontes** (chunks utilizados)  
✅ **UI customizada** (tema LinkedIn)  
✅ **Cache de recursos** (performance otimizada)  
✅ **Logs detalhados** (debugging facilitado)  
✅ **Limitação de histórico** (20 mensagens - economia de memória)  
✅ **Garbage collection** (limpeza automática de memória)  
✅ **Error handling** robusto  

---

## 🔧 Manutenção e Atualizações

### **Para atualizar o CV:**
1. Substituir `content_linkedin/CV_TiagoMilanez_AI_Optimized.pdf`
2. Deletar pasta `index_faiss_linkedin/` (se existir localmente)
3. Commit e push para HuggingFace
4. App recriará o índice automaticamente

### **Para atualizar dependências:**
1. Editar `requirements.txt`
2. Testar localmente (se possível)
3. Commit e push para HuggingFace
4. Aguardar rebuild

### **Para ajustar prompts:**
1. Editar `system_prompt_qa` no `app.py` (linha ~320)
2. Commit e push
3. Rebuild automático

---

## 📈 Melhorias Futuras (Roadmap)

🔲 **Adicionar mais fontes de dados** (LinkedIn, GitHub, portfólio)  
🔲 **Integrar com analytics** (rastrear perguntas mais comuns)  
🔲 **Adicionar feedback do usuário** (👍/👎 nas respostas)  
🔲 **Implementar rate limiting** (proteção contra abuse)  
🔲 **Criar versão multilíngue** (EN/PT-BR)  
🔲 **Adicionar exemplos de perguntas** (clicáveis)  
🔲 **Otimizar embeddings** (quantização para economizar RAM)  

---

## 📞 Suporte e Contato

**Desenvolvido por:** Thiago Milanez C Pinheiro  
**LinkedIn:** https://www.linkedin.com/in/thiagomilanez-itil/  
**GitHub:** https://github.com/ThiagoMilanezPinheiro  
**Email:** thiagomilanez.gsi@gmail.com  

---

## 📝 Histórico de Mudanças

### **Versão 1.0** (Dezembro 2025)
- ✅ Deploy inicial no HuggingFace Spaces
- ✅ Correção da porta para 7860
- ✅ Adicionado langchain-huggingface
- ✅ Mudança para modelo BAAI/bge-m3
- ✅ Implementado @st.cache_resource
- ✅ Carregamento imediato do retriever
- ✅ Logs detalhados para debugging
- ✅ Correção de CORS warnings

---

**Última atualização:** 02 de Dezembro de 2025  
**Status:** ✅ Em produção e funcionando
