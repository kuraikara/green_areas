# Flask Server

### Installare le librerie

```sh
pip install -r requirements.txt
```

### Configurare il database

- Creare un server postgis
- Nel file config.py inserire la chiave del proprio db nel formato: postgresql://<UTENTE>:<PASSWORD>@localhost/<NOMEDB>

### Avviare server

```sh
python server.py
```

## Log

- Piccola grafica con routing di prova
- importazione di lazy loading per caricamento reattivo
- caricamento aree sulla mappa parametrizzate e in attesa di testing
- caricamento dfelle aree ottimizzato
- TODO: formattare il codice della mappa con oppurtuni metodi
