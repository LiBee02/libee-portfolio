const { response } = require('express')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const sqlite3 = require('sqlite3')
const expressSession = require("express-session")
const bcrypt = require('bcrypt')

//CREATE PROJECT
const MIN_PROJECT_NAME_LENGTH = 2
const MIN_PROJECT_CONTENT_LENGTH = 5

//CREATE MESSAGE
const MIN_MESSAGE_MESSAGE_LENGTH = 6
const MIN_MESSAGE_FIRSTNAME_LENGTH = 2
const MIN_MESSAGE_LASTNAME_LENGTH = 2

//ADMIN CREDENTIALS
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "$2b$10$JhS5IaUJfspzYofvxVp.lOgWzHxLy8ChbBZuB7seW173DXMOh7Pqy"


const db = new sqlite3.Database('libee-database.db')


//MESSAGES TABLE
db.run(`
	CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT,
		date INTEGER,
    content TEXT,
    link TEXT
	)
`)

//MESSAGES TABLE
db.run(`
	CREATE TABLE IF NOT EXISTS messages (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		firstname TEXT,
		lastname TEXT,
    email TEXT,
    phone INTEGER,
    message TEXT
	)
`)

//GUESTBOOK TABLE
db.run(` 
	CREATE TABLE IF NOT EXISTS guests (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		firstname TEXT,
		lastname TEXT,
    email TEXT,
    message TEXT
	)
`)

const app = express()

app.use(expressSession({
  secret: "dawdadsdfafasddwadshjt",
  saveUninitialized: false,
  resave: false
}))


app.engine("hbs", expressHandlebars.engine({
  defaultLayout: 'main.hbs'
}))


app.use(
    express.static('public')
)


app.use(
  express.urlencoded({
    extended: false
  })
)


app.use(function(request, response, next){

  const isLoggedIn = request.session.isLoggedIn

  response.locals.isLoggedIn = isLoggedIn

  next()

})


app.get('/', function(request, response){

  response.render('home.hbs')
})



//PROJECTS
//PROJECTS
app.get('/projects', function(request, response){

  const query = `SELECT * FROM projects`

  db.all(query, function(error, projects){

    const model = {
      projects
    }
  
      response.render('projects.hbs', model)
  
  })
  
})

//VALIDATION ERRORS FOR PROJECT
//VALIDATION ERRORS FOR PROJECT
function getValidationErrorsForProject(name, content){
  const validationErrors = []

  if(MIN_PROJECT_NAME_LENGTH >= name.length){
    validationErrors.push("Name must contain at least " + MIN_PROJECT_NAME_LENGTH + " characters.")
  }
  if(MIN_PROJECT_CONTENT_LENGTH >= content.length){
    validationErrors.push("Content must contain at least " + MIN_PROJECT_CONTENT_LENGTH + " characters.")
  }

  return validationErrors

}



//CREATE PROJECT
//CREATE PROJECT
app.get('/create-project', function(request, response){
    response.render('create-project.hbs')
})


app.post("/create-project",function(request, response) {

  const name = request.body.name
  const date = request.body.date
  const content = request.body.content
  const link = request.body.link

  const errors = validationErrors = getValidationErrorsForProject(name, date, content)

  if(!request.session.isLoggedIn){
    errors.push("You have to log in.")
  }

  if(errors.length == 0){
    const query = `INSERT INTO projects (name, date, content, link) VALUES (?, ?, ?, ?)`;
    const values = [name, date, content, link];
  
    db.run(query, values, function (error){
      if(error){
        response.render("error-page.hbs")

      }else{
        response.redirect("/projects/"+this.lastID)
      }
    })
  
  }else{
    const model = {
      errors,
      name, 
      date,
      content,
      link
    }
    response.render('create-project.hbs', model)
  }

})



//VIEW PROJECT
//VIEW PROJECT
app.get("/projects/:id", function(request, response){

  const id = request.params.id

  const query = `SELECT * FROM projects WHERE id = ?`
  const values = [id]
  
  db.get(query, values, function(error, project){

    if(error){
      response.render("error-page.hbs")

    }else{

      const model = {
        project,
      }
      
      response.render('project.hbs', model)
    }
    
  })

})



//DELETE PROJECT
//DELETE PROJECT
app.post("/projects/project/delete/:id", function(request, response){
  const id = request.params.id

  const query = `DELETE FROM projects where id = ?`
  const values = [id]

  db.run(query, values)

  response.redirect('/projects')
})



//EDIT PROJECT
//EDIT PROJECT
app.get("/edit-project/:id", function(request, response){

  const id = request.params.id

  const query = `SELECT * FROM projects WHERE id = ?`
  const values = [id]
  
  db.get(query, values, function(error, project){

    if(error){
      response.render("error-page.hbs")

    }else{
      const model = {
        project
      }
  
      response.render("edit-project.hbs", model)
      
    }
    
  })

})


app.post("/edit-project/:id",function(request, response) {

  const id = request.params.id
  const newName = request.body.name
  const newDate = request.body.date
  const newContent = request.body.content
  const newLink = request.body.link

  const errors = validationErrors = getValidationErrorsForProject(newName, newDate, newContent, newLink)

  if(!request.session.isLoggedIn){
    errors.push("You have to log in.")
  }
  
  if(errors.length == 0){
    const query = `UPDATE projects SET name = ?, date = ?, content = ?, link = ? WHERE id = ?`;

  const values = [newName, newDate, newContent, newLink, id];

  db.run(query, values, function (error){
    if(error){
      response.render("error-page.hbs")

    }else{
      response.redirect("/projects/" + id)
    }
  })

  }else{

    const model = {
      project: {
        id,
        name: newName,
        date: newDate,
        content: newContent,
        link: newLink
      },
      errors
    }

    response.render("edit-project.hbs", model)
    
  }

  
})



