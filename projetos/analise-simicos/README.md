# Análise de Dados Simicos

Este projeto cria uma base simples para explorar dados sintéticos (simicos) com Python, pandas e visualizações.

## Objetivo

- carregar um conjunto de dados em CSV;
- realizar uma análise exploratória inicial;
- gerar estatísticas e gráficos úteis;
- servir como ponto de partida para projetos maiores.

## Estrutura

- `data/` — arquivos de dados de exemplo
- `src/` — código principal da análise
- `results/` — gráficos e relatórios gerados

## Como executar

1. Entre na pasta do projeto:
   ```bash
   cd projetos/analise-simicos
   ```
2. Crie um ambiente virtual com Python 3.11:
   ```bash
   py -3.11 -m venv venv
   venv\Scripts\activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Rode a análise:
   ```bash
   python src/main.py
   ```

Os resultados serão salvos em `results/`.
