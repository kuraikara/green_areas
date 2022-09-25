sudo apt install python3-pip
sudo apt install python3.10-venv
pip install --user virtualenv
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
flask run