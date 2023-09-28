# Food Social Media Project
A Social media website that allows users to view and create recipes, allows users to follow each other, rate recipes, comment and more.

<a href="https://food-project-x6vc.vercel.app/">Click here to go to the website</a>

## Frameworks used:
### back:
For the database I used <a href="https://supabase.com/">Supabase.com</a>, it uses PostgreSQL
For the server I used Django

### Front:
I used react with redux and typescript<br>
For the css i used tailwindcss, DaisyUI and Material tailwind

## Database schema:
<img src="db schema.png">

# <a href="https://firebasestorage.googleapis.com/v0/b/food-project-8d454.appspot.com/o/Search%20Recipes%20-%20Google%20Chrome%202023-09-28%2018-10-52.mp4?alt=media&token=247c2b58-55f7-4f53-ac0a-f46572cf8f66&_gl=1*1ecgsnf*_ga*MTA4NjM2ODkxMC4xNjkxMzM3NDMx*_ga_CW55HF8NVT*MTY5NTkxNDE5Ni4zMi4xLjE2OTU5MTQyMjUuMzEuMC4w">Click here to lean how to upload a recipe</a>

## Installation
```
git clone https://github.com/ShayCohenn/food_project
```
### Back:
```
cd ./Backend
```
```
python -m virtualenv env
```
```
.\env\Scripts\activate
```
```
pip install -r requirements.txt
```
```
python ./manage.py runserver
```
### Front

```
cd ./Frontend
```
```
npm i
```
```
npm start
```

## .env files:
You'll need 2 .env files 
### Backend .env file:
```
django_secret_key = ""

django_db_name = ""
django_db_user = ""
django_db_password = ""
django_db_host = ""
django_db_port = ""

mail_pwd = ""
```

### Frontend .env file
```
<!-- backend url -->
REACT_APP_API_URL = ""

<!-- firebase connection: -->

REACT_APP_API_KEY= ""<br>
REACT_APP_AUTH_DOMAIN= ""<br>
REACT_APP_PROJECT_ID= ""<br>
REACT_APP_STORAGE_BUCKET = ""<br>
REACT_APP_MESSAGING_SENDER_ID= ""<br>
REACT_APP_APP_ID= ""<br>
REACT_APP_MEASUREMENT_ID= ""<br>
```