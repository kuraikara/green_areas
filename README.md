# Flask Server

  

## Seguire le seguenti sezioni

  

### Configurare il database

- Creare un server postgis

- Nel file config.py inserire la chiave del proprio db (DB_TOKEN) nel formato: postgresql://<UTENTE(default: postgres)>:<PASSWORD>@localhost/<NOMEDB>

  

### Installare il server: primo avvio

- Avviare il programma install.bat nella cartella backend

  

### Avviare il server: solo dopo aver installato il server come sopra

1. Avviare il programma start.bat nella cartella backend

2. Questo avvierà il server con due prompt:

	- Uno specifico di debug del server

	- Uno per l'inserimento di comandi come: 
		*  setup: crea tabelle 
		*  clear: svuota il DB 
		*  turin: carica nel db la città di Torino
		*  london: carica nel db la città di Londra
		*  sanremo: carica nel db la città di Sanremo

  

## Log

  

- Piccola grafica con routing di prova

- importazione di lazy loading per caricamento reattivo

- caricamento aree sulla mappa parametrizzate da scegliere risoluzioni

- TODO: formattare il codice della mappa con oppurtuni metodi