const express = require('express');
const path    = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const exphbs = require('express-handlebars');
const app = express();

// View Engine Setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// set static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// set body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// App Router
app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send',(req, res)=>{
    const content = `
    <p>You Have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li style="color:red">${ req.body.name }</li>
        <li style="color:blue">${ req.body.company }</li>
        <li style="color:green">${ req.body.email }</li>
        <li style="color:orange">${ req.body.phone }</li>
    </ul>
    <h3>Message</h3>
    <p>${ req.body.message }</p>
 `;

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail.__YOURDOMAIN__.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '__YOUR EMAIL__', // generated ethereal user
            pass: '__YOU PSSWORD__' // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    // send mail with defined transport object
    let info = transporter.sendMail({
        from: '"NodeMailer Contact" <shanto@developermaruf.com>', // sender address
        to: req.body.email, // list of receivers
        subject: "Node Contact Request", // Subject line
        text: "Hello world?", // plain text body
        html: content // html body
    });
    res.render('contact', {msg: 'The contact has been sent'});
});

//create a server
app.listen(3000,() => console.log('Listening on http://localhost:3000'));
