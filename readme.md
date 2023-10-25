# Backend

### Create and activate Venv

1.Move to **Backend** folder in your terminal

2.Type `python -m venv BackendVenv` (for mac: `python3 -m venv BackendVenv`)

3.Type `./BackendVenv/Scripts/Activate` (for mac: `source BackendVenv/bin/activate`)

4.Select the **python.exe** in the **BackendVenv/Scripts** folder as interpretor of VSC (for mac: **python.exe** is in the **BackendVenv/bin** folder)

### Install packages

1.Type `pip install -r requirements.txt`

### Input API key

1.Create a json file call **keys.json**

2.Paste your api key in the file
```
{
    "googleApi": "GOOGLE API KEY",
    "databaseUrl": "MONGO DB API KEY"
}
```


### Run Server

1.Run **server.py** in the **src** folder

### Deactivate venv

1.Type `deactivate`

