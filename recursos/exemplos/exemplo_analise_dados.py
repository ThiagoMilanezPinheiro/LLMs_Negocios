"""
Exemplo de análise de dados com Pandas e Matplotlib.
Usado como referência para projetos de análise de dados.
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# Configurar estilo
sns.set_style("whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)


def load_data(filepath: str) -> pd.DataFrame:
    """Carrega dados de um arquivo CSV."""
    return pd.read_csv(filepath)


def exploratory_analysis(df: pd.DataFrame) -> None:
    """Realiza análise exploratória dos dados."""
    
    print("=" * 60)
    print("ANÁLISE EXPLORATÓRIA DOS DADOS")
    print("=" * 60)
    
    # Informações básicas
    print("\n1. SHAPE E INFO")
    print(f"Shape: {df.shape}")
    print(f"\nInfo:\n{df.info()}")
    
    # Estatísticas descritivas
    print("\n2. ESTATÍSTICAS DESCRITIVAS")
    print(df.describe())
    
    # Valores faltantes
    print("\n3. VALORES FALTANTES")
    missing = df.isnull().sum()
    if missing.sum() > 0:
        print(missing[missing > 0])
    else:
        print("Nenhum valor faltante encontrado")
    
    # Duplicatas
    print("\n4. DUPLICATAS")
    print(f"Total de linhas duplicadas: {df.duplicated().sum()}")
    
    # Tipos de dados
    print("\n5. TIPOS DE DADOS")
    print(df.dtypes)


def create_visualizations(df: pd.DataFrame, output_dir: str = ".") -> None:
    """Cria visualizações dos dados."""
    
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Gráfico 1: Distribuição de variáveis numéricas
    numeric_cols = df.select_dtypes(include=['number']).columns
    
    if len(numeric_cols) > 0:
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        fig.suptitle('Distribuição de Variáveis Numéricas', fontsize=16)
        
        for idx, col in enumerate(numeric_cols[:4]):
            ax = axes[idx // 2, idx % 2]
            df[col].hist(ax=ax, bins=30, edgecolor='black')
            ax.set_title(f'Distribuição de {col}')
            ax.set_xlabel(col)
            ax.set_ylabel('Frequência')
        
        plt.tight_layout()
        plt.savefig(output_path / 'distribuicoes.png', dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Salvo: distribuicoes.png")
    
    # Gráfico 2: Correlação
    if len(numeric_cols) > 1:
        plt.figure(figsize=(10, 8))
        correlation_matrix = df[numeric_cols].corr()
        sns.heatmap(correlation_matrix, annot=True, fmt='.2f', cmap='coolwarm', center=0)
        plt.title('Matriz de Correlação')
        plt.tight_layout()
        plt.savefig(output_path / 'correlacao.png', dpi=300, bbox_inches='tight')
        plt.close()
        print(f"✓ Salvo: correlacao.png")


def generate_report(df: pd.DataFrame, output_file: str = "relatorio.txt") -> None:
    """Gera um relatório em texto."""
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=" * 60 + "\n")
        f.write("RELATÓRIO DE ANÁLISE DE DADOS\n")
        f.write("=" * 60 + "\n\n")
        
        f.write(f"Total de registros: {len(df)}\n")
        f.write(f"Total de colunas: {len(df.columns)}\n\n")
        
        f.write("COLUNAS:\n")
        for col in df.columns:
            f.write(f"  - {col} ({df[col].dtype})\n")
        
        f.write("\n" + "=" * 60 + "\n")
        f.write("ESTATÍSTICAS\n")
        f.write("=" * 60 + "\n\n")
        
        f.write(str(df.describe()))
    
    print(f"✓ Relatório salvo em: {output_file}")


def main():
    """Função principal."""
    
    # Exemplo com dados fictícios
    print("Criando dados de exemplo...")
    data = {
        'id': range(1, 101),
        'valor': [i * 10 for i in range(1, 101)],
        'categoria': ['A', 'B'] * 50,
        'data': pd.date_range('2024-01-01', periods=100)
    }
    df = pd.DataFrame(data)
    
    # Análise
    exploratory_analysis(df)
    
    # Visualizações
    create_visualizations(df, output_dir='./resultados')
    
    # Relatório
    generate_report(df, output_file='./resultados/relatorio.txt')
    
    print("\n✓ Análise concluída!")


if __name__ == "__main__":
    main()
