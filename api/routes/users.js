let express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const { verifyToken } = require('../middleware/verifyToken')
const { verifyEmailToken } = require('../middleware/verifyToken')

const prisma = new PrismaClient();

router.post('/login', async (req, res) => {

    const userFind = await prisma.users.findUnique({

        where: {
            username: req.body.username
        }
    })

    if (!userFind) return res.status(401).send("Incorrect login details")

    let comparePassword = bcrypt.compareSync(req.body.password, userFind.password);

    if (!comparePassword) return res.status(401).send("Incorrect login details")

    const token = jwt.sign({ username: userFind.username, id: userFind.id, first_name: userFind.first_name, last_name: userFind.last_name, email: userFind.email }, process.env.JWT_SECRET, { expiresIn: process.env.expires });

    return res.status(200).send({ token: token })

})

router.post('/user-details', verifyToken, async (req, res) => {

    let id = parseInt(req.user.id)

    let users = await prisma.users.findUnique({

        where: {
            id: id
        },
        select: {
            id: true,
            email: true,
            username: true,
            first_name: true,
            last_name: true,
        }
    })

    return res.send(users)

})

router.post('/verify-token', verifyToken, async (req, res) => {

    res.send({ message: `Hello ${req.user.first_name}, you are verified`, token: req.user })
});


router.post('/register', async (req, res) => {

    const users = await prisma.users.findFirst({

        where: {
            username: req.body.username
        }
    });

    if (users) return res.status(401).send({ message: "Error! Username already exists" })

    const email = await prisma.users.findFirst({

        where: {
            email: req.body.email
        }
    });

    if (email) return res.status(401).send({ message: "Error! Email already exists" })

    if (req.body.password !== req.body.passwordagain) return res.status(401).send({ message: "Passwords do not match" })

    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(req.body.email)) return res.status(401).send({ message: "Email not in the correct format" })

    const usernameRegex = /^(?=.{3,20}$)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*$/;

    if (!usernameRegex.test(req.body.username)) return res.status(401).send({ message: "Username not in the correct format" })

    const salt = bcrypt.genSaltSync(parseInt(process.env.SALTVALUE));
    const passwordSalted = bcrypt.hashSync(req.body.password, salt)

    await prisma.users.create({
        data: {
            username: req.body.username,
            password: passwordSalted,
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
        },
    });

    console.log("Successfully registered user")

    return res.status(200).send("Successfully registered")

})

router.patch('/change-password', verifyToken, async (req, res) => {

    let userFound = await prisma.users.findUnique({

        where: {

            username: req.body.username,
        }
    })

    if (userFound) {

        let comparePassword = bcrypt.compareSync(req.body.password, userFound.password);

        if (comparePassword) {

            const salt = bcrypt.genSaltSync(parseInt(process.env.SALTVALUE));
            const passwordSalted = bcrypt.hashSync(req.body.newpwd, salt)

            let update = await prisma.users.update({

                where: {
                    username: req.body.username

                },

                data: {
                    password: passwordSalted
                }

            })

            return res.status(200).send("Password updated");
        } else {

            return res.status(400).send("Password is incorrect")
        }
    }

})

router.patch('/update-user-details', verifyToken, async (req, res) => {

    let id = req.user.id

    try {

        await prisma.users.update({

            where: {
                id: id
            },

            data: {

                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email
            }
        })

    } catch (err) {

        console.log(err)
        return res.status(400)
    }

    return res.status(200).send("Success!")

})

router.post('/forget-password', async (req, res) => {

    if (!req.body.email) {
        return res.status(400).send("Email is required")
    }

    const userFind = await prisma.users.findUnique({

        where: {
            email: req.body.email
        }
    })

    if (!userFind) return res.status(404).send("Email address not found")

    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "jeetta3@gmail.com",
            pass: `${process.env.EMAIL_PASS}`,
        },
    });

    const token = jwt.sign({ email: req.body.email }, 'mygoodness', { expiresIn: '15m' });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const info = await transporter.sendMail({
        from: '"Jeet Tan" <jeetta3@gmail.com>',
        to: req.body.email,
        subject: "[PASSWORD RESET] Real Estate Homes Project",
        text: `Hey ${userFind.first_name}, \n \n Your username is: ${userFind.username} \n \n Here's the link to reset your password: ${resetLink} \n\n Keep it simple. \n\n Best, \n \n -Real Estate Home Admin`, // plain text body
        html: "",
    });

    console.log("Recovery details sent!")

    res.send("Email sent!")
})

router.post('/verify-reset-token', verifyEmailToken, async (req, res, next) => {

    const token = req.user

    return res.status(200).json({
        message: "Token valid",
        token
    });

})

router.patch('/reset-password-by-email', verifyEmailToken, async (req, res) => {

    const email = req.user.email

    if (req.body.password.length < 6 || req.body.password.length > 20) {

        return res.status(400).send("Incorrect password length")
    }

    const salt = bcrypt.genSaltSync(parseInt(process.env.SALTVALUE));
    const passwordSalted = bcrypt.hashSync(req.body.password, salt)

    await prisma.users.update({

        where: {
            email
        },

        data: {
            password: passwordSalted
        }

    })

    return res.status(200).send("Password updated!")

})


module.exports = router;