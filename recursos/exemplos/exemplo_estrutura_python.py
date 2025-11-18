"""
Exemplo de script Python bem estruturado para um projeto.
Este é um template que você pode usar como base para seus projetos.
"""

import logging
import sys
from pathlib import Path
from typing import Optional, Dict, Any

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class DataProcessor:
    """
    Classe para processar dados.
    
    Exemplo:
        >>> processor = DataProcessor()
        >>> result = processor.process('input.csv')
    """
    
    def __init__(self, verbose: bool = True):
        """
        Inicializa o processador de dados.
        
        Args:
            verbose (bool): Se deve imprimir mensagens de debug
        """
        self.verbose = verbose
        logger.info("DataProcessor inicializado")
    
    def load_data(self, filepath: str) -> Dict[str, Any]:
        """
        Carrega dados de um arquivo.
        
        Args:
            filepath (str): Caminho do arquivo
            
        Returns:
            Dict: Dados carregados
            
        Raises:
            FileNotFoundError: Se arquivo não existe
        """
        try:
            if self.verbose:
                logger.info(f"Carregando dados de {filepath}")
            
            # Seu código aqui
            data = {}
            
            if self.verbose:
                logger.info("Dados carregados com sucesso")
            
            return data
            
        except FileNotFoundError:
            logger.error(f"Arquivo não encontrado: {filepath}")
            raise
        except Exception as e:
            logger.error(f"Erro ao carregar dados: {str(e)}")
            raise
    
    def process(self, filepath: str) -> Dict[str, Any]:
        """
        Processa dados.
        
        Args:
            filepath (str): Caminho do arquivo
            
        Returns:
            Dict: Dados processados
        """
        try:
            data = self.load_data(filepath)
            logger.info("Processamento concluído com sucesso")
            return data
            
        except Exception as e:
            logger.error(f"Erro no processamento: {str(e)}")
            raise


def main(input_file: Optional[str] = None) -> int:
    """
    Função principal.
    
    Args:
        input_file (Optional[str]): Arquivo de entrada
        
    Returns:
        int: Código de saída (0 = sucesso, 1 = erro)
    """
    try:
        logger.info("Iniciando aplicação...")
        
        processor = DataProcessor(verbose=True)
        
        if input_file:
            result = processor.process(input_file)
            logger.info(f"Resultado: {result}")
        else:
            logger.warning("Nenhum arquivo de entrada fornecido")
            return 1
        
        logger.info("Aplicação finalizada com sucesso")
        return 0
        
    except Exception as e:
        logger.error(f"Erro fatal: {str(e)}", exc_info=True)
        return 1


if __name__ == "__main__":
    # Executar aplicação
    exit_code = main()
    sys.exit(exit_code)
