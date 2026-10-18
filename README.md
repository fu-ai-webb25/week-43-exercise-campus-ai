# CampusAI – Din digitala studieassistent

## Om uppgiften

I den här övningen ska du vidareutveckla **CampusAI**, en AI-driven studieassistent som hjälper studerande att hitta information om sitt universitet.

Du får tillgång till ett färdigt fullstackprojekt med React och Express. Applikationen fungerar redan som en vanlig AI-chatt, men saknar möjligheten att hämta information från universitetets egna dokument.

Din uppgift är att implementera **RAG (Retrieval-Augmented Generation)** så att studieassistenten kan besvara frågor om exempelvis examinationer, kursregistrering, bibliotekets öppettider och andra campusrelaterade frågor.

För att göra detta ska du använda **LangChain.js och Supabase** för att lagra och hämta relevant information som sedan används av språkmodellen för att generera svar.

## Kom igång

### 1. Installera och starta projektet

Projektet består av två separata delar: frontend och backend.

Öppna en terminal i respektive mapp och installera projektets beroenden:

```bash
npm install
```

Starta sedan utvecklingsservern med:

```bash
npm run dev
```

Detta kommando används för både frontend och backend. Båda utvecklingsservrarna behöver vara igång för att applikationen ska fungera.

### 2. Konfigurera backend

För att backend ska fungera behöver du skapa en `.env`-fil i backendmappen med följande miljövariabler:

```env
SUPABASE_URL=
SUPABASE_KEY=
OLLAMA_LLM=
OLLAMA_EMBEDDING_MODEL=
```

Fyll i dina uppgifter från Supabase samt namnen på de Ollama-modeller du vill använda.

Se till att Ollama är installerat, att modellerna finns nedladdade och att Ollama körs.

## Din uppgift

Implementera en komplett RAG-kedja där applikationen:

1. Lagrar universitetets dokument som embeddings i Supabase.
2. Omformulerar användarens fråga till en *Standalone Question* med hjälp av konversationshistoriken.
3. Använder en retriever för att hämta relevant information från Supabase.
4. Skickar frågan och den hämtade informationen till språkmodellen.
5. Genererar ett svar baserat på informationen i dokumentet.

**Dokumentet som ska användas samt startkoden för att läsa in och ladda upp det till Supabase finns redan i backendprojektet.**
Instruktioner för att läsa in och ladda upp dokumentet till Supabase [hittar du här](./backend/SUPABASE_SETUP.md)

## Målsättning

När du är färdig ska CampusAI kunna besvara frågor om universitetet med hjälp av den information som lagrats i Supabase.

Assistenten ska även kunna förstå följdfrågor utifrån tidigare meddelanden i konversationen.

Om informationen som efterfrågas inte finns i dokumentet ska assistenten kunna tala om detta istället för att hitta på ett svar.
