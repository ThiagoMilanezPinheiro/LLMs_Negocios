# 🚀 Guia de Deploy - SafeBank Chatbot

## 📋 Pré-requisitos

- Python 3.8 ou superior
- Conta na Groq AI (para API key)
- 2GB+ de RAM disponível
- Documentos PDF para a base de conhecimento

## 🔧 Configuração Local

### 1. Clonar o Repositório
```bash
git clone https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios.git
cd LLMs_Negocios/docs/projetos/llms-negocios
```

### 2. Criar Ambiente Virtual
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Instalar Dependências
```bash
pip install -r requirements.txt
```

### 4. Configurar Variáveis de Ambiente
```bash
# Copiar o exemplo
copy .env.example .env

# Editar .env e adicionar sua API key
# GROQ_API_KEY=sua_chave_aqui
```

### 5. Preparar Documentos
```bash
# Criar pasta de conteúdo
mkdir content

# Adicionar seus arquivos PDF na pasta content/
```

### 6. Executar Localmente
```bash
streamlit run agent_app.py
```

Acesse: http://localhost:8501

---

## ☁️ Deploy em Streamlit Cloud

### 1. Preparar Repositório
- Certifique-se de que todos os arquivos estão commitados
- Não commite o arquivo `.env` (use `.gitignore`)

### 2. Acessar Streamlit Cloud
1. Acesse [streamlit.io/cloud](https://streamlit.io/cloud)
2. Faça login com GitHub
3. Clique em "New app"

### 3. Configurar App
- **Repository:** ThiagoMilanezPinheiro/LLMs_Negocios
- **Branch:** main
- **Main file path:** docs/projetos/llms-negocios/agent_app.py

### 4. Configurar Secrets
No painel de configuração, adicione:
```toml
GROQ_API_KEY = "sua_chave_aqui"
GROQ_MODEL_ID = "deepseek-r1-distill-llama-70b"
GROQ_TEMPERATURE = "0.7"
CONTENT_PATH = "./content"
EMBEDDING_MODEL = "BAAI/bge-m3"
FAISS_INDEX_DIR = "./index_faiss"
```

### 5. Deploy
- Clique em "Deploy!"
- Aguarde o build (3-5 minutos)

---

## 🐳 Deploy com Docker

### Criar Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar aplicação
COPY . .

# Criar diretórios necessários
RUN mkdir -p content index_faiss

# Expor porta
EXPOSE 8501

# Health check
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health

# Comando para iniciar
CMD ["streamlit", "run", "agent_app.py", "--server.port=8501", "--server.address=0.0.0.0"]
```

### Build e Run
```bash
# Build
docker build -t safebank-chatbot .

# Run
docker run -p 8501:8501 \
  -e GROQ_API_KEY=sua_chave \
  -v $(pwd)/content:/app/content \
  safebank-chatbot
```

---

## 🌐 Deploy em Serviços Cloud

### AWS EC2
1. Lançar instância Ubuntu
2. Instalar Python e dependências
3. Configurar nginx como proxy reverso
4. Usar systemd para gerenciar o serviço

### Google Cloud Run
```bash
gcloud run deploy safebank-chatbot \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Heroku
```bash
# Criar Procfile
echo "web: streamlit run agent_app.py --server.port=$PORT" > Procfile

# Deploy
heroku create safebank-chatbot
git push heroku main
```

---

## 🔒 Segurança

### Checklist de Produção
- [ ] API keys em variáveis de ambiente (nunca no código)
- [ ] Arquivo `.env` no `.gitignore`
- [ ] HTTPS habilitado
- [ ] Rate limiting configurado
- [ ] Logs de acesso habilitados
- [ ] Backup da base de conhecimento
- [ ] Monitoramento de erros (Sentry, etc.)
- [ ] Autenticação de usuários (se necessário)

### Variáveis Sensíveis
Nunca commite:
- `.env`
- `*.log`
- `index_faiss/` (índices gerados)
- Arquivos de configuração local

---

## 📊 Monitoramento

### Logs
```bash
# Visualizar logs
tail -f app.log

# Logs do Streamlit
tail -f ~/.streamlit/logs/*.log
```

### Métricas Importantes
- Tempo de resposta
- Taxa de erros
- Uso de memória
- Requisições por minuto
- Custo da API

---

## 🔄 Manutenção

### Atualizar Base de Conhecimento
1. Adicionar novos PDFs em `content/`
2. Deletar `index_faiss/`
3. Reiniciar aplicação (índice será recriado)

### Atualizar Dependências
```bash
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

### Backup
```bash
# Backup de configurações
tar -czf backup-$(date +%Y%m%d).tar.gz \
  content/ \
  .env \
  requirements.txt
```

---

## ⚠️ Troubleshooting

### Erro: "GROQ_API_KEY não encontrada"
- Verifique se o arquivo `.env` existe
- Confirme que a variável está definida corretamente

### Erro: "Nenhum arquivo PDF encontrado"
- Verifique se a pasta `content/` existe
- Adicione pelo menos um arquivo PDF

### Erro de Memória
- Reduza `chunk_size` no código
- Use menos PDFs
- Aumente recursos do servidor

### App Lento
- Verifique latência da API Groq
- Otimize número de chunks (parâmetro `k`)
- Use modelo mais leve

---

## 📞 Suporte

- **Issues:** https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios/issues
- **Documentação Streamlit:** https://docs.streamlit.io
- **Documentação Groq:** https://console.groq.com/docs

---

*Última atualização: Novembro 2025*
