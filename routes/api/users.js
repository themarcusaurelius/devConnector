const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check')

const User = require('../../models/User')

// @route   POST api/users
// @desc    Register Route
// @access  Public
router.post('/', 
[
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6})
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    //const {name, email, password} = req.body;
    const name = req.body.name.toString();   
    const password = req.body.password.toString();   
    const email = req.body.email.toLowerCase().toString();

    try {
        let user = await User.findOne({ email });
        
        // See if user exists
        if(user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User Already Exists' }] })
        }
        
        // Get users gravatar
        const avatar = gravatar.url(email, { 
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        //New User Instance
        user = new User({ 
            name, 
            email, 
            avatar,
            password
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        //Save user to DB
        await user.save();

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