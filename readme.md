# IndiOne : Code-with-Google-Maps

A mobile-friendly web application that automatically schedules itinerary based on user preferences

## About Team

- Team name: IndiOne
- Members
  - (Leader) Minseok Kim - 200134kms@gmail.com
  - Siwoo Jung - siwoo.jg@gmail.com
  - Seonghyun Kim - seanhyun0301@gmail.com

## Problem Statement

As AI technologies have been developed and made available to the public over the last decade, the demand for a convenient lifestyle has become a growing global issue.

We organized our ideas and devised a plan to address this trend. As a result, we have created an application with the function of recommending multiple routes for customers with various purposes (dating, leisure trips and business, etc.).

Selectable options are integrated into the system to allow users to customize their plans accurately, according to their preferences.

## A Brief of the Prototype

fasdf

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

---

# Frontend
