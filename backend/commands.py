from threading import Thread
from multiprocessing import Process
import os,requests,json 

if __name__ == "__main__":
    server = Process(target=os.system("start cmd /k python server.py"))
    command = input("COMMAND:")
    while command != 'quit':
        match command:
            case 'stop':
                res = requests.get('http://localhost:5000/close')
                response = json.loads(res.text)
            case 'h3':
                res = requests.get('http://localhost:5000/h3')
                response = json.loads(res.text)
                print(response)
            case 'city':
                name = input("city name:")
                file = input("file path:")
                res = requests.post('http://localhost:5000/polygon/file', params={'name': name, 'file': file})
                response = json.loads(res.text)
                print(response)
            case 'turin':
                print("Loading Turin to db")
                res = requests.post('http://localhost:5000/polygon/file', params={'name': "Turin", 'file': ".\\files\\Turin"})
                response = json.loads(res.text)
                print(response)
            case 'london':
                print("Loading London to db")
                res = requests.post('http://localhost:5000/polygon/file', params={'name': "London", 'file': "./files/London"})
                response = json.loads(res.text)
                print(response)
            case 'sanremo':
                print("Loading Sanremo to db")
                res = requests.post('http://localhost:5000/polygon/file', params={'name': "Sanremo", 'file': "./files/Sanremo"})
                response = json.loads(res.text)
                print(response)
            case 'setup':
                print("Setupping db")
                res = requests.get('http://localhost:5000/setupdb')
                response = json.loads(res.text)
                print(response)
            case 'clear':
                print("Clearing db")
                res = requests.get('http://localhost:5000/cleardb')
                response = json.loads(res.text)
                print(response)
        command = input("COMMAND:")