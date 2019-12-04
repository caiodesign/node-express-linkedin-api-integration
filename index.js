const Linkedin = require('node-linkedin')('86darik9kvc9sb', 'osg0NmNIpErRxRun', 'http://localhost:3000/oauth/callback');
const express = require('express');
const path = require('path');
const router = express.Router();


const app = express();
const scope = ['r_emailaddress', 'r_liteprofile', 'w_member_social'];


router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/oauth/linkedin', function(req, res) {
    Linkedin.setCallback(req.protocol + '://' + req.headers.host + '/oauth/callback');
    Linkedin.auth.authorize(res, scope);
});

app.get('/oauth/callback', function(req, res) {
    Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function(err, results) {
        const { access_token: accessToken } = results;

        if(accessToken){
            const linkedin = Linkedin.init(accessToken);
            
            linkedin.people.me(function(err, $in) {
                return console.log(JSON.stringify($in));
            });

            linkedin.people.email(function(err, email){
                return console.log(JSON.stringify(email));
            })
        }

        return res.redirect('/');
    });
});

app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');