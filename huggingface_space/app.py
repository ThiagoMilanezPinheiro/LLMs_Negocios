import os
import logging
import gc
from langchain.schema import Document
from pathlib import Path
from typing import List, Dict, Any

import streamlit as st

# LangChain core pieces
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
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
        logging.FileHandler('app_linkedin.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# -------------------------
# Validações de ambiente
# -------------------------
# HuggingFace Spaces disponibiliza secrets como variáveis de ambiente
groq_api_key = os.getenv("GROQ_API_KEY")

if not groq_api_key:
    logger.error("GROQ_API_KEY não encontrada")
    # Idioma padrão para erro de configuração
    st.error("⚠️ Configuração incompleta: GROQ_API_KEY não configurada. Configure em Settings → Repository secrets")
    st.error("⚠️ Incomplete configuration: GROQ_API_KEY not set. Configure in Settings → Repository secrets")
    st.stop()

os.environ["GROQ_API_KEY"] = groq_api_key

# -------------------------
# Multilingual Support
# -------------------------
TRANSLATIONS = {
    "pt": {
        "page_title": "Thiago Milanez - Assistente Virtual 💼",
        "main_title": "💼 Assistente Virtual de Currículo",
        "subtitle": "Converse comigo para saber mais sobre a experiência profissional de Thiago Milanez",
        "language": "🌐 Idioma",
        "about_title": "ℹ️ Sobre este Assistente",
        "about_text": "Sou um assistente de IA que responde perguntas sobre o currículo e experiência profissional de **Thiago Milanez C Pinheiro**.",
        "features_title": "✨ Recursos",
        "feature1": "💬 Conversação natural",
        "feature2": "📄 Baseado no CV real",
        "feature3": "⚡ Respostas em < 1 segundo",
        "feature4": "🎯 Informações precisas",
        "tech_title": "🛠️ Tecnologias",
        "portfolio_button": "🏠 Voltar ao Portfólio",
        "chat_placeholder": "Pergunte sobre a experiência profissional de Thiago...",
        "loading_index": "🔄 Carregando índice FAISS...",
        "processing": "🤖 Processando sua pergunta...",
        "error_config": "⚠️ Configuração incompleta: GROQ_API_KEY não configurada. Configure em Settings → Repository secrets",
        "error_llm": "⚠️ Erro ao conectar com o serviço de IA:",
        "error_docs": "⚠️ Erro ao processar documentos:",
        "no_info": "Essa informação específica não está disponível no meu currículo atual. Posso ajudar com outras questões sobre minha experiência profissional.",
        "welcome_msg": "👋 Olá! Sou o assistente virtual de Thiago Milanez. Posso responder perguntas sobre experiência profissional, projetos, habilidades técnicas e formação acadêmica. Como posso ajudar?",
        "system_prompt_qa": """Você é um assistente virtual profissional representando Thiago Milanez C Pinheiro.

INSTRUÇÕES CRÍTICAS:
1. Use EXCLUSIVAMENTE as informações encontradas no CONTEXTO abaixo
2. NÃO invente, suponha ou adicione informações que não estejam no contexto
3. Se a informação não estiver no contexto, responda: "Essa informação específica não está disponível no meu currículo atual. Posso ajudar com outras questões sobre minha experiência profissional."
4. Seja objetivo, profissional e cite apenas fatos concretos do contexto
5. Para perguntas técnicas, mencione SOMENTE tecnologias e projetos listados no contexto
6. Responda em primeira pessoa como se fosse o próprio Thiago
7. Mantenha respostas concisas (máximo 5-7 linhas), focando no essencial

CONTEXTO DO CURRÍCULO:
{context}

PERGUNTA DO RECRUTADOR: {input}

RESPOSTA (baseada APENAS no contexto acima):""",
        "context_system_prompt": "Given the following chat history and the follow-up question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, only reformulate it if needed; otherwise return it as-is."
    },
    "en": {
        "page_title": "Thiago Milanez - Virtual Assistant 💼",
        "main_title": "💼 CV Virtual Assistant",
        "subtitle": "Chat with me to learn more about Thiago Milanez's professional experience",
        "language": "🌐 Language",
        "about_title": "ℹ️ About this Assistant",
        "about_text": "I am an AI assistant that answers questions about **Thiago Milanez C Pinheiro**'s resume and professional experience.",
        "features_title": "✨ Features",
        "feature1": "💬 Natural conversation",
        "feature2": "📄 Based on real CV",
        "feature3": "⚡ Answers in < 1 second",
        "feature4": "🎯 Accurate information",
        "tech_title": "🛠️ Technologies",
        "portfolio_button": "🏠 Back to Portfolio",
        "chat_placeholder": "Ask about Thiago's professional experience...",
        "loading_index": "🔄 Loading FAISS index...",
        "processing": "🤖 Processing your question...",
        "error_config": "⚠️ Incomplete configuration: GROQ_API_KEY not set. Configure in Settings → Repository secrets",
        "error_llm": "⚠️ Error connecting to AI service:",
        "error_docs": "⚠️ Error processing documents:",
        "no_info": "This specific information is not available in my current resume. I can help with other questions about my professional experience.",
        "welcome_msg": "👋 Hello! I'm Thiago Milanez's virtual assistant. I can answer questions about professional experience, projects, technical skills, and academic background. How can I help?",
        "system_prompt_qa": """You are a professional virtual assistant representing Thiago Milanez C Pinheiro.

CRITICAL INSTRUCTIONS:
1. Use EXCLUSIVELY the information found in the CONTEXT below
2. DO NOT invent, assume or add information that is not in the context
3. If the information is not in the context, respond: "This specific information is not available in my current resume. I can help with other questions about my professional experience."
4. Be objective, professional and cite only concrete facts from the context
5. For technical questions, mention ONLY technologies and projects listed in the context
6. Respond in first person as if you were Thiago himself
7. Keep answers concise (maximum 5-7 lines), focusing on essentials

RESUME CONTEXT:
{context}

RECRUITER QUESTION: {input}

ANSWER (based ONLY on the context above):""",
        "context_system_prompt": "Given the following chat history and the follow-up question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, only reformulate it if needed; otherwise return it as-is."
    }
}

# -------------------------
# Streamlit UI config
# -------------------------
st.set_page_config(
    page_title="Thiago Milanez - Assistente Virtual 💼",
    page_icon="💼",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS customizado para tema profissional LinkedIn
st.markdown("""
<style>
    /* Tema LinkedIn */
    .stApp {
        background: linear-gradient(135deg, #0a1929 0%, #1a2f45 100%);
        color: #e5e7eb;
    }
    
    /* Header customizado */
    .main-header {
        background: linear-gradient(135deg, rgba(0, 119, 181, 0.15) 0%, rgba(0, 119, 181, 0.08) 100%);
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(0, 119, 181, 0.4);
        box-shadow: 0 8px 32px rgba(0, 119, 181, 0.2);
    }
    
    .main-title {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #0077b5 0%, #00a0dc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
        text-align: center;
    }
    
    .subtitle {
        color: rgba(255, 255, 255, 0.8);
        text-align: center;
        font-size: 1.1rem;
        margin-top: 0.5rem;
    }
    
    /* Estilo das mensagens do chat */
    .stChatMessage {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(0, 119, 181, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin: 0.5rem 0;
        transition: all 0.3s ease;
    }
    
    .stChatMessage:hover {
        border-color: rgba(0, 119, 181, 0.6);
        box-shadow: 0 4px 16px rgba(0, 119, 181, 0.2);
    }
    
    /* Input do chat */
    .stChatInputContainer {
        border-top: 1px solid rgba(0, 119, 181, 0.4);
        padding-top: 1rem;
        background: rgba(0, 0, 0, 0.2);
    }
    
    /* Botões e elementos interativos */
    .stButton > button {
        background: linear-gradient(135deg, #0077b5 0%, #006097 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 0.5rem 1.5rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        background: linear-gradient(135deg, #006097 0%, #004d7a 100%);
        box-shadow: 0 4px 16px rgba(0, 119, 181, 0.4);
        transform: translateY(-2px);
    }
    
    /* Expander customizado */
    .streamlit-expanderHeader {
        background: rgba(0, 119, 181, 0.1);
        border-radius: 8px;
        border: 1px solid rgba(0, 119, 181, 0.3);
    }
    
    /* Cards de informação */
    .info-card {
        background: rgba(0, 119, 181, 0.15);
        border: 1px solid rgba(0, 119, 181, 0.4);
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .success-card {
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.3);
        border-radius: 12px;
        padding: 1rem;
        margin: 1rem 0;
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
        background: rgba(0, 119, 181, 0.5);
        border-radius: 5px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 119, 181, 0.7);
    }
</style>
""", unsafe_allow_html=True)

# -------------------------
# Initialize language BEFORE any access
# -------------------------
if "language" not in st.session_state:
    # Check URL parameter first (from portfolio)
    query_params = st.query_params
    url_lang = query_params.get("lang", None)
    
    if url_lang in ["pt", "en"]:
        st.session_state.language = url_lang
    else:
        st.session_state.language = "pt"  # Default to Portuguese

# Header customizado (bilíngue)
if st.session_state.language == "pt":
    st.markdown("""
<div class="main-header">
    <h1 class="main-title">💼 Thiago Milanez C Pinheiro</h1>
    <p class="subtitle">Assistente Virtual • Currículo Interativo • Engenheiro de IA</p>
</div>
""", unsafe_allow_html=True)
else:
    st.markdown("""
<div class="main-header">
    <h1 class="main-title">💼 Thiago Milanez C Pinheiro</h1>
    <p class="subtitle">Virtual Assistant • Interactive Resume • AI Engineer</p>
</div>
""", unsafe_allow_html=True)

# -------------------------
# Configs / hyperparams
# -------------------------
ID_MODEL = os.getenv("GROQ_MODEL_ID", "llama-3.3-70b-versatile")
TEMPERATURE = float(os.getenv("GROQ_TEMPERATURE", 0.2))
CONTENT_PATH = os.getenv("CONTENT_PATH_LINKEDIN", "./content_linkedin")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "BAAI/bge-m3")
FAISS_INDEX_DIR = os.getenv("FAISS_INDEX_DIR_LINKEDIN", "index_faiss_linkedin")

# -------------------------
# LLM loader
# -------------------------
def load_llm(model_id: str = ID_MODEL, temperature: float = TEMPERATURE):
    try:
        logger.info(f"Inicializando LLM com modelo: {model_id}")
        llm = ChatGroq(
            model=model_id,
            temperature=temperature,
            max_tokens=None,
            timeout=60,
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
    try:
        logger.info(f"Extraindo texto do PDF: {file_path}")
        loader = PyMuPDFLoader(str(file_path))
        pages = loader.load()
        content = "\n".join([p.page_content for p in pages])
        logger.info(f"PDF processado com sucesso: {len(pages)} páginas")
        return content
    except Exception as e:
        logger.error(f"Erro ao processar PDF {file_path}: {str(e)}")
        raise

# -------------------------
# Retriever / Index config
# -------------------------
@st.cache_resource(show_spinner="🔄 Carregando índice FAISS...")
def config_retriever(folder_path: str = CONTENT_PATH):
    try:
        # Verificar se índice FAISS já existe (otimização para cold start)
        faiss_path = Path(FAISS_INDEX_DIR)
        if faiss_path.exists() and (faiss_path / "index.faiss").exists():
            logger.info(f"Carregando índice FAISS existente de {FAISS_INDEX_DIR}")
            # Configurar embeddings com cache reduzido para economizar memória
            embeddings = HuggingFaceEmbeddings(
                model_name=EMBEDDING_MODEL,
                cache_folder="./cache",
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'batch_size': 1, 'show_progress_bar': False}
            )
            vectorstore = FAISS.load_local(FAISS_INDEX_DIR, embeddings, allow_dangerous_deserialization=True)
            retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 8, "fetch_k": 20})
            logger.info("Índice FAISS carregado com sucesso")
            # Forçar garbage collection após carregar modelo pesado
            gc.collect()
            return retriever
        
        docs_path = Path(folder_path)
        
        if not docs_path.exists():
            logger.error(f"Diretório não encontrado: {docs_path}")
            st.error(f"⚠️ Diretório de conteúdo não encontrado: {folder_path}")
            st.info("💡 Dica: Crie a pasta './content_linkedin' e adicione arquivos PDF com o currículo.")
            st.stop()
        
        pdf_files = list(docs_path.glob("*.pdf"))
        logger.info(f"Encontrados {len(pdf_files)} arquivos PDF em {docs_path}")

        if len(pdf_files) < 1:
            st.error("Nenhum arquivo PDF encontrado em: " + str(docs_path))
            st.info("💡 Adicione o currículo em PDF na pasta para começar.")
            st.stop()

        logger.info("Processando documentos PDF...")
        loaded_documents = [extract_text_pdf(pdf) for pdf in pdf_files]

        logger.info("Criando chunks de texto...")
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=600, chunk_overlap=100)
        chunks = []
        for doc_text in loaded_documents:
            chunks.extend(text_splitter.split_text(doc_text))
        logger.info(f"Total de {len(chunks)} chunks criados")

        logger.info(f"Gerando embeddings com modelo: {EMBEDDING_MODEL}")
        embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

        logger.info("Criando índice FAISS...")
        vectorstore = FAISS.from_texts(chunks, embedding=embeddings)

        vectorstore.save_local(FAISS_INDEX_DIR)
        logger.info(f"Índice salvo em: {FAISS_INDEX_DIR}")

        retriever = vectorstore.as_retriever(search_type="mmr", search_kwargs={"k": 8, "fetch_k": 20})
        logger.info("Retriever configurado com sucesso")

        return retriever
    
    except Exception as e:
        logger.error(f"Erro ao configurar retriever: {str(e)}")
        st.error(f"⚠️ Erro ao processar documentos: {str(e)}")
        st.stop()

