if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require('./schema.js');//used for server side schema validation
const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");//router pages
const reviewRouter=require("./routes/review.js");//router pages
const userRouter=require("./routes/user.js")


const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
// ejs mate used for boilerolate
app.use(express.static(path.join(__dirname,"public")));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{

    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"delta-student"
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

main().then(()=>{
    console.log ("connected successfully");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}





// error handling
app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{message});
})

app.listen(8080,(req,res)=>{
    console.log("server listening on port 8080");
})




// app.get("/testlisting", async(req,res)=>{
//     const sampleListing=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Bandra,Mumbai",
//         country:"India"

//     });
//     await sampleListing.save();
//     console.log("info saved");
//     res.send("success");

// }
// )