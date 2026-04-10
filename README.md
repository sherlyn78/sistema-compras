INICIAR BACKEND

//ingresar a la carpeta
cd backend

//Iniciar
./mvnw spring-boot:run

INICIAR FRONTEND
//ingresar carpeta
cd frontend

//iniciar npm
npm install

//iniciar
ng serve

Posteriormete
http://localhost:4200

GIt
Para actualizar repositorio   lo siguiente git pull origin main

cd backend
./mvnw clean install

cd frontend
npm install


Crear ramas

git checkout -b nombre-rama
ejemplo
git add .
git commit -m "Agrego login"
git push origin feature-login

Posteriormente unirlo en el main


Mi rama
git checkout main
git pull origin main
git checkout tu-rama
git merge main


para redirigir el rol
npm install jwt-decode

npm install jwt-decode
para poder usar 
import jwtDecode from 'jwt-decode';

cambiamos a import * as jwtDecode from 'jwt-decode';


comando para iniciar backend 


mvn spring-boot:run -Dspring-boot.run.profiles=local

npm install @ngneat/hot-toast @ngneat/overview para dise;o 