# -------------------------
# RAG: contextualize question -> retrieve -> answer
# -------------------------
def get_context_prompt(language="pt"):
    """Retorna o prompt de contexto no idioma especificado"""
    return TRANSLATIONS[language]["context_system_prompt"]

def get_qa_prompt(language="pt"):
    """Retorna o prompt QA no idioma especificado"""
    return TRANSLATIONS[language]["system_prompt_qa"]

def history_aware_retriever_fn(input_dict, retriever, language="pt"):
    """Reformula a pergunta considerando histórico e retorna documentos relevantes"""
    question = input_dict.get("input")
    chat_history = input_dict.get("chat_history", [])

    # Criar chain de contextualização dinamicamente
    context_q_system_prompt = get_context_prompt(language)
    context_q_prompt = ChatPromptTemplate.from_messages([
        ("system", context_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "Question: {input}"),
    ])
    contextualize_chain = context_q_prompt | llm | StrOutputParser()

    reformulated = contextualize_chain.invoke({"input": question, "chat_history": chat_history})
    logger.info(f"Pergunta reformulada: '{reformulated}'")

    try:
        if hasattr(retriever, "get_relevant_documents"):
            retrieved = retriever.get_relevant_documents(reformulated)
        elif hasattr(retriever, "get_relevant_texts"):
            retrieved = retriever.get_relevant_texts(reformulated)
        else:
            retrieved = retriever.invoke(reformulated)
        
        logger.info(f"Retriever retornou {len(retrieved)} documentos")
        
    except Exception as e:
        logger.error(f"Erro ao recuperar documentos: {e}")
        retrieved = []

    texts = []
    for d in retrieved:
        if isinstance(d, str):
            texts.append(d)
        else:
            content = getattr(d, "page_content", None)
            if content is None:
                texts.append(str(d))
            else:
                texts.append(content)

    logger.info(f"Extraídos {len(texts)} textos dos documentos")
    if texts:
        logger.info(f"Preview do primeiro texto: {texts[0][:200]}")
    else:
        logger.warning("Nenhum texto extraído dos documentos!")

    return texts

def make_rag_response(question, chat_history, retriever, language="pt"):
    logger.info(f"make_rag_response chamado para pergunta: '{question[:100]}'")
    
    # Configurar prompts no idioma correto
    context_q_system_prompt = get_context_prompt(language)
    context_q_prompt = ChatPromptTemplate.from_messages([
        ("system", context_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "Question: {input}"),
    ])
    
    qa_system_prompt = get_qa_prompt(language)
    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", qa_system_prompt),
    ])
    
    contextualize_chain = context_q_prompt | llm | StrOutputParser()
    answer_chain = qa_prompt | llm | StrOutputParser()
    
    # Passar idioma para retriever function
    texts = history_aware_retriever_fn({"input": question, "chat_history": chat_history}, retriever, language)
    logger.info(f"history_aware_retriever_fn retornou {len(texts)} textos")

    max_context_len = 4000
    context_builder = []
    current_len = 0
    for t in texts:
        t_len = len(t)
        if current_len + t_len > max_context_len:
            break
        context_builder.append(t)
        current_len += t_len
    context = "\n\n---\n\n".join(context_builder) if context_builder else ""
    
    logger.info(f"Contexto final tem {len(context)} caracteres")

    if not context:
        logger.warning("Contexto vazio - retriever não encontrou documentos relevantes!")
        reformulated = contextualize_chain.invoke({"input": question, "chat_history": chat_history})
        no_info_msg = TRANSLATIONS[language]["no_info"]
        return {
            "answer": no_info_msg,
            "reformulated_question": reformulated,
            "similarity_used": 0.0,
            "used_chunks_preview": [],
        }

    final_input = {"input": question, "context": context}
    answer = answer_chain.invoke(final_input)

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
def chat_llm_flow(retriever, user_input, language="pt"):
    try:
        # Inicializar histórico com mensagem de boas-vindas no idioma correto
        if "chat_history" not in st.session_state:
            welcome_msg = TRANSLATIONS[language]["welcome_msg"]
            st.session_state.chat_history = [AIMessage(content=welcome_msg)]

        if not user_input or len(user_input.strip()) == 0:
            logger.warning("Input vazio recebido")
            if language == "pt":
                return "Por favor, digite uma pergunta.", {}
            else:
                return "Please type a question.", {}
        
        if len(user_input) > 5000:
            logger.warning(f"Input muito longo: {len(user_input)} caracteres")
            if language == "pt":
                return "Pergunta muito longa. Por favor, seja mais conciso (máximo 5000 caracteres).", {}
            else:
                return "Question too long. Please be more concise (maximum 5000 characters).", {}

        logger.info(f"Processando pergunta: {user_input[:100]}...")
        
        st.session_state.chat_history.append(HumanMessage(content=user_input))
        
        # Limitar histórico a 20 mensagens para economizar memória
        if len(st.session_state.chat_history) > 20:
            st.session_state.chat_history = st.session_state.chat_history[-20:]

        rag_result = make_rag_response(user_input, st.session_state.chat_history, retriever, language)

        res_text = rag_result.get("answer", "").strip()
        st.session_state.chat_history.append(AIMessage(content=res_text))
        
        # Limpar memória após resposta
        gc.collect()
        
        logger.info("Resposta gerada com sucesso")

        return res_text, rag_result
    
    except Exception as e:
        logger.error(f"Erro no fluxo de chat: {str(e)}")
        if language == "pt":
            error_msg = "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente."
        else:
            error_msg = "Sorry, an error occurred while processing your question. Please try again."
        return error_msg, {"error": str(e)}

# -------------------------
# Streamlit UI main
# -------------------------

# Sidebar com informações
with st.sidebar:
    # Seletor de idioma
    st.markdown(f"### {TRANSLATIONS[st.session_state.language]['language']}")
    
    language_options = {"🇧🇷 Português": "pt", "🇺🇸 English": "en"}
    selected_lang = st.radio(
        "",
        options=list(language_options.keys()),
        index=0 if st.session_state.language == "pt" else 1,
        label_visibility="collapsed"
    )
    
    # Atualizar idioma se mudou
    new_lang = language_options[selected_lang]
    if new_lang != st.session_state.language:
        st.session_state.language = new_lang
        # Limpar o histórico do chat ao trocar idioma
        if "chat_history" in st.session_state:
            del st.session_state.chat_history
        st.rerun()
    
    st.markdown("---")
    
    # Sobre o profissional (bilíngue)
    if st.session_state.language == "pt":
        st.markdown("### 👤 Sobre o Profissional")
        info_html = """
<div class="info-card">
<strong>Nome:</strong> Thiago Milanez C Pinheiro<br>
<strong>Cargo:</strong> Engenheiro de IA<br>
<strong>Especialização:</strong> LLMs & Machine Learning<br>
<strong>Certificações:</strong> PUC Minas, Oracle, ITIL
</div>"""
    else:
        st.markdown("### 👤 About the Professional")
        info_html = """
<div class="info-card">
<strong>Name:</strong> Thiago Milanez C Pinheiro<br>
<strong>Position:</strong> AI Engineer<br>
<strong>Specialization:</strong> LLMs & Machine Learning<br>
<strong>Certifications:</strong> PUC Minas, Oracle, ITIL
</div>"""
    st.markdown(info_html, unsafe_allow_html=True)
    
    # Perguntas sugeridas (bilíngue)
    if st.session_state.language == "pt":
        st.markdown("### 💡 Perguntas Sugeridas")
        st.markdown("""
- Qual sua experiência profissional?
- Quais tecnologias você domina?
- Pode falar sobre seus projetos?
- Quais suas certificações?
- Qual sua formação acadêmica?
- Experiência com LLMs e IA?
        """)
    else:
        st.markdown("### 💡 Suggested Questions")
        st.markdown("""
- What is your professional experience?
- What technologies do you master?
- Can you talk about your projects?
- What are your certifications?
- What is your academic background?
- Experience with LLMs and AI?
        """)
    
    # Links profissionais
    if st.session_state.language == "pt":
        st.markdown("### 🔗 Links Profissionais")
    else:
        st.markdown("### 🔗 Professional Links")
    
    st.markdown("""
- [💼 LinkedIn](https://www.linkedin.com/in/thiagomilanez-itil/)
- [🐙 GitHub](https://github.com/ThiagoMilanezPinheiro)
- [📁 Portfólio](https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios)
    """)
    
    st.markdown("---")
    
    # Botão para voltar à Home (bilíngue)
    portfolio_text = TRANSLATIONS[st.session_state.language]["portfolio_button"]
    st.markdown(f"""
    <a href="https://thiagomilanezpinheiro.github.io/LLMs_Negocios/" target="_blank" style="text-decoration: none;">
        <button style="
            width: 100%;
            background: linear-gradient(135deg, #0077b5 0%, #006097 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        " onmouseover="this.style.background='linear-gradient(135deg, #006097 0%, #004d7a 100%)'; this.style.boxShadow='0 4px 16px rgba(0, 119, 181, 0.4)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='linear-gradient(135deg, #0077b5 0%, #006097 100%)'; this.style.boxShadow='none'; this.style.transform='translateY(0)'">
            {portfolio_text}
        </button>
    </a>
    """, unsafe_allow_html=True)

# Área de boas-vindas quando não há mensagens
if len(st.session_state.get("chat_history", [])) <= 1:
    if st.session_state.language == "pt":
        st.markdown("""
        <div class="success-card">
            <h3 style="margin-top: 0;">👋  Bem-vindo ao Currículo Interativo!</h3>
            <p>Este assistente virtual foi treinado com o currículo e portfólio de <strong>Thiago Milanez</strong> 
            e pode responder perguntas como se fosse uma entrevista de emprego.</p>
            <h4>💼 O que você pode perguntar:</h4>
            <ul>
                <li>📊 Experiência profissional e trajetória</li>
                <li>🛠️ Habilidades técnicas e ferramentas</li>
                <li>🚀 Projetos realizados e resultados</li>
                <li>🎓 Formação e certificações</li>
                <li>🤖 Especialização em IA e LLMs</li>
            </ul>
            <h4>🎯 Perfeito para:</h4>
            <p>✅ Recrutadores e profissionais de RH<br>
                ✅ Gestores técnicos avaliando perfil<br>
                ✅ Conhecer melhor o candidato de forma interativa</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.info("💡 **Primeira vez aqui?** A primeira pergunta pode levar ~10 segundos para inicializar o modelo de IA. Depois disso, as respostas serão instantâneas!")
        
        st.markdown("### 💭 Exemplos de perguntas para RH:")
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("""
**Experiência:**
- Qual sua experiência com IA?
- Projetos de destaque?
- Tecnologias que domina?
            """)
        with col2:
            st.markdown("""
**Qualificações:**
- Formação acadêmica?
- Certificações obtidas?
- Diferenciais profissionais?
            """)
    else:
        st.markdown("""
        <div class="success-card">
            <h3 style="margin-top: 0;">👋  Welcome to the Interactive Resume!</h3>
            <p>This virtual assistant was trained with <strong>Thiago Milanez</strong>'s resume and portfolio 
            and can answer questions as if it were a job interview.</p>
            <h4>💼 What you can ask:</h4>
            <ul>
                <li>📊 Professional experience and career path</li>
                <li>🛠️ Technical skills and tools</li>
                <li>🚀 Completed projects and results</li>
                <li>🎓 Education and certifications</li>
                <li>🤖 Specialization in AI and LLMs</li>
            </ul>
            <h4>🎯 Perfect for:</h4>
            <p>✅ Recruiters and HR professionals<br>
                ✅ Technical managers evaluating profile<br>
                ✅ Learning more about the candidate interactively</p>
        </div>
        """, unsafe_allow_html=True)
        
        st.info("💡 **First time here?** The first question may take ~10 seconds to initialize the AI model. After that, responses will be instantaneous!")
        
        st.markdown("### 💭 Sample questions for HR:")
        col1, col2 = st.columns(2)
        with col1:
            st.markdown("""
**Experience:**
- What is your AI experience?
- Notable projects?
- Technologies you master?
            """)
        with col2:
            st.markdown("""
**Qualifications:**
- Academic background?
- Certifications obtained?
- Professional differentials?
            """)


# Input do chat (bilíngue)
chat_placeholder = TRANSLATIONS[st.session_state.language]["chat_placeholder"]
input_text = st.chat_input(chat_placeholder)

# initialize state variables - com idioma correto
if "chat_history" not in st.session_state:
    welcome_msg = TRANSLATIONS[st.session_state.language]["welcome_msg"]
    st.session_state.chat_history = [AIMessage(content=welcome_msg)]

# Carregar retriever uma única vez (cache_resource mantém entre reruns)
if "retriever" not in st.session_state or st.session_state.retriever is None:
    logger.info("Inicializando retriever...")
    try:
        st.session_state.retriever = config_retriever(CONTENT_PATH)
        logger.info("Retriever carregado com sucesso")
    except Exception as e:
        logger.error(f"Erro ao carregar retriever: {e}")
        error_msg = TRANSLATIONS[st.session_state.language]["error_docs"]
        st.error(f"{error_msg} {e}")
        st.stop()

# render existing chat history
st.markdown("---")
for message in st.session_state.chat_history:
    if isinstance(message, AIMessage):
        with st.chat_message("assistant", avatar="💼"):
            st.markdown(message.content)
    elif isinstance(message, HumanMessage):
        with st.chat_message("user", avatar="👔"):
            st.markdown(message.content)

# handle input
if input_text is not None:
    with st.chat_message("user", avatar="👔"):
        st.markdown(input_text)

    with st.chat_message("assistant", avatar="💼"):
        try:
            # Mensagem de carregamento bilíngue
            processing_msg = TRANSLATIONS[st.session_state.language]["processing"]
            with st.spinner(processing_msg):
                answer, debug = chat_llm_flow(st.session_state.retriever, input_text, st.session_state.language)
            
            st.markdown(answer)

            if debug and "error" not in debug:
                # Expander bilíngue
                if st.session_state.language == "pt":
                    expander_title = "🔍 Fontes do Currículo"
                    reformulated_label = "**Pergunta reformulada:**"
                    chunks_label = "**Trechos do currículo utilizados:**"
                else:
                    expander_title = "🔍 Resume Sources"
                    reformulated_label = "**Reformulated question:**"
                    chunks_label = "**Resume excerpts used:**"
                
                with st.expander(expander_title, expanded=False):
                    st.markdown(f"{reformulated_label} `{debug.get('reformulated_question')}`")
                    st.markdown(chunks_label)
                    for i, p in enumerate(debug.get("used_chunks_preview", []), 1):
                        st.markdown(f"{i}. {p}")
        
        except Exception as e:
            logger.error(f"Erro crítico na interface: {str(e)}")
            if st.session_state.language == "pt":
                st.error("⚠️ Ocorreu um erro inesperado. Por favor, recarregue a página.")
            else:
                st.error("⚠️ An unexpected error occurred. Please reload the page.")
            st.exception(e)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; padding: 1rem;">
    Thiago Milanez - Currículo Interativo v1.0 | Powered by Groq AI & LangChain | Hosted on 🤗 Hugging Face Spaces<br>
    <a href="https://www.linkedin.com/in/thiagomilanez-itil/" target="_blank" style="color: #0077b5;">LinkedIn</a> | 
    <a href="https://github.com/ThiagoMilanezPinheiro/LLMs_Negocios" target="_blank" style="color: #0077b5;">GitHub</a>
</div>
""", unsafe_allow_html=True)
