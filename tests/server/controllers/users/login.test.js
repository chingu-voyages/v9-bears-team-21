import chai from 'chai';
import bcrypt from 'bcryptjs';
import chaiHttp from 'chai-http';
import server from '../../../../server/app';
import db from '../../../../server/models/index'

chai.use(chaiHttp);

const { expect } = chai;

let { Users } = db;



describe('Login', () => {

    before((done) => {
      bcrypt.hash('123testing', 10)
      .then(password => {
        Users.create({
              user_uid: '40e6215d-b5c6-4896-987c-f30f3678f608',
              first_name: 'John',
              last_name: 'Doe',
              dob: new Date(),
              year_of_graduation: '2020',
              role: 'admin',
              password,
              phone_number: '07038015455',
              username: 'jamsgra',
              email: 'John.doe@gmail.com',
          })
          .then(() => done())
      })
    })
  
    after((done) => {
      Users.destroy({
        where: {
          username: 'jamsgra'
        }
      }).then(() => done())
    })
  
    it('login success', (done) => {
      chai.request(server)
        .post('/login')
        .type('form')
        .send({
          'username': 'jamsgra',
          'password': '123testing'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal("User login successfully");
          done();
        })
    })
    it('login password fail', (done) => {
      chai.request(server)
        .post('/login')
        .type('form')
        .send({
          'username': 'jamsgra',
          'password': 'wrongpassword'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.err).to.equal('Password is incorrect. Please try again');
          done();
        })
    })
  
    it('login user fail', (done) => {
      chai.request(server)
        .post('/login')
        .type('form')
        .send({
          'username': 'wronguser',
          'password': 'wrongpassword'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.err).to.equal('No User Found');
          done();
        })
    })
  })