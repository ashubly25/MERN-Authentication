
var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');

var mongoose = require('mongoose');

var User = require('../models/User');

const loggedIn = (req) => req.session.user && req.cookies.session_id;


router.post('/Auth/SignUp',(req, res) => {

    let input = User.isBad(req.body);

    console.log(req.body);
    
    if (input.missing) return res.json({success:false,reason:{missing:true}});

    if(input.bad) return res.json({success:false,reason:{bad:true}})
    
    let user = new User(input.user);

    let qryName = User.findOne({name:user.name}).exec();
    let qryMail = User.findOne({mail:user.mail}).exec();

    const conflict = (name,mail) =>  name || mail ?
    Promise.reject( { reason: {
        nameConflict : ! Object.is (name, null),
        mailConflict : ! Object.is (mail, null)
    }}) : Promise.resolve();

    Promise.all([qryName, qryMail])
    .then ( result => conflict(result[0],result[1]) )
    .then ( () => user.save() )
    .then ( () => req.session.user = user._id )
    .then ( () => res.json( {success:true} ) )
    .catch ( err=> res.json( {success:false, reason: err.reason || {serverError:true} } ) );

});


router.post('/Auth/LogIn',(req, res) => {

    let { name } = req.body;

    let { key } = req.body;

    if ( ! name || ! key ) return res.json({success:false,reason:{missing:true}});

    const badName = Object.prototype.toString.call(name) !== "[object String]";
    const badKey = Object.prototype.toString.call(key) !== "[object String]";

    if ( badName || badKey ) return res.json({success:false,reason:{bad:true}});
    
    if (loggedIn(req)) res.send({success:false,reason:{redundant:true}});

    const notFound = user => Object.is(user, null) ?
    Promise.reject({reason:{notFound:true}}) :
    Promise.resolve(user);

    const matched = (match,id) => match ? Promise.resolve(req.session.user=id) :
    Promise.reject({reason:{incorrectKey:true}});

    User.findOne({name:name},{key:1}).exec()
    .then ( user => notFound(user) )
    .then ( user => Promise.all([bcrypt.compare(key, user.key), user._id] ))
    .then ( result => matched(result[0],result[1] ) )
    .then ( () => res.json( { success:true } ) )
    .catch ( err=> res.json( {success:false, reason:  err.reason || {serverError:true} } ) );

});


router.get('/Auth/LogOut',(req, res) => {
    if(!loggedIn(req)) res.send({success:false,reason:{notLoggedIn:true}});
    res.clearCookie('session_id');
    req.session.destroy();
    res.send({success:true});
});

router.get('/Auth/Delete',(req, res) => {
    if(!loggedIn(req)) return res.send({success:false,reason:{notLoggedIn:true}});
    User.find({_id:req.session.user}).remove().exec()
    .then(()=>{
        res.clearCookie('session_id');
        req.session.destroy();
        res.send({success:true});
    }).catch(err=>res.send({success:false,reason:{serverError:true}}));
});

router.get('/AllUsers',(req, res) => {
    if(!loggedIn(req)) return res.send({success:false,reason:{notLoggedIn:true}});
    User.find({},{_id:0,name:1,mail:1}).exec()
    .then(result=>res.send({success:true,payload:result}))
    .catch(err=>res.send({success:false,reason:{serverError:true} }));
});

router.get('/User',(req, res) => {
    if(!loggedIn(req)) return res.send({success:false,reason:{notLoggedIn:true}});
    User.findOne({_id:req.session.user},{_id:0,name:1,mail:1}).exec()
    .then(user=>res.send({success:true,payload:{name:user.name,mail:user.mail}}))
    .catch(err=>res.send({success:false,reason:{serverError:true} }));
});

module.exports = router;