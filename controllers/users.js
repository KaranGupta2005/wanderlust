const User=require("../models/user.js");

module.exports.renderSignUp=(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signUp=async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    })
  } catch (err) {
    console.log(err);
    next(err); 
  }
};

module.exports.renderLogin=(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.login=async (req,res)=>{
    req.flash("success","Logged in successfully!");
    let redirectUrl=(res.locals.redirectUrl) || "/listings";
    res.redirect(redirectUrl);
    
};

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","Logged Out Successfully!");
        return res.redirect("/listings");
    })
};