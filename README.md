# Sinfonia 🎵

Sinfonia é um aplicativo Full Stack de inteligência artificial musical, que além de atuar como um Karaokê com letras sincronizadas, oferece análises profundas, extração de sentimentos e traduções das suas músicas usando a **Google Gemini Audio API**.

## Estrutura do Projeto

O projeto adota uma arquitetura em pastas separadas para facilitar o desenvolvimento, manutenção e futura implantação.

- `frontend/`: Aplicativo Web em React (criado com Vite e estizado com Tailwind CSS).
- `backend/`: Servidor de API em Python (criado com FastAPI).

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- [Python](https://www.python.org/) (versão 3.9+ recomendada)
- Chave de API do [Google AI Studio](https://aistudio.google.com/) (Gemini API)

### Passo 1: Configurar a Chave da API

1. Na raiz do projeto (onde está localizado este README), copie o arquivo `.env.example` para criar um `.env`:
   ```bash
   cp .env.example .env
   ```
2. Abra o arquivo `.env` gerado e cole sua chave do Gemini.

### Passo 2: Inicializar o Backend (Python)

Abra um terminal e acesse a pasta `backend/`:

```bash
cd backend
```

Crie e ative um ambiente virtual:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

Instale as dependências requeridas:
```bash
pip install -r requirements.txt
```

Inicie o servidor de desenvolvimento:
```bash
uvicorn app.main:app --reload
```
O servidor da API estará rodando em `http://127.0.0.1:8000`.

### Passo 3: Inicializar o Frontend (React)

Abra outro terminal (mantendo o do backend rodando) e vá para a pasta `frontend/`:

```bash
cd frontend
```

Instale as dependências:
```bash
npm install
```

Inicie o ambiente de desenvolvimento do Vite:
```bash
npm run dev
```

Abra o navegador no endereço exibido (geralmente `http://localhost:5173`) e aproveite o Sinfonia!

---

## 🧪 Testes

### Testes do Backend (Pytest)
No diretório `backend`, com o ambiente virtual ativado:
```bash
pytest tests/
```

### Testes do Frontend (Vitest)
No diretório `frontend`:
```bash
npm run test
```
