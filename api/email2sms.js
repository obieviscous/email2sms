const util = require('util');
const multer = require('multer');
const addrs = require("email-addresses");
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
const got = require('got');

module.exports = async (req, res) => { 
    const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
   await util.promisify(multer().any())(req, res);

    const from = req.body.from;
    const to = req.body.to;
    const subject = req.body.subject;
  const body = req.body.text;
    //const body = 'can i make changes';
    //Using email-addresses library to extract email details.
    const toAddress = addrs.parseOneAddress(to);
    const toName = toAddress.local;
    const fromAddress = addrs.parseOneAddress(from);
    const fromName = fromAddress.local;

    
    
    
    let requestPayload = 'UserId=user123&Language=en-US&Text='+body;

    got.post('https://channels.autopilot.twilio.com/v2/'+process.env.TWILIO_ACCOUNT_SID+'/UA1886d822487d43445e62a9591836abc9/custom/chat', 
    { 
        headers: { 
            'content-type': 'application/x-www-form-urlencoded',
            'accept': 'application/json',
            'authorization' :  'Basic ' + new Buffer(process.env.TWILIO_ACCOUNT_SID+ ':' + process.env.TWILIO_AUTH_TOKEN).toString('base64')
        },
        body: requestPayload
    }).then(response => {
        let apResponse = JSON.parse(response.body);
     
     
    }).catch(error => {
                res.status(500);
            });
    
    
    
    
    
    
    
    
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // Create Email
        const email = {
            to: fromAddress.address,
            from: 'bot@digitalreceptionist.co.uk',
            subject: 'hello',
            text: `Hi ${fromAddress.address}  ${apResponse}` 
        };
        //Send Email
        sgResp = sgMail.send(email)
            .then(response => {
                res.status(200).send("Sent Error Email");
            })
            .catch(error => {
                res.status(500);
            });
        
    
};
