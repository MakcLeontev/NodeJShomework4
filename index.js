const express = require('express');
const joi = require('joi');
const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'person.json')

const app = express();

const users = [];

let uniqueID = 0;

const userSchema = joi.object({
    firstName: joi.string().min(2).required(),
    secondName: joi.string().min(2).required(),
    age: joi.number().min(0).max(150).required(),
    city: joi.string().min(2),
})

app.use(express.json());

app.get('/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
    if (data) {
        res.send({ data });
    } else {
        res.send({ user:null });
    }
});

app.get('/users/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
    const userID = +req.params.id; //приведение к Number
    const user = data.find((user) => user.id === userID)
    if (user) {
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.post('/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));

    if (data.at(-1).id) {
        uniqueID = data.at(-1).id + 1;
    } else {
        uniqueID += 1;
    }
    data.push({
        id: uniqueID,
        ...req.body
    });

    // console.log(req.body);
    // users.push({
    //     id: uniqueID,
    //     ...req.body
    // });
    res.send({ id: uniqueID });
    fs.writeFileSync(pathToFile, JSON.stringify(data, null, 2));
});
app.put('/users/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
    const result = userSchema.validate(req.body);
    if (result.error) {
        return res.status(404).send({
            error: result.error.details
        });
    } else {

    }
    const userID = +req.params.id; //приведение к Number
    const user = data.find((user) => user.id === userID)
    if (user) {
        const { firstName, secondName, age, city } = req.body;
        user.firstName = firstName;
        user.secondName = secondName;
        user.age = age;
        user.city = city;
        fs.writeFileSync(pathToFile, JSON.stringify(data, null, 2));
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.delete('/users/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
    const userID = +req.params.id; //приведение к Number
    const user = data.find((user) => user.id === userID)
    if (user) {
        const userIndex = data.indexOf(user);
        data.splice(userIndex, 1);
        fs.writeFileSync(pathToFile, JSON.stringify(data, null, 2));
        res.send({ user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});

app.listen(3000);