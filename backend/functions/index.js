const functions = require('firebase-functions');
const { dialogflow,SignIn,Permission,Confirmation,Suggestions } = require('actions-on-google');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

var AWS = require('aws-sdk');

// (new AWS.SNS()).publish({
//    Message: 'Message',
//    PhoneNumber: '+XXX',
//    MessageAttributes: {
//     'AWS.SNS.SMS.SMSType': {
//        DataType: 'String',
//        StringValue: 'Transactional'
//     }
//  });

// var AWS = require('aws-sdk');
const account_sid = 'AC3e4bcd829b80a3c78554d088f5d5160a';
const auth_token = '4439a019371fd2b7dcabb6691500b5c5';

const stripe = require('stripe')('sk_test_QQwUK9I7VAAHQqQQ0iakLgnF00aSmCo4dC');
const twilio_client = require('twilio')(account_sid,auth_token);

const CLIENT_ID = '215047049109-hmtp9i4t617ijetvn2s5l41aedavv2sg.apps.googleusercontent.com';
const app = dialogflow({debug:true,clientId:CLIENT_ID});

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
    databaseURL:"ws://velox-parking.firebaseio.com/",
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yoyorahulem2@gmail.com',
        pass: 'rbtzhbwlhogsbjbe'
    }
});

const auth = admin.auth();
const db = admin.database();

app.intent('Default Welcome Intent',(conv)=>{
  // twilio_client.messages.create({body:"Hi There!", from: "+17724130748", to: "+919462461435"}).then(message=>console.log(message)).catch(err=>console.log(err));
//   var params = {
//     Message: "hi",
//     PhoneNumber: '+919815629665',
//     MessageAttributes: {
//         'AWS.SNS.SMS.SenderID': {
//             'DataType': 'String',
//             'StringValue': 'VELOX'
//         },
//         'AWS.SNS.SMS.SMSType': {
//             'DataType': 'String',
//             'StringValue': 'Transactional'
//         }
//     }
// };

// var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

// publishTextPromise.then(
//     (data) => {
//         console.log(JSON.stringify({ MessageID: data.MessageId }));
//         return;
//     }).catch(
//         (err) => {
//           console.log(JSON.stringify({ Error: err }));
//         });
  if(conv.user.email) {
  	conv.add(`Welcome back ${conv.user.storage.name}`);
    conv.ask(`Please enter your plate number as it is required.`);
    if(conv.user.storage.plate){
      conv.add(new Suggestions([conv.user.storage.plate]));
    }
  } else {
    conv.ask(new Confirmation('Welcome to Velox Parking. As you are new here would you like to know about Velox?'));
  }
});

app.intent('about',(conv,params,confirmation)=>{
  if(confirmation){
    conv.ask(new SignIn(`insert about here.To continue using Velox`));
  } else {
    conv.ask(new SignIn(`Ok, No Problem.To continue using Velox`));
  }
});

app.intent('handle sign in', async (conv, params, signin) => {
  if (signin.status !== 'OK') {
    return conv.close(`Let's try again next time.`);
  }
  const {email} = conv.user;
  if (!conv.data.uid && email) {
    try {
      conv.data.uid = (await auth.getUserByEmail(email)).uid;
    } catch (e) {
      if (e.code !== 'auth/user-not-found') {
        throw e;
      }
      conv.data.uid = (await auth.createUser({email})).uid;
    }
  }
  if (conv.data.uid) {
    conv.user.ref = db.ref(`users/${conv.data.uid}`);
    conv.user.ref.set({
    	email:email
    });
    conv.user.storage.uid = conv.data.uid;
    conv.user.storage.name = conv.user.profile.payload.name;
  }
  conv.ask("Please enter the plate number as it is required.");
});

app.intent('enter plate',(conv,params)=>{
	if(params.plate) {
      const email = conv.user.email;
      const plate = params.plate;
      conv.user.storage.plate = params.plate;
      conv.add(`Your email is ${email} and plate is ${plate} `);
      conv.add(`How can I help you today ?`);
    } else{
      conv.ask('Please enter your plate number.');
    }
});

app.intent('book a slot with loc',(conv)=>{
  const cu = conv.user.storage.uid;
  const email = conv.user.email;
  admin.database().ref('slots').once('value',(snapshot)=>{
    let keychange;
    snapshot.forEach((child)=>{
      if(child.child('occupied').val() === 1 && !child.child('user').exists() ){
        keychange = child.key;
      }
    });
    if(keychange!==null  ) {
      admin.database().ref('slots').child(`${keychange}`).update({user:cu});
      const mailOptions = {
                  from: "Haywire",
                  to: email,
                  subject: "Alloted Slot",
                  html: `<p>Hi! This is Velox. I have alloted slot ${keychange} for you. Please park at the alloted slot withing next 10 mins or you'll have to book again!<br>Note:Parking at an unalloted slot will lead to a fine! <br> Slot Location - https://maps.app.goo.gl/cBr4zXwdGJ4iWj2s8 </p>`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if(err) {
          console.log(err);
        }
      });

      var params = {
        Message: `Hi! This is Velox. I have alloted slot ${keychange} for you. Please park at the alloted slot withing next 10 mins or you'll have to book again!<br>Note:Parking at an unalloted slot will lead to a fine! <br> Slot Location - https://maps.app.goo.gl/cBr4zXwdGJ4iWj2s8 </p>`,
        PhoneNumber: '+919815629665',
        MessageAttributes: {
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': 'VELOX'
            },
            'AWS.SNS.SMS.SMSType': {
                'DataType': 'String',
                'StringValue': 'Transactional'
            }
        }
    };
    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();
    publishTextPromise.then(
      (data) => {
          console.log(JSON.stringify({ MessageID: data.MessageId }));
          return;
      }).catch(
          (err) => {
            console.log(JSON.stringify({ Error: err }));
          });
    } 
  });  
  conv.close('Your slot has been booked you will get a message regarding it');             
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);


const freeSlot = async (slotChanged)=>{
  await db.ref(`slots/${slotChanged}/user`).remove();
  await db.ref(`slots/${slotChanged}/parkingtime`).remove();
};

exports.detectSlotChange = functions.database.ref('/slots')
                        .onUpdate((change,context)=>{
                            let before = change.before.val();
                            let after = change.after.val();
                            let slotChanged;
                            for (let i = 0, len = before.length; i < len; i++) {
                                if (before[i].occupied !== after[i].occupied) {
                                    slotChanged = i;
                                }
                            }
                            if(slotChanged===null) return;
                            if(after[slotChanged].occupied===0) {
                                //Car Parked
                                //save timestamp
                                db.ref(`slots/${slotChanged}`).once('value', (snapshot)=> {
                                    const slot = snapshot;
                                    if(slot.child('user').exists()) {
                                        db.ref('slots').child(`${slotChanged}`).update({parkingtime:Date.now()});
                                    } else {
                                        const mailOptions = {
                                            from: "Haywire", // sender address
                                            to: `parv0697@gmail.com`, // list of receivers
                                            subject: "Fine Alert", // Subject line
                                            html: `<p> There is a unautherized car at slot no. ${ slotChanged } </p>` 
                                        };
                                        transporter.sendMail(mailOptions, (err, info) => {
                                            if(err)
                                            {
                                              console.log(err);
                                            }
                                        });
                                    }
                                });
                          } else if(after[slotChanged].occupied===1){
                                const currenttime = Date.now();
                                db.ref(`slots/${slotChanged}`).once('value',(snapshot)=>{const obj = snapshot.val()
                                    const user = obj.user;
                                    db.ref(`users/${user}`).once('value',(snapshot)=>{
                                        const obj = snapshot.val();
                                        const email = obj.email;
                                        db.ref(`stripe_customers/${user}`).once('value',async (snapshot)=>{
                                          const customer =  await snapshot.val().customer_id;
                                          const amount = 4000;
                                          console.log(customer);
                                          stripe.invoiceItems.create({
                                            customer: `${customer}`,
                                            amount: amount,
                                            currency: 'inr',
                                            description: 'Parking Charge',
                                          }, function(err, invoiceItem) {
                                            // asynchronously called
                                            console.log(err);
                                            console.log(invoiceItem);
                                            stripe.invoices.create({
                                              customer: customer,
                                              auto_advance: true, // auto-finalize this draft after ~1 hour
                                            }, function(err, invoice) {
                                              // asynchronously called
                                              console.log(err);
                                              console.log(invoice);
                                              stripe.invoices.finalizeInvoice(`${invoice.id}`, function(err, invoice) {
                                                console.log(err);
                                                console.log(invoice);
                                                
                                              });
                                            });
                                          });
                                          console.log('here');
                                        });
                                      });

                                    });
                                    // freeSlot(slotChanged);
                                }
                                return;
                            });


exports.createStripeCustomer = functions.auth.user()
                        .onCreate(async (user)=>{
                          const customer = await stripe.customers.create({email:user.email});
                          return db.ref(`stripe_customers/${user.uid}`).set({
                            customer_id:customer.id
                          });
                        });