//CREATE MESSAGE / CONTACT ME
//CREATE MESSAGE / CONTACT ME
app.get('/create-message', function(request, response){
  response.render('create-message.hbs')
})


//VALIDATION ERRORS FOR MESSAGE
//VALIDATION ERRORS FOR MESSAGE
function getValidationErrorsForMessage(firstname, lastname, message){
  const validationErrors = []
  if(MIN_MESSAGE_FIRSTNAME_LENGTH >= firstname.length){
    validationErrors.push("First name must contain at least " + MIN_MESSAGE_FIRSTNAME_LENGTH + " characters.")
  }
  if(MIN_MESSAGE_LASTNAME_LENGTH >= lastname.length){
    validationErrors.push("Last name must contain at least " + MIN_MESSAGE_LASTNAME_LENGTH + " characters.")
  }
  if(MIN_MESSAGE_MESSAGE_LENGTH >= message.length){
    validationErrors.push("Message must contain at least " + MIN_MESSAGE_MESSAGE_LENGTH + " characters.")
  }
  
  return validationErrors

}


app.post("/create-message",function(request, response) {

  const firstname = request.body.firstname
  const lastname = request.body.lastname
  const email = request.body.email
  const phone = parseInt(request.body.phone)
  const message = request.body.message

  const errors = validationErrors = getValidationErrorsForMessage(firstname, lastname, email, phone, message)

  if(errors.length == 0){

    const query = `INSERT INTO messages (firstname, lastname, email, phone, message) VALUES (?, ?, ?, ?, ?)`
    const values = [firstname, lastname, email, phone, message]
  
    db.run(query, values, function (error){
      if(error){
        response.render("error-page.hbs")

      }else{
        response.render("message-sent.hbs")
      }
    })

  }else{
    const model = {
      errors,
      firstname,
      lastname,
      email,
      phone,
      message
    }
    response.render('create-message.hbs', model)
  }


})



//VIEW MESSAGES
//VIEW MESSAGES
app.get('/messages', function(request, response){

  const query = `SELECT * FROM messages`

  db.all(query, function(error, messages){

    const model = {
      messages,
    }
  
      response.render('messages.hbs', model)
  })
  
})



//VIEW MESSAGE
//VIEW MESSAGE
app.get("/message/:id", function(request, response){

  const id = request.params.id

  const query = `SELECT * FROM messages WHERE id = ?`
  const values = [id]
  
  db.get(query, values, function(error, message){

    if(error){
      response.render("error-page.hbs")

    }else{

      const model = {
        message,
      }
      
      response.render('message.hbs', model)
    }
    
  })

})



//DELETE MESSAGE
//DELETE MESSAGE
app.post("/messages/message/delete/:id", function(request, response){
  const id = request.params.id

  const query = `DELETE FROM messages where id = ?`
  const values = [id]

  db.run(query, values)

  response.redirect('/messages')
})



//CREATE GUEST
//CREATE GUEST
app.get('/create-guest', function(request, response){
  response.render('create-guest.hbs')
})

app.post("/create-guest",function(request, response) {

  const firstname = request.body.firstname
  const lastname = request.body.lastname
  const email = request.body.email
  const message = request.body.message

  const query = `INSERT INTO guests (firstname, lastname, email, message) VALUES (?, ?, ?, ?)`

  const values = [firstname, lastname, email, message]

  db.run(query, values, function (error){
    if(error){
      response.render("error-page.hbs")

    }else{
      response.render("guest-sent.hbs")
    }
  })

})



//VIEW GUESTBOOK
//VIEW GUESTBOOK
app.get('/guests', function(request, response){
  
  const query = `SELECT * FROM guests`

  db.all(query, function(error, guests){

    const model = {
      guests,
    }
  
      response.render('guests.hbs', model)
  })
  
})



//VIEW GUEST
//VIEW GUEST  
app.get("/guest/:id", function(request, response){
    
  const id = request.params.id
  
  const query = `SELECT * FROM guests WHERE id = ?`
  const values = [id]
  
  db.get(query, values, function(error, guest){

    if(error){
      response.render("error-page.hbs")

    }else{

      const model = {
        guest,
      }
      
      response.render('guest.hbs', model)
    }
    
  })

})



//DELETE GUEST 
//DELETE GUEST   
app.post("/guests/guest/delete/:id", function(request, response){
  const id = request.params.id

  const query = `DELETE FROM guests where id = ?`
  const values = [id]

  db.run(query, values)

  response.redirect('/guests')
})



//ABOUT ME
//ABOUT ME
  app.get('/about', function(request, response){
    response.render('about.hbs')
  })



//LOGIN
//LOGIN
app.get("/login", function(request, response){
	response.render("login.hbs")
})

app.post("/login", function(request, response){
	
	const enteredUsername = request.body.username
	const enteredPassword = request.body.password
	const passwordIsCorrect = bcrypt.compareSync(enteredPassword, ADMIN_PASSWORD); // true
  
	if(enteredUsername == ADMIN_USERNAME && passwordIsCorrect){
    // Login
		request.session.isLoggedIn = true
	  response.redirect("/")
		
	}else{
		const model = {
			failedToLogin: true
		}
		
		response.render('login.hbs', model)
		
	}
	
})



//LOGOUT
//LOGOUT
app.post("/logout", function(request, response){
  request.session.isLoggedIn = false
  response.redirect("/")
})

app.listen(8080)