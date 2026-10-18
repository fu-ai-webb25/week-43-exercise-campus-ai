# Supabase – Kom igång med RAG

Den här guiden visar hur du skapar en Supabase-databas för **CampusAI**, aktiverar vektorsökning och hittar uppgifterna som behövs i backendprojektets `.env`-fil.

## 1. Skapa ett projekt

1. Logga in på [supabase.com](https://supabase.com) och öppna **Dashboard**.
2. Klicka på **New project** (välj eller skapa en organisation om du blir ombedd).
3. Ange exempelvis **campus-ai** som projektnamn.
4. Välj ett säkert **Database password** och spara det på en säker plats.
5. Välj en region, gärna nära dig, och klicka på **Create new project**.
6. Vänta tills databasen är färdig att användas.

> Databaslösenordet är **inte** samma sak som den hemliga API-nyckel du senare använder i `.env`.

## 2. Aktivera pgvector och skapa tabellen

1. Öppna **SQL Editor** i vänstermenyn.
2. Klicka på **New query**.
3. Klistra in SQL-koden nedan och klicka på **Run**.

```sql
-- Aktivera vektorstöd.
create extension if not exists vector with schema extensions;

-- Här lagras textavsnitt (chunks) och deras embeddings.
create table if not exists public.documents (
  id bigserial primary key,
  content text not null,
  metadata jsonb,
  embedding extensions.vector(768)
);

-- LangChain använder funktionen för likhetssökning.
create or replace function public.match_documents (
  query_embedding extensions.vector(768),
  match_count int default 4,
  filter jsonb default '{}'::jsonb
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from public.documents
  where documents.metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

**Viktigt:** `768` är ett exempel på antalet dimensioner i embedding-vektorn. Det måste matcha den embedding-modell du använder i Ollama. Kontrollera modellens dimensioner innan du laddar upp dokumentet. Om din modell har ett annat antal dimensioner behöver du ändra `768` på **båda ställena** i SQL-koden innan du kör den.

## 3. Kontrollera att tabellen finns

1. Öppna **Table Editor** i vänstermenyn.
2. Välj schemat **public** om du behöver välja schema.
3. Öppna tabellen **documents**.

Du ska nu se kolumnerna `id`, `content`, `metadata` och `embedding`. Tabellen är tom tills du kör backendprojektets kod för att läsa in dokumentet och spara dess chunks.

## 4. Hitta projektets URL och API-nyckel

1. Öppna **Project Settings** (kugghjulet) och gå till **Data API**. Menynamnen kan skilja sig något mellan olika versioner av Supabase.
2. Kopiera **Project URL** (brukar se ut som `https://xxxxxxxx.supabase.co`).
3. Hitta projektets API-nycklar under **API Keys**. För den här backendövningen kan du använda projektets **secret key** (`sb_secret_...`) eller den äldre **service_role**-nyckeln om projektet använder äldre nyckeltyper.
4. Lägg in värdena i backendprojektets `.env`-fil:

```env
SUPABASE_URL=https://ditt-projekt.supabase.co
SUPABASE_KEY=din-hemliga-api-nyckel
OLLAMA_LLM=namnet-pa-din-chattmodell
OLLAMA_EMBEDDING_MODEL=namnet-pa-din-embeddingmodell
```

**Säkerhet:** Secret/service-role-nycklar är privilegierade och får **aldrig** läggas i React-frontend, publiceras på GitHub eller delas med andra. De ska endast användas i backend. Kontrollera att `.env` finns i `.gitignore`.

## 5. Ladda upp dokumentet

Dokumentet och startkoden för att läsa in det finns redan i backendprojektet.

För att dela upp texten och trycka upp den i databasem kör du följande kommando i backendmappen:

```bash
npm run seed
```

Seed-scriptet läser då in dokumentet och laddar upp dess chunks och embeddings till Supabase.

När scriptet har körts kan du öppna **Table Editor → documents** i Supabase och kontrollera att tabellen innehåller data.

## 6. Nästa steg

Nu kan du implementera din retriever med LangChains `SupabaseVectorStore`. Använd tabellnamnet `documents` och sökfunktionen `match_documents`, om du använder SQL-koden ovan.

> Om backendprojektet redan innehåller ett SQL-script med andra tabellnamn, kolumner eller en annan embedding-dimension ska du i första hand använda det scriptet och anpassa instruktionerna efter det.
