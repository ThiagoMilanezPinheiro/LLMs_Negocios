# Exemplo de Estrutura de Projeto

Este arquivo demonstra a estrutura recomendada para um projeto no portfólio.

## 📁 Estrutura Recomendada

```
meu-projeto/
├── README.md                 # ⭐ Documentação principal
├── requirements.txt          # Dependências Python
├── .gitignore               # Arquivos ignorados no Git
├── src/                     # Código fonte
│   ├── __init__.py
│   ├── main.py             # Ponto de entrada principal
│   ├── config.py           # Configurações
│   ├── utils.py            # Funções utilitárias
│   └── models/             # Modelos ou classes principais
│       └── __init__.py
├── data/                   # Dados do projeto
│   ├── raw/               # Dados brutos (não modificados)
│   ├── processed/         # Dados processados
│   └── README.md          # Descrição dos dados
├── notebooks/             # Jupyter Notebooks
│   ├── 01_exploracao.ipynb
│   ├── 02_processamento.ipynb
│   └── 03_modelagem.ipynb
├── results/               # Resultados
│   ├── modelos/          # Modelos treinados (.pkl, .h5, etc)
│   ├── graficos/         # Gráficos gerados
│   └── relatorios/       # Relatórios em PDF, Excel, etc
├── tests/                # Testes unitários
│   ├── __init__.py
│   ├── test_utils.py
│   └── test_models.py
├── docs/                 # Documentação extra
│   ├── ARQUITETURA.md   # Arquitetura da solução
│   ├── API.md           # Documentação de API (se aplicável)
│   └── METODOS.md       # Métodos e algoritmos usados
└── scripts/             # Scripts de utilidade
    ├── train.py        # Script de treinamento
    ├── predict.py      # Script de predição
    └── evaluate.py     # Script de avaliação
```

## 📋 Checklist de Criação

### Configuração Inicial
- [ ] Pasta `src/` com `__init__.py`
- [ ] `README.md` completo
- [ ] `requirements.txt` com dependências
- [ ] `.gitignore` apropriado

### Código
- [ ] Código bem organizado em módulos
- [ ] Funções documentadas com docstrings
- [ ] Testes básicos implementados
- [ ] Tratamento de erros

### Documentação
- [ ] README claro e detalhado
- [ ] Exemplos de uso
- [ ] Instruções de instalação
- [ ] Descrição de resultados

### Versionamento
- [ ] Commits bem estruturados
- [ ] Mensagens de commit claras
- [ ] Histórico sem binários grandes
- [ ] Tags para versões importantes

## 💡 Boas Práticas

### Nomenclatura
```python
# ✓ BOM
variavel_descritiva = 10
def calcular_media(valores):
    pass

class ProcessadorDados:
    pass

# ✗ RUIM
x = 10
def calc(v):
    pass

class pd:
    pass
```

### Estrutura de Código
```python
# ✓ BOM
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

def funcao_principal():
    """Descreve a função em uma linha."""
    pass

if __name__ == "__main__":
    funcao_principal()

# ✗ RUIM
from *
import everything

def func():
    pass
```

### Tratamento de Erros
```python
# ✓ BOM
try:
    resultado = processar_dados(arquivo)
except FileNotFoundError:
    logger.error(f"Arquivo não encontrado: {arquivo}")
    raise
except Exception as e:
    logger.error(f"Erro inesperado: {str(e)}", exc_info=True)
    raise

# ✗ RUIM
try:
    resultado = processar_dados(arquivo)
except:
    pass
```

## 🚀 Próximos Passos

1. Escolha uma categoria (LLMs, Análise de Dados, ML, Automação)
2. Use este template como base
3. Adicione seus projetos gradualmente
4. Mantenha a documentação atualizada
5. Faça commits regulares

---

Para mais detalhes, consulte [COMO_ADICIONAR_PROJETOS.md](../guias/COMO_ADICIONAR_PROJETOS.md)
