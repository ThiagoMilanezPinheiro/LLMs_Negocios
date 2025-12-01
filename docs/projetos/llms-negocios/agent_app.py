import os
import logging
from pathlib import Path
from typing import List, Dict, Any

import streamlit as st
from dotenv import load_dotenv

# LangChain core pieces (runnable-style)
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import AIMessage, HumanMessage

# LLM provider (Groq)
from langchain_groq import ChatGroq

# Document handling / splits / embeddings / vectorstore
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

# -------------------------
# Logging config
# -------------------------
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

load_dotenv()

# -------------------------
# Validações de ambiente
# -------------------------
if not os.getenv("GROQ_API_KEY"):
    logger.error("GROQ_API_KEY não encontrada nas variáveis de ambiente")
    st.error("⚠️ Configuração incompleta: GROQ_API_KEY não configurada. Verifique o arquivo .env")
    st.stop()

# -------------------------
# Streamlit UI config
# -------------------------
st.set_page_config(
    page_title="SafeBank - Chatbot Inteligente 🏦",
    page_icon="🏦",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# CSS customizado para tema escuro similar ao HTML
st.markdown("""
<style>
    /* Tema escuro geral */
    .stApp {
        background: linear-gradient(135deg, #0a0e1a 0%, #1a1f35 100%);
        color: #e5e7eb;
    }
    
    /* Header customizado */
    .main-header {
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(124, 58, 237, 0.3);
        box-shadow: 0 8px 32px rgba(124, 58, 237, 0.15);
    }
    
    .main-title {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        text-align: center;
    }
    
    .subtitle {
        color: rgba(255, 255, 255, 0.7);
        text-align: center;
        font-size: 1.1rem;
        margin-top: 0.5rem;
    }
    
    /* Estilo das mensagens do chat */
    .stChatMessage {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(124, 58, 237, 0.2);
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
        transition: all 0.3s ease;
    }
    
    .stChatMessage:hover {
        border-color: rgba(124, 58, 237, 0.5);
        box-shadow: 0 4px 16px rgba(124, 58, 237, 0.15);
    }
    
    /* Input do chat */
    .stChatInputContainer {
        border-top: 1px solid rgba(124, 58, 237, 0.3);
        padding-top: 1rem;
        background: rgba(0, 0, 0, 0.2);
    }
    
    /* Botões e elementos interativos */
    .stButton > button {
        background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
        box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
        transform: translateY(-2px);
    }
    
    /* Expander customizado */
    .streamlit-expanderHeader {
        background: rgba(124, 58, 237, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(124, 58, 237, 0.3);
    }
    
    /* Spinner */
    .stSpinner > div {
        border-top-color: #7c3aed !important;
    }
    
    /* Info boxes */
    .element-container div[data-testid="stMarkdownContainer"] {
        color: #e5e7eb;
    }
    
    /* Scrollbar */
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }
    
    ::-webkit-scrollbar-thumb {
        background: rgba(124, 58, 237, 0.5);
        border-radius: 5px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(124, 58, 237, 0.7);
    }
    
    /* Cards de informação */
    .info-card {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid rgba(59, 130, 246, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .success-card {
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .warning-card {
        background: rgba(234, 179, 8, 0.1);
        border: 1px solid rgba(234, 179, 8, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Header customizado
st.markdown("""
<div class="main-header">
    <h1 class="main-title">🏦 SafeBank - Chatbot Inteligente</h1>
    <p class="subtitle">Assistente Virtual com IA • Powered by Groq & LangChain</p>
</div>
""", unsafe_allow_html=True)

# -------------------------
# Configs / hyperparams
# -------------------------
ID_MODEL = os.getenv("GROQ_MODEL_ID", "deepseek-r1-distill-llama-70b")
TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", 0.7))
CONTENT_PATH = os.getenv("CONTENT_PATH", "/content")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "BAAI/bge-m3")  # or sentence-transformers/all-mpnet-base-v2
FAISS_INDEX_DIR = os.getenv("FAISS_INDEX_DIR", "index_faiss")

# -------------------------
# LLM loader
# -------------------------
def load_llm(model_id: str = ID_MODEL, temperature: float = TEMPERATURE):
    """
    Inicializa a LLM ChatGroq.
    Ajuste params conforme SDK do provedor.
    """
    try:
        logger.info(f"Inicializando LLM com modelo: {model_id}")
        llm = ChatGroq(
            model=model_id,
            temperature=temperature,
            max_tokens=None,
            timeout=60,  # timeout de 60 segundos
            max_retries=2,
        )
        return llm
    except Exception as e:
        logger.error(f"Erro ao inicializar LLM: {str(e)}")
        raise

try:
    llm = load_llm()
except Exception as e:
    st.error(f"⚠️ Erro ao conectar com o serviço de IA: {str(e)}")
    st.stop()

# -------------------------
# Utilidades
# -------------------------
def extract_text_pdf(file_path):
    """
    Carrega um PDF com PyMuPDFLoader e concatena as páginas em um único texto.
    """
    try:
        logger.info(f"Extraindo texto do PDF: {file_path}")
        loader = PyMuPDFLoader(str(file_path))
        pages = loader.load()  # lista de Page-like docs
        content = "\n".join([p.page_content for p in pages])
        logger.info(f"PDF processado com sucesso: {len(pages)} páginas")
        return content
    except Exception as e:
        logger.error(f"Erro ao processar PDF {file_path}: {str(e)}")
        raise

# -------------------------
# Retriever / Index config
# -------------------------
def config_retriever(folder_path: str = CONTENT_PATH):
    """
    Carrega PDFs do diretório, cria chunks, gera embeddings e cria FAISS retriever.
    Retorna um retriever (objeto com get_relevant_documents).
    """
    try:
        docs_path = Path(folder_path)
        
        # Validar se o diretório existe
        if not docs_path.exists():
            logger.error(f"Diretório não encontrado: {docs_path}")
            st.error(f"⚠️ Diretório de conteúdo não encontrado: {folder_path}")
            st.info("💡 Dica: Crie a pasta './content' e adicione arquivos PDF para começar.")
            st.stop()
        
        pdf_files = list(docs_path.glob("*.pdf"))
        logger.info(f"Encontrados {len(pdf_files)} arquivos PDF em {docs_path}")

        if len(pdf_files) < 1:
            st.error("Nenhum arquivo PDF encontrado em: " + str(docs_path))
            st.info("💡 Adicione arquivos PDF na pasta para começar.")
            st.stop()

        # Carrega e concatena textos
        logger.info("Processando documentos PDF...")
        loaded_documents = [extract_text_pdf(pdf) for pdf in pdf_files]

        # Splitter
        logger.info("Criando chunks de texto...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = []
        for doc_text in loaded_documents:
            chunks.extend(text_splitter.split_text(doc_text))
        logger.info(f"Total de {len(chunks)} chunks criados")

        # Embeddings
        logger.info(f"Gerando embeddings com modelo: {EMBEDDING_MODEL}")
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

        # Vectorstore (FAISS)
        logger.info("Criando índice FAISS...")
        vectorstore = FAISS.from_texts(chunks, embedding=embeddings)

        # Persistir index local
        vectorstore.save_local(FAISS_INDEX_DIR)
        logger.info(f"Índice salvo em: {FAISS_INDEX_DIR}")

        # Criar retriever (objeto compatível com get_relevant_documents)
        retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 3, "fetch_k": 4})
        logger.info("Retriever configurado com sucesso")

        return retriever
    
    except Exception as e:
        logger.error(f"Erro ao configurar retriever: {str(e)}")
        st.error(f"⚠️ Erro ao processar documentos: {str(e)}")
        st.stop()

# -------------------------
# RAG: contextualize question -> retrieve -> answer
# -------------------------
# Prompt: reformular pergunta com histórico
context_q_system_prompt = (
    "Given the following chat history and the follow-up question which might reference context "
    "in the chat history, formulate a standalone question which can be understood without the chat history. "
    "Do NOT answer the question, only reformulate it if needed; otherwise return it as-is."
)

context_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", context_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "Question: {input}"),
    ]
)

# Prompt para Q&A (usar apenas os trechos)
system_prompt_qa = """Você é um assistente virtual prestativo e está respondendo perguntas gerais sobre os serviços de uma empresa.
Use somente o contexto fornecido para responder a pergunta. Se o contexto não contiver a resposta, seja honesto e diga que não há informação suficiente.
Mantenha a resposta concisa e responda em português.
"""

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", system_prompt_qa),
        ("human", "Pergunta: {input}\n\nContexto:\n{context}"),
    ]
)

# Encapsuladores (Runnables)
contextualize_chain = context_q_prompt | llm | StrOutputParser()
answer_chain = qa_prompt | llm | StrOutputParser()

def history_aware_retriever_fn(input_dict, retriever):
    """
    input_dict: {"input": question, "chat_history": [messages...]}
    retriever: object retornado por vectorstore.as_retriever()
    Retorna: lista de documentos (strings) que serão usados como contexto
    """
    question = input_dict.get("input")
    chat_history = input_dict.get("chat_history", [])

    # Reescrever pergunta considerando histórico
    reformulated = contextualize_chain.invoke({"input": question, "chat_history": chat_history})

    # Obter documentos relevantes (usa API padrão)
    try:
        # prefer explicit method if available
        if hasattr(retriever, "get_relevant_documents"):
            retrieved = retriever.get_relevant_documents(reformulated)
        elif hasattr(retriever, "get_relevant_texts"):
            retrieved = retriever.get_relevant_texts(reformulated)
        else:
            # fallback para runnable-style retriever (se for um Runnable)
            retrieved = retriever.invoke(reformulated)
    except Exception as e:
        # fallback mais simples: retorna vazio
        print("Erro ao recuperar documentos:", e)
        retrieved = []

    # Normaliza para lista de textos (cada doc: page_content ou str)
    texts = []
    for d in retrieved:
        if isinstance(d, str):
            texts.append(d)
        else:
            # objetos Document-like tem page_content
            content = getattr(d, "page_content", None)
            if content is None:
                # tente converter ao str
                texts.append(str(d))
            else:
                texts.append(content)

    return texts

def make_rag_response(question, chat_history, retriever):
    """
    Orquestra: reformular pergunta -> recuperar docs -> compor contexto -> obter resposta LLM
    Retorna string com resposta final e dados de debug mínimo.
    """
    # 1) recuperar trechos
    texts = history_aware_retriever_fn({"input": question, "chat_history": chat_history}, retriever)

    # 2) construir contexto concatenado (pode truncar se muito grande)
    # concatenar top-k textos em um único contexto
    max_context_len = 4000  # tokens approximation (heurística)
    context_builder = []
    current_len = 0
    for t in texts:
        t_len = len(t)
        if current_len + t_len > max_context_len:
            break
        context_builder.append(t)
        current_len += t_len
    context = "\n\n---\n\n".join(context_builder) if context_builder else ""

    # 3) se não há contexto, sinalizar ao usuário
    if not context:
        # Pergunta reformulada (para transparencia)
        reformulated = contextualize_chain.invoke({"input": question, "chat_history": chat_history})
        return {
            "answer": "Desculpe — não encontrei contexto suficiente nos documentos carregados para responder com segurança.",
            "reformulated_question": reformulated,
            "similarity_used": 0.0,
            "used_chunks_preview": [],
        }

    # 4) chamar chain de resposta
    final_input = {"input": question, "context": context}
    answer = answer_chain.invoke(final_input)

    # 5) montar debug simples (previews)
    previews = [t[:300].replace("\n", " ") + "..." for t in texts[:5]]

    return {
        "answer": answer,
        "reformulated_question": contextualize_chain.invoke({"input": question, "chat_history": chat_history}),
        "similarity_used": None,
        "used_chunks_preview": previews,
    }

# -------------------------
# Chat handlers (Streamlit)
# -------------------------
def chat_llm_flow(retriever, user_input):
    """
    Executa o fluxo de chat: registra histórico, gera resposta via RAG moderno.
    """
    try:
        # garantir estrutura de estado
        if "chat_history" not in st.session_state:
            st.session_state.chat_history = [AIMessage(content="Olá, sou o seu assistente virtual! Como posso te ajudar?")]

        # Validação básica de input
        if not user_input or len(user_input.strip()) == 0:
            logger.warning("Input vazio recebido")
            return "Por favor, digite uma pergunta.", {}
        
        # Limite de caracteres para prevenir abuso
        if len(user_input) > 5000:
            logger.warning(f"Input muito longo: {len(user_input)} caracteres")
            return "Pergunta muito longa. Por favor, seja mais conciso (máximo 5000 caracteres).", {}

        logger.info(f"Processando pergunta: {user_input[:100]}...")
        
        # adicionar entrada do usuário ao histórico
        st.session_state.chat_history.append(HumanMessage(content=user_input))

        # invocar RAG
        rag_result = make_rag_response(user_input, st.session_state.chat_history, retriever)

        # pegar resposta final e adicionar ao histórico
        res_text = rag_result.get("answer", "").strip()
        st.session_state.chat_history.append(AIMessage(content=res_text))
        
        logger.info("Resposta gerada com sucesso")

        return res_text, rag_result
    
    except Exception as e:
        logger.error(f"Erro no fluxo de chat: {str(e)}")
        error_msg = "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente."
        return error_msg, {"error": str(e)}

# -------------------------
# Streamlit UI main
# -------------------------

# Sidebar com informações
with st.sidebar:
    st.markdown("### 📊 Informações do Sistema")
    st.markdown(f"""
    <div class="info-card">
        <strong>🤖 Modelo:</strong> Llama 3.3 70B<br>
        <strong>🔍 Embeddings:</strong> MiniLM-L6-v2<br>
        <strong>⚡ Provider:</strong> Groq AI<br>
        <strong>🗄️ Vector DB:</strong> FAISS
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 💡 Dicas de Uso")
    st.markdown("""
    - Faça perguntas sobre os documentos carregados
    - O assistente mantém contexto da conversa
    - Respostas baseadas apenas em informações documentadas
    - Expandir 'Debug' para ver fontes utilizadas
    """)
    
    st.markdown("### 🔗 Links Úteis")
    st.markdown("""
    - [📖 Documentação](README.md)
    - [🏗️ Arquitetura](ARCHITECTURE.md)
    - [☁️ Deploy](DEPLOY.md)
    - [🐙 GitHub](https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios)
    """)

# Área de boas-vindas quando não há mensagens
if len(st.session_state.get("chat_history", [])) <= 1:
    st.markdown("""
    <div class="success-card">
        <h3 style="margin-top: 0;">👋 Bem-vindo ao SafeBank Chatbot!</h3>
        <p>Este é um assistente virtual inteligente que usa <strong>RAG (Retrieval-Augmented Generation)</strong> 
        para responder perguntas baseadas em documentos corporativos.</p>
        <h4>✨ O que posso fazer:</h4>
        <ul>
            <li>📄 Responder perguntas sobre os documentos carregados</li>
            <li>💬 Manter contexto da conversa anterior</li>
            <li>🔍 Buscar informações relevantes automaticamente</li>
            <li>📊 Mostrar as fontes utilizadas nas respostas</li>
        </ul>
        <h4>🚀 Como começar:</h4>
        <p>Digite sua pergunta na caixa abaixo e pressione Enter!</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Exemplos de perguntas
    st.markdown("### 💭 Exemplos de perguntas:")
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("""
        - Quais serviços estão disponíveis?
        - Como funciona o atendimento?
        - Quais são os horários?
        """)
    with col2:
        st.markdown("""
        - Quais investimentos são oferecidos?
        - Como entrar em contato?
        - Informações sobre segurança
        """)

# Input do chat
input_text = st.chat_input("💬 Digite sua mensagem aqui...")

# initialize state variables
if "chat_history" not in st.session_state:
    st.session_state.chat_history = [AIMessage(content="Olá, sou o seu assistente virtual! Como posso te ajudar?")]

if "retriever" not in st.session_state:
    st.session_state.retriever = None

# render existing chat history
st.markdown("---")
for message in st.session_state.chat_history:
    if isinstance(message, AIMessage):
        with st.chat_message("assistant", avatar="🤖"):
            st.markdown(message.content)
    elif isinstance(message, HumanMessage):
        with st.chat_message("user", avatar="👤"):
            st.markdown(message.content)

# handle input
if input_text is not None:
    with st.chat_message("user", avatar="👤"):
        st.markdown(input_text)

    with st.chat_message("assistant", avatar="🤖"):
        try:
            if st.session_state.retriever is None:
                with st.spinner("🔄 Carregando documentos e preparando o sistema..."):
                    st.session_state.retriever = config_retriever(CONTENT_PATH)
            
            with st.spinner("🤔 Processando sua pergunta..."):
                answer, debug = chat_llm_flow(st.session_state.retriever, input_text)
            
            st.markdown(answer)

            # opcional: mostrar debug (collapse)
            if debug and "error" not in debug:
                with st.expander("🔍 Debug (trechos utilizados)", expanded=False):
                    st.markdown(f"**Pergunta reformulada:** `{debug.get('reformulated_question')}`")
                    st.markdown("**Preview dos trechos usados:**")
                    for i, p in enumerate(debug.get("used_chunks_preview", []), 1):
                        st.markdown(f"{i}. {p}")
        
        except Exception as e:
            logger.error(f"Erro crítico na interface: {str(e)}")
            st.error("⚠️ Ocorreu um erro inesperado. Por favor, recarregue a página.")
            st.exception(e)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; padding: 1rem;">
    SafeBank Chatbot v1.0 | Powered by Groq AI & LangChain | 
    <a href="https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios" target="_blank" style="color: #7c3aed;">GitHub</a>
</div>
""", unsafe_allow_html=True)

