import express from 'express';
import dotenv from 'dotenv';
import winston from 'winston';
import db from './models';

dotenv.config();

const port = process.env.PORT || 3000;

const app = express()


let { Users } = db;


app.get('/', (req, res) => res.send('Welcome to EduGate!'))

app.post('/users', function (req, res) {
    Users.create({ 
        user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
        school_uid: '40e6215d-b5c6-4896-987c-f30f3678f605',
        first_name: 'John',
        last_name: 'Doe',
        dob: new Date(),
        year_of_graduation: '2020',
        role: 'admin',
        password: '123456',
        phone_number: '07038015455',
        username: 'Jamsgra',
        email: 'John.doe@gmail.com',
    })
      .then(function (user) {
        return res.json(user);
      });
  });


  app.listen(port, () => winston.log("info",`Example app listening on port ${port}!`))
  

export default app;
