# Instructions for setting up

Install python3, virtualenv, and node (use your OS's package manager instead of apt-get if not on Ubuntu):
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install python3 python3-venv nodejs
```

In the top level directory create a new virtual environment:
```
python3 -m venv benji_venv
source benji_venv/bin/activate
```

Update pip (just in case) and install the Python dependencies:
```
pip install -U pip
pip install -r requirements.txt
```

Migrate the (development) database:
```
python manage.py migrate
```

Install the frontend dependencies:
```
cd apps/frontend/
npm i
```

Return to the top-level and run the server:
```
cd ../../
python manage.py runserver
```
