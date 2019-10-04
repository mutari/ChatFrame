const express = require('express');
const mysql = require('mysql');

const pass = "{admin key}";

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '{pass}',
    database: 'Chat'
});

con.connect();

const app = express();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set('view engine', 'pug');

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + "/style.css");
});

app.get('/', (req, res) => {

    con.query('SELECT * FROM ChatFrame', (err, res2) => {

        if(err) console.log(err);
        else {
            const AdminMessage = [res2[0], res2[1]];
            res2 = res2.slice(2, res2.length).reverse();
            res2.unshift(AdminMessage[0], AdminMessage[1])

            res.render('index', {message: res2});
        }

    });

});

app.get('/:user', (req, res) => {

    if(req.params.user == pass) {
        con.query('SELECT * FROM ChatFrame', (err, res2) => {

            if(err) console.log(err);
            else {
                const AdminMessage = [res2[0], res2[1]];
                res2 = res2.slice(2, res2.length).reverse();
                res2.unshift(AdminMessage[0], AdminMessage[1])

                res.render('admin', {message: res2});
            }
    
        });
    }

});

app.post('/send', (req, res) => {

    if(req.body.name.toLowerCase() == "admin") req.body.name += " 'Is this poster chitt?'"

    con.query('INSERT INTO ChatFrame (name, message, date) VALUES (?, ?, NOW())', [req.body.name, req.body.message], (err, res) => {

        if(err) console.log(err);
        else console.log("data added to database");

    });

    res.redirect("/");

})

app.post('/test', (req, res) => {
    const data = req.body;

    const id = data.id; 
    const objid = data.obj;

    if(id == pass) {

        con.query('DELETE FROM ChatFrame WHERE id = ?', [objid], (err, resData) => {
            res.json({ok: "yes"});
        });

    }
    else 
        res.json({ok: "no"});


});

app.listen('80', (err) => {
    if(err) console.log(err);
    else console.log("server started and running on port 80");
})