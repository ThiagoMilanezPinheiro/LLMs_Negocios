"""
Script para criar o índice FAISS do currículo
Execute antes de fazer deploy para evitar cold start
"""
import os
from pathlib import Path
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

CONTENT_PATH = "./content_linkedin"
FAISS_INDEX_DIR = "index_faiss_linkedin"
EMBEDDING_MODEL = "BAAI/bge-m3"

def extract_text_pdf(file_path):
    print(f"Extraindo texto do PDF: {file_path}")
    loader = PyMuPDFLoader(str(file_path))
    pages = loader.load()
    content = "\n".join([p.page_content for p in pages])
    print(f"PDF processado com sucesso: {len(pages)} páginas")
    return content

def create_index():
    docs_path = Path(CONTENT_PATH)
    
    if not docs_path.exists():
        print(f"ERRO: Diretório não encontrado: {docs_path}")
        return
    
    pdf_files = list(docs_path.glob("*.pdf"))
    print(f"Encontrados {len(pdf_files)} arquivos PDF")

    if len(pdf_files) < 1:
        print("ERRO: Nenhum arquivo PDF encontrado")
        return

    print("Processando documentos PDF...")
    loaded_documents = [extract_text_pdf(pdf) for pdf in pdf_files]

    print("Criando chunks de texto...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = []
    for doc_text in loaded_documents:
        chunks.extend(text_splitter.split_text(doc_text))
    print(f"Total de {len(chunks)} chunks criados")

    print(f"Gerando embeddings com modelo: {EMBEDDING_MODEL}")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'batch_size': 8, 'show_progress_bar': True}
    )

    print("Criando índice FAISS...")
    vectorstore = FAISS.from_texts(chunks, embedding=embeddings)

    # Criar diretório se não existir
    os.makedirs(FAISS_INDEX_DIR, exist_ok=True)
    
    vectorstore.save_local(FAISS_INDEX_DIR)
    print(f"✅ Índice salvo em: {FAISS_INDEX_DIR}")
    
    # Testar o índice
    print("\nTestando índice...")
    retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 3})
    test_query = "Qual a experiência profissional?"
    results = retriever.get_relevant_documents(test_query)
    print(f"Teste OK: {len(results)} documentos recuperados")
    print(f"Primeiro resultado: {results[0].page_content[:200]}...")

if __name__ == "__main__":
    create_index()
