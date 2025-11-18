# 📚 Guia: Como Adicionar Projetos ao Portfólio

Este guia passo a passo mostra como adicionar seus projetos de forma profissional e organizada.

---

## 📋 Pré-requisitos

- Git instalado
- Repositório clonado localmente
- GitHub acessível

---

## 🔄 Passo a Passo

### Passo 1: Escolha a Categoria

Determine em qual categoria seu projeto se encaixa melhor:

- **LLMs para Negócios** - Projetos com IA/LLMs
- **Análise de Dados** - Análises, visualizações, BI
- **Machine Learning** - Modelos de ML/NLP
- **Automação** - Scripts e ferramentas

### Passo 2: Crie a Estrutura da Pasta

```bash
cd /workspaces/LLMs_Negocios/projetos/[categoria]/
mkdir nome-do-seu-projeto
cd nome-do-seu-projeto
```

**Convenção de nomes:** Use `kebab-case` (letras minúsculas com hífens)

Exemplo: `chatbot-vendas`, `predicao-churn`, `analise-vendas-q3`

### Passo 3: Organize os Arquivos

Crie a seguinte estrutura:

```
seu-projeto/
├── README.md              # ⭐ Obrigatório - Documentação
├── requirements.txt       # Dependências Python
├── .gitignore            # Arquivos a ignorar no Git
├── src/                  # Código fonte
│   └── main.py
├── data/                 # Dados (se aplicável)
├── notebooks/            # Jupyter notebooks
├── tests/                # Testes unitários
└── docs/                 # Documentação extra
```

### Passo 4: Crie um README.md Profissional

```markdown
# 🎯 Nome do Projeto

## 📝 Descrição
Descreva brevemente o que seu projeto faz.

## 🎯 Objetivo
Qual problema resolve? Por que foi criado?

## 🛠️ Tecnologias
- Python 3.10+
- Biblioteca X, Y, Z
- Framework ABC

## 📊 Dataset
- Fonte: [Link/Descrição]
- Tamanho: X GB
- Registro de dados

## 🚀 Como Usar

### Instalação
\`\`\`bash
pip install -r requirements.txt
\`\`\`

### Execução
\`\`\`bash
python src/main.py
\`\`\`

## 📈 Resultados
- Métrica 1: Valor ✓
- Métrica 2: Valor ✓
- Insights principais

## 💡 Aprendizados Principais
1. Aprendizado 1
2. Aprendizado 2
3. Aprendizado 3

## 📚 Referências
- [Link 1]
- [Link 2]
- [Documentação oficial]

## 👤 Autor
Seu Nome | Data
```

### Passo 5: Prepare os Arquivos

#### requirements.txt
```
pandas==2.0.0
numpy==1.24.0
scikit-learn==1.3.0
matplotlib==3.7.0
jupyter==1.0.0
```

#### .gitignore
```
# Python
__pycache__/
*.py[cod]
*.egg-info/
dist/
build/

# Jupyter
.ipynb_checkpoints/

# Dados sensíveis
*.csv
*.xlsx
data/private/

# Ambiente
.env
.venv
```

### Passo 6: Organize o Código

**Boas práticas:**

```python
# src/main.py
"""Módulo principal do projeto"""

import logging
from src.utils import load_data, process_data

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Função principal"""
    logger.info("Iniciando processamento...")
    data = load_data()
    results = process_data(data)
    return results

if __name__ == "__main__":
    main()
```

### Passo 7: Versione no Git

```bash
# Adicione todos os arquivos
git add .

# Commit com mensagem clara
git commit -m "feat: adiciona projeto de análise de vendas"

# Envie para GitHub
git push origin main
```

### Passo 8: Atualize o README Principal

Adicione um link para seu projeto no README.md raiz:

```markdown
## 📂 Projetos Recentes

- [Nome do Projeto](./projetos/categoria/nome-do-projeto) - Breve descrição
```

---

## ✅ Checklist Final

- [ ] Pasta criada com nome em kebab-case
- [ ] README.md completo e bem formatado
- [ ] requirements.txt com todas as dependências
- [ ] .gitignore configurado
- [ ] Código limpo e comentado
- [ ] Exemplos de uso no README
- [ ] Métricas/resultados documentados
- [ ] Commit com mensagem descritiva
- [ ] Push enviado para GitHub
- [ ] Link adicionado ao README principal

---

## 💡 Dicas Profissionais

### 1. **Qualidade do README**
O README é a primeira impressão! Invista tempo nele.

### 2. **Código Limpo**
- Use nomes claros para variáveis
- Adicione docstrings
- Evite código duplicado

### 3. **Documentação**
- Explique o "porquê", não apenas o "o quê"
- Adicione exemplos práticos
- Cite referências

### 4. **Versionamento**
Use commits semânticos:
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` mudanças na documentação
- `refactor:` reorganização de código

### 5. **Licença**
Considere adicionar uma LICENSE (MIT é comum)

---

## 📞 Suporte

Dúvidas? Consulte:
- [GitHub Docs](https://docs.github.com)
- [Markdown Guide](https://www.markdownguide.org)
- [Python Best Practices](https://pep8.org)

---

*Última atualização: Novembro 2025*
