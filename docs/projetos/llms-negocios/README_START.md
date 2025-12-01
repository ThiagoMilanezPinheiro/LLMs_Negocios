# 🚀 Como Iniciar a Aplicação SafeBank Chatbot

## 📋 Pré-requisitos

Certifique-se de que você já:
1. ✅ Instalou o Anaconda
2. ✅ Criou o ambiente conda `safebank`
3. ✅ Instalou as dependências

Se ainda não fez isso, siga as instruções abaixo.

---

## 🔧 Configuração Inicial (Primeira Vez)

### 1. Criar Ambiente Conda
```bash
conda create -n safebank python=3.11 -y
```

### 2. Ativar Ambiente
```bash
conda activate safebank
```

### 3. Instalar Dependências
```bash
cd "docs/projetos/llms-negocios"
pip install -r requirements.txt
```

### 4. Configurar Variáveis de Ambiente
```bash
# Copiar o exemplo
copy .env.example .env

# Editar .env e adicionar sua API key do Groq
# GROQ_API_KEY=sua_chave_aqui
```

---

## ▶️ Iniciar a Aplicação

### Método 1: Script Automático (Windows)
Basta dar duplo clique em:
```
start_app.bat
```

### Método 2: Terminal Manual

**PowerShell:**
```powershell
cd "docs/projetos/llms-negocios"
& "$env:USERPROFILE\anaconda3\envs\safebank\Scripts\streamlit.exe" run agent_app.py
```

**CMD / Git Bash:**
```bash
cd docs/projetos/llms-negocios
conda activate safebank
streamlit run agent_app.py
```

### Método 3: VS Code Terminal
```bash
cd docs/projetos/llms-negocios
streamlit run agent_app.py
```

---

## 🌐 Acessar a Aplicação

Após iniciar, a aplicação estará disponível em:
- **Local:** http://localhost:8501
- **Rede Local:** http://192.168.2.65:8501

Abra qualquer um desses links no seu navegador.

---

## 🛑 Parar a Aplicação

No terminal onde a aplicação está rodando:
- Pressione `Ctrl + C`

---

## 🐛 Troubleshooting

### Erro: "conda não reconhecido"
**Solução:** Adicione o Anaconda ao PATH ou use o caminho completo:
```powershell
& "$env:USERPROFILE\anaconda3\Scripts\conda.exe" activate safebank
```

### Erro: "streamlit não reconhecido"
**Solução:** Verifique se as dependências foram instaladas:
```bash
conda activate safebank
pip install -r requirements.txt
```

### Erro: "GROQ_API_KEY não encontrada"
**Solução:** Configure o arquivo `.env`:
1. Copie `.env.example` para `.env`
2. Adicione sua API key do Groq
3. Salve o arquivo

### Erro: "Nenhum PDF encontrado"
**Solução:** Adicione arquivos PDF na pasta `content/`:
```bash
mkdir content
# Copie seus PDFs para a pasta content/
```

### Aplicação muito lenta
**Solução:** Na primeira execução, o modelo de embeddings será baixado (~90MB). 
Após isso, será muito mais rápido.

---

## 📊 Status da Aplicação

Para verificar se está rodando:
1. Acesse http://localhost:8501
2. Você deve ver a interface do SafeBank Chatbot
3. O terminal mostrará logs das operações

---

## 🔄 Manter Aplicação Sempre Ativa

### Opção 1: Terminal Dedicado
Mantenha um terminal aberto com a aplicação rodando.

### Opção 2: Background (PowerShell)
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'docs/projetos/llms-negocios'; streamlit run agent_app.py"
```

### Opção 3: Deploy em Cloud
Para uso permanente, considere fazer deploy:
- Ver `DEPLOY.md` para instruções completas
- Opções: Streamlit Cloud, Heroku, AWS, etc.

---

## 📞 Suporte

- **Documentação Completa:** Ver `DEPLOY.md`
- **Arquitetura:** Ver `ARCHITECTURE.md`
- **Issues:** https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios/issues

---

*Última atualização: 30 de Novembro de 2025*
