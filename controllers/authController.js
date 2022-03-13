const User = require("../models/User");
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

//handle errors:

const handleErrors = (err) => {
  // console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }

  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "that password is incorrect";
  }

  //duplication error code
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  //validation error:
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(error.properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "yvfh nxjlnkmn cdkwyfv", {
    expiresIn: maxAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup", { title: "Sign up" });
};

module.exports.login_get = (req, res) => {
  res.render("login", { title: "Login" });
};

module.exports.signup_post = async (req, res) => {
  const { name, email, password, role, pno, imageURL} = req.body;

  try {
    const user = await User.create({ name, email, password, role, pno, imageURL });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  const x = 1;
  res.cookie("jwt", "", { maxAge: x });
  res.redirect("/");
};

module.exports.compcourse_get = (req, res) => {
  res.render("compcourse", { title: "Competetive Course" });
};

module.exports.cppcourse_get = (req, res) => {
  res.render("cppcourse", { title: "C Programming Course" });
};

module.exports.madcourse_get = (req, res) => {
  res.render("madcourse", { title: "Mobile app development" });
};

module.exports.profile_get = (req, res) => {
  res.render("profile", { title: "Profile" });
};

module.exports.profile_put = (req, res) => {
  const { name, role, pno, id, imageURL } =req.body;
  //console.log(req.body);
   
  User.findOneAndUpdate({_id:id},{ name, role, pno,imageURL })
  .then((result)=>{
    res.json({redirect: '/profile'});
  })
  .catch((err)=>console.log(err))

  // res.render("profile", { title: "Profile" });
};

module.exports.addtask_get = (req, res) => {
  res.render("addtask", { title: "Add Task" });
};

module.exports.addtask_post = async (req, res) => {
  

  req.body.status = req.body.status == "on" ? true : false;


  const new_task = new Task(req.body);
  new_task.save()
    .then((result) => {
      
      res.redirect("/usertasks");
    })
    .catch((err) => console.log(err));

  // res.redirect("/usertasks");
};

module.exports.delete_task = (req,res)=>{
  const id = req.params.id;

  Task.findByIdAndDelete(id)
  .then(result=>{
    res.json({ redirect:'/usertasks' })
  })
  .catch(err=>{
    console.log(err);
  })
}

module.exports.update_task = (req,res)=>{
  const id = req.params.id;
  Task.findById(id)
  .then((result)=>{
   const status= !result.status;

   Task.findByIdAndUpdate({_id:id},{status})
  .then(result=>{
    res.json({ redirect:'/usertasks' })
  })
  .catch(err=>{
    console.log(err);
  })
})
  
}