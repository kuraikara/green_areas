# Flask Server

  

#### Seguire le seguenti sezioni

  

### Configurare il database 
## IMPORTANTE FARLO PRIMA DI INSTALLARE IL SERVER!

- Creare un server postgis

- Nel file backend/.flaskenv inserire la chiave del proprio db (DB_TOKEN) nel formato: postgresql://<UTENTE(default: postgres)>:<PASSWORD>@localhost/<NOMEDB>

  

### Installare il server: primo avvio

- Avviare il programma install.bat nella cartella backend

  

### Avviare il server: solo dopo aver installato il server come sopra

- Avviare il programma start.bat nella cartella backend
### Infine
- All'apertura del server vengono già create le tabelle con un utente amministratore
- Sul sito ci si può loggare con utente: admin, password: admin
- Una volta loggato dal bottone account in alto a destra > admin page > database è possibile pulire il db, crearlo, e inserire le tre città (ATTENZIONE! bisogna prima aver caricato i tre file delle città nella cartella backend/files) 
- L'upload del file non è ancora funzionante

## Doing
- Account management con pagina Admin basilare
- Inizio creazione pagina utente e profili pubblici
- Inizio aggiunta like ai parchi e storicizzazione nella pagina utente
- Prime idee sul raggiungimento di un singolo poligono tra quelli salvati
- Possibilità di seguire altri utenti e vedere le sue attività