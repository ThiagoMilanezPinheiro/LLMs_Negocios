# 🏗️ Arquitetura do Sistema - SafeBank Chatbot

## 📐 Visão Geral

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │
       │ Interface Web
       ▼
┌─────────────────────────────┐
│      Streamlit UI           │
│  (agent_app.py)             │
└──────┬──────────────────────┘
       │
       │ Input/History
       ▼
┌─────────────────────────────┐
│   Chat Flow Handler         │
│  - Validação entrada        │
│  - Gerenciamento histórico  │
└──────┬──────────────────────┘
       │
       │ Query
       ▼
┌─────────────────────────────┐
│   RAG Pipeline              │
│  1. Contextualize Question  │
│  2. Retrieve Documents      │
│  3. Generate Answer         │
└──┬───────────────────┬──────┘
   │                   │
   │ Reformulated Q    │ Context
   ▼                   ▼
┌────────────┐    ┌──────────────┐
│  Groq LLM  │    │    FAISS     │
│  (ChatGPT) │    │ Vector Store │
└────────────┘    └──────┬───────┘
                         │
                         │ Embeddings
                         ▼
                  ┌──────────────┐
                  │ HuggingFace  │
                  │  Embeddings  │
                  └──────────────┘
```

## 🧩 Componentes Principais

### 1. **Interface de Usuário (Streamlit)**
- **Responsabilidade:** Apresentação e interação
- **Tecnologia:** Streamlit
- **Funcionalidades:**
  - Chat interface
  - Histórico de mensagens
  - Debug panels (expansível)
  - Feedback visual (spinners, errors)

### 2. **Chat Flow Handler**
- **Responsabilidade:** Orquestração de conversas
- **Funções principais:**
  - `chat_llm_flow()`: Gerencia fluxo completo
  - Validação de entrada (tamanho, conteúdo)
  - Manutenção de histórico
  - Tratamento de erros

### 3. **RAG Pipeline**
- **Responsabilidade:** Recuperação e geração
- **Componentes:**
  - **Contextualize Chain:** Reformula pergunta com histórico
  - **Retriever:** Busca documentos relevantes
  - **Answer Chain:** Gera resposta final

### 4. **Vector Store (FAISS)**
- **Responsabilidade:** Busca semântica
- **Tecnologia:** FAISS (Facebook AI Similarity Search)
- **Processo:**
  1. Documentos → Chunks (1000 chars, overlap 200)
  2. Chunks → Embeddings (BAAI/bge-m3)
  3. Embeddings → Índice FAISS
  4. Query → MMR search → Top-3 chunks

### 5. **LLM Provider (Groq)**
- **Responsabilidade:** Geração de linguagem natural
- **Modelo:** deepseek-r1-distill-llama-70b
- **Parâmetros:**
  - Temperature: 0.7
  - Max retries: 2
  - Timeout: 60s

## 🔄 Fluxo de Dados

### Inicialização
```python
1. Load .env variables
2. Validate GROQ_API_KEY
3. Initialize LLM (ChatGroq)
4. On first query:
   - Load PDFs from content/
   - Create chunks
   - Generate embeddings
   - Build FAISS index
   - Initialize retriever
```

### Query Processing
```python
1. User input → Validation (length, empty)
2. Add HumanMessage to history
3. Contextualize question with history
4. Retrieve relevant chunks (MMR, k=3)
5. Build context from chunks (max 4000 chars)
6. Generate answer with LLM
7. Add AIMessage to history
8. Display answer + debug info
```

## 📊 Dados e Estado

### Session State (Streamlit)
```python
st.session_state = {
    "chat_history": [
        AIMessage("Olá..."),
        HumanMessage("Pergunta 1"),
        AIMessage("Resposta 1"),
        ...
    ],
    "retriever": <FAISS retriever object>
}
```

### Estrutura de Mensagens
```python
# LangChain message types
HumanMessage(content="texto do usuário")
AIMessage(content="texto do assistente")
```

### RAG Result
```python
{
    "answer": "Resposta final do LLM",
    "reformulated_question": "Pergunta contextualizada",
    "similarity_used": None,
    "used_chunks_preview": ["chunk1...", "chunk2..."]
}
```

## 🔐 Segurança

### Camadas de Proteção
1. **Validação de Entrada:**
   - Limite de 5000 caracteres
   - Sanitização básica
   - Detecção de input vazio

2. **API Key Management:**
   - Nunca hardcoded
   - Carregada via .env
   - Validação na inicialização

3. **Error Handling:**
   - Try-catch em todas operações críticas
   - Mensagens de erro amigáveis
   - Logging detalhado para debug

4. **Rate Limiting:**
   - Timeout de 60s por request
   - Max retries: 2

## 📈 Performance

### Otimizações
- **Chunk Size:** 1000 chars (balance context/speed)
- **Overlap:** 200 chars (mantém continuidade)
- **MMR Search:** Diversidade nos resultados
- **Context Limit:** 4000 chars (evita timeouts)
- **Index Persistence:** FAISS salvo em disco

### Métricas Esperadas
- **Tempo de inicialização:** 10-30s (depende dos PDFs)
- **Tempo de resposta:** 2-5s por query
- **Memória:** ~500MB-1GB (depende do modelo embedding)

## 🧪 Testabilidade

### Pontos de Teste
1. **Unidade:**
   - `extract_text_pdf()`: Validar extração
   - `load_llm()`: Validar inicialização
   - Validações de entrada

2. **Integração:**
   - Pipeline RAG completo
   - FAISS indexing/retrieval
   - LLM responses

3. **E2E:**
   - User flow completo
   - Múltiplas perguntas com contexto

## 🔧 Configurabilidade

### Variáveis de Ambiente
```env
GROQ_API_KEY         # Chave da API
GROQ_MODEL_ID        # Modelo a usar
GROQ_TEMPERATURE     # Criatividade (0-1)
CONTENT_PATH         # Diretório dos PDFs
EMBEDDING_MODEL      # Modelo de embeddings
FAISS_INDEX_DIR      # Diretório do índice
```

### Hyperparâmetros
```python
# Text Splitting
chunk_size = 1000
chunk_overlap = 200

# Retrieval
search_type = "mmr"
k = 3                # Top chunks
fetch_k = 4          # Pool para MMR

# Context
max_context_len = 4000  # chars
```

## 🚀 Escalabilidade

### Limitações Atuais
- Single-user session state
- In-memory FAISS index
- Sem cache de queries

### Melhorias Possíveis
1. **Multi-user:** Redis para session state
2. **Scaling:** Load balancer + múltiplas instâncias
3. **Cache:** Redis/Memcached para queries frequentes
4. **Database:** PostgreSQL com pgvector
5. **Monitoring:** Prometheus + Grafana

## 🎯 Padrões de Design

- **Chain of Responsibility:** RAG pipeline
- **Singleton:** LLM instance
- **Repository:** Vector store abstraction
- **Observer:** Streamlit reactive updates
- **Factory:** LLM loader

---

*Última atualização: Novembro 2025*
