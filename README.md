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

## Chiamate