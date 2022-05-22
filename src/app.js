require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;
const path = require('path');
const hbs = require('hbs');
const swal = require("sweetalert");
const multer = require("multer");
require('./db/conn');
const jwt = require("jsonwebtoken");

const JSAlert = require("js-alert");
const logadmin = require("./models/adminlog");
const assign = require("./models/assign");
const notify = require("./models/notify");
const sdata = require("./models/sdata");
const cookieParser = require('cookie-parser');
const auth = require("./middleware/auth");
const authh = require("./middleware/authh");
const staticpath = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../template/views");
const partialspath = path.join(__dirname, "../template/partials");
const http = require("http");
const fs = require("fs");
const async = require('hbs/lib/async');
const { constants } = require('buffer');
const { fstat } = require('fs');
app.use(express.static(staticpath));
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partialspath);


app.get("/invalid", (req, res) => {
    res.send("<h1 style='text-align:center;'> Invalid User<br>Go Back And Try Again....</h1>");
})

app.get("/regno_reg", (req, res) => {
    res.send("Registration id is already been taken....");
})

const Storage = multer.diskStorage({
    destination: './public/uploads/image',

    filename: function (request, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
})

const upload = multer({
    storage: Storage
}).single('propic');

app.get("/", (req, res) => {
    notify.find((err, docs) => {
        if (!err) {
            res.render("home", {
                data: docs
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    });
});

app.post('/', async (req, res) => {
    try {
        const regno = req.body.regno;
        const pass = req.body.password;
        const slogin = await sdata.findOne({ regno: regno });
        if (slogin) {
            if ((slogin.password) === pass) {
                const token = await slogin.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 600000),
                    httpOnly: true,
                });
                return res.redirect('/studentprofile');
            } else {
                return res.redirect('/invalid');
            }
        } else {
            return res.redirect('/invalid');
        }

    } catch (e) {
        res.status(400).send(e);
    }
})

app.get('/', (req, res) => {
    member.find((err, docs) => {
        if (!err) {
            res.render("home", {
                data: docs
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    });
});

app.get("/logout7", authh, async (req, res) => {
    try {
        // console.log(req .user);
        res.clearCookie("jwt");
        req.user.tokens = [];
        console.log("logout successfull");
        await req.user.save();
        res.redirect('/')
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get('/user/:id', async (req, res) => {
    // res.send(req.params.id);
    sdata.find({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("guest", {
                data: docs
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    });
});

app.get("/studentprofile", authh, (req, res) => {
    sdata.find({ _id: req.user }, (err, docs) => {
        if (!err) {
            res.render("student_profile", {
                data: docs
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    });

});

app.get("/viewassign", authh, (req, res) => {
    assign.find((err, doc) => {
        if (!err) {
            res.render("view_assignment", {
                data: doc
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    });
});



app.post('/studentprofile', upload, authh, (req, res) => {
    if(req.file){
        sdata.findByIdAndUpdate(req.user._id, {
            email: req.body.email,
            gen: req.body.gen,
            about: req.body.about,
            phone: req.body.phone,
            password: req.body.password,
            linkedin: req.body.linkedin,
            cpweb: req.body.cpweb,
            address: req.body.address,
            propic: req.file.filename,
        }, (err, docs) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
                return res.redirect('/studentprofile');
            }
        });
    }else{
        sdata.findByIdAndUpdate(req.user._id, {
            email: req.body.email,
            gen: req.body.gen,
            about: req.body.about,
            phone: req.body.phone,
            password: req.body.password,
            linkedin: req.body.linkedin,
            cpweb: req.body.cpweb,
            address: req.body.address,
            // propic: req.file.filename,
        }, (err, docs) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated User : ", docs);
                return res.redirect('/studentprofile');
            }
        });
    }
});

app.get('/student', auth, (req, res) => {
    sdata.find((err, docs) => {
        if (!err) {
            res.render("stu_data", {
                data: docs
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    })
});



app.post('/student', auth, async (req, res,) => {
    console.log(req.file);
    try {
        const Recol = new sdata({
            regno: req.body.regno,
            name: req.body.name,
            dob: req.body.dob,
            password: req.body.dob,
            // propic: req.file.filename, 
        })
        const token = await Recol.generateAuthToken();

        const reg = await Recol.save();
        res.status(201);
        return res.redirect('/student');
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/view/:id", async (req, res) => {
    sdata.find({ _id: req.params.id }, (err, docs) => {
        if (!err) {
            res.render("view", {
                data: docs
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    });
})

app.get('/notification', auth, (req, res) => {
    notify.find((err, docs) => {
        if (!err) {
            res.render("notification", {
                data: docs
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    });
});

app.post('/notification', async (req, res) => {
    try {
        const Not = new notify({
            notifying: req.body.notifying
        })
        console.log(Not);
        const nt = await Not.save();
        console.log(nt);
        res.status(201);
        return res.redirect('/notification');
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/notification/noti_delete/:id", (req, res) => {


    notify.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/notification');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });

})

app.get('/assignment', auth, (req, res) => {
    assign.find((err, docs) => {
        if (!err) {
            res.render("assignment", {
                data: docs
            })
        } else {
            console.log('Failed to retrieve the List: ' + err);
        }
    });
});

app.post('/assignment', async (req, res) => {
    try {
        const asn = new assign({
            text: req.body.text,
        })
        const assi = await asn.save();
        res.status(201);
        return res.redirect('/assignment');
    } catch (err) {
        res.status(400).send(err);
    }
});

app.get("/assignment/assign_delete/:id", (req, res) => {

    assign.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/assignment');
        } else {
            console.log('Failed to Delete user Details: ' + err);
        }
    });
})

app.get('/update', auth, (req, res) => {
    res.render('update');
});

app.post('/update', auth, (req, res) => {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (password === cpassword) {
        logadmin.findByIdAndUpdate(req.user._id, {
            password: req.body.password,
        }, (err, docs) => {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated Passsword : ", docs);
                return res.redirect('/update');
            }
        });
    } else {
        console.log("password not matched");
    }
});

app.get("/logout", auth, async (req, res) => {
    try {
        console.log(req.user);
        req.user.tokens = [];
        res.clearCookie("jwt");
        console.log("logout successfull");
        await req.user.save();
        res.redirect('/')
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get('/adsin', (req, res) => {
    res.render('adsin');
});

app.get('/adminlogin', (req, res) => {
    res.render('adminlogin');
});

app.post('/adsin', async (req, res) => {
    try {
        const code = req.body.code;
        const password = req.body.password;
        const Record = new logadmin({
            code: req.body.code,
            password: req.body.password,
        })
        const token = await Record.generateAuthToken();
        const register = await Record.save();
        res.status(201).render('adminlogin');
    } catch (e) {
        res.status(400).send(e);
    }
});

// adminLogin check
app.post('/adminlogin', async (req, res) => {
    try {
        const code = req.body.code;
        const password = req.body.password;
        const Adcode = await logadmin.findOne({ code: code });
        // console.log(Adcode);
        if(Adcode){
            if (Adcode.password === password) {
                const token = await Adcode.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 600000),
                    httpOnly: true,
                });
                return res.status(200).redirect('/student');
            } else {
                return res.redirect('/invalid');
            }
        }else{
            return res.redirect('/invalid');
        }
    } catch (e) {
        res.status(400).send(e);
    }
})

app.get('/*', (req, res) => {
    res.render('404');
});
app.listen(port, () => {
    console.log(`Server Running....`);
})