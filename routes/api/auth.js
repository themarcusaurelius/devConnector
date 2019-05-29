const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check')

const User = require('../../models//User');

// @route   GET api/auth
// @desc    Test Route
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post('/', 
[
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Password is required')
        .exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    //const {name, email, password} = req.body;
    const password = req.body.password.toString();   
    const email = req.body.email.toLowerCase().toString();

    try {
        let user = await User.findOne({ email });
        
        if(!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] })
        }
        
        //Match User Email and Password with compare method from bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] })  
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 36000 }, 
            (err, token) => {
                if(err) throw err;
                res.json({ token })
            }
        );

    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
      
});

module.exports = router