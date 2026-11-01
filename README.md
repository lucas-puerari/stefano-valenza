# Stefano Valenza — sito statico

Sito Astro con contenuti in Markdown e pubblicazione automatica su GitHub Pages. Non servono database o CMS.

## Lavorare in locale

Servono Node.js 24 e npm. Clona il repository, poi:

```sh
npm ci
npm run dev
```

Apri l'indirizzo mostrato nel terminale (di norma `http://localhost:4321/`). Le modifiche ai file Markdown e al sito appaiono automaticamente nel browser. Per controllare la build di produzione:

```sh
npm run check
npm run build
npm run preview
```

`dist/` è il sito generato, non va modificato né caricato su Git. In locale si usa `/`; su GitHub Pages gli URL includono automaticamente il nome del repository, se necessario.

## Scrivere un articolo

Crea un file `content/articoli/nome-articolo.md` (usa un nome breve, minuscolo e con trattini). Esempio:

```md
---
title: "Una birra da raccontare"
description: "Una frase breve che descrive l'articolo."
date: 2026-03-02
type: recensione
brewery: "Nome del birrificio"
style: "Pils"
draft: true
---

Qui inizia il testo. Puoi usare **grassetto**, link e titoli `##`.
```

Campi obbligatori: `title`, `description`, `date` (formato `AAAA-MM-GG`), `type` (`recensione`, `guida` o `storia`). `brewery`, `style`, `cover`, `coverAlt` e `draft` sono facoltativi. Se aggiungi `cover`, devi aggiungere `coverAlt` (descrizione dell'immagine). `draft: true` mostra l'articolo nell'anteprima con `npm run dev`, contrassegnato come bozza, ma lo esclude dalla build di produzione (`npm run build`, `npm run preview` e GitHub Pages). Togli `draft` o impostalo a `false` per pubblicarlo. C'è una bozza d'esempio in `content/articoli/esempio-recensione.md`.

Per una copertina, copia il file in `public/images/` e indica, per esempio:

```yaml
cover: "/images/nome-articolo.jpg"
coverAlt: "Bicchiere di birra sul tavolo"
```

Usa immagini tue o con licenza adeguata, preferibilmente compresse. Per inserire immagini **nel corpo** dell'articolo, salvale accanto al file Markdown e usa un percorso relativo, per esempio `![Descrizione](./foto.jpg)`: Astro le elabora durante la build. Non usare percorsi assoluti `/images/` nel corpo Markdown: su Pages con sottocartella non funzionerebbero.

Per creare una bozza senza usare il terminale, puoi anche aggiungere o modificare un file Markdown nell'interfaccia web di GitHub, selezionando un nuovo branch e aprendo una PR. Per l'anteprima visiva e gli aggiornamenti immediati, usa il server locale.

## Da contenuto a pubblicazione

1. Crea un branch: `git switch -c articolo/nome-articolo`.
2. Scrivi e controlla localmente con `npm run dev`; lascia `draft: true` finché il testo non è pronto.
3. Imposta `draft: false`, esegui `npm run check && npm run build`, fai commit e push: `git add . && git commit -m "Aggiungi articolo" && git push -u origin articolo/nome-articolo`.
4. Apri una pull request verso `main`. La workflow controlla tipi e build sulla PR, **senza pubblicare**.
5. Dopo la revisione, fai merge su `main`: la stessa workflow costruisce e pubblica automaticamente su GitHub Pages. Per correggere un articolo, segui lo stesso percorso con un nuovo branch e una nuova PR.

## Configurare GitHub Pages (una volta sola)

1. Crea un repository GitHub e imposta `main` come branch principale; fai push di questo progetto (incluso `package-lock.json`).
2. In **Settings → Pages → Build and deployment**, seleziona **GitHub Actions** come source. In **Settings → Actions → General** assicurati che le Actions siano abilitate.
3. Consigliato: in **Settings → Branches** aggiungi una regola per `main` che richieda la PR e il successo del job **build** prima del merge (e impedisca i push diretti). Per repository privati verifica che il piano GitHub supporti Pages e le regole di protezione desiderate.
4. Al primo push su `main` parte il deploy. L'indirizzo predefinito è `https://UTENTE.github.io/NOME-REPO/` (o `https://UTENTE.github.io/` per un repository `UTENTE.github.io`).

Per un dominio personalizzato, configurarlo in **Settings → Pages** e impostare in **Settings → Secrets and variables → Actions → Variables** la variabile `SITE_URL` al suo URL completo, per esempio `https://birra.example/`. In alternativa `SITE_URL` può indicare l'URL Pages completo se si desidera sovrascrivere quello rilevato automaticamente. La variabile è usata sia nella build delle PR sia nella pubblicazione.

Le modifiche a `main` (anche push diretti e avvio manuale della workflow) pubblicano il sito: la protezione del branch è ciò che rende obbligatorio il passaggio tramite PR.
