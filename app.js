const { response } = require('express')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('libee-database.db')

db.run(`
	CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY,
		name TEXT,
		date INTEGER,
    content TEXT,
    link TEXT
	)
`)

db.run(`
	CREATE TABLE IF NOT EXISTS messages (
		id INTEGER PRIMARY KEY,
		firstname TEXT,
		lastname TEXT,
    email TEXT,
    phone INTEGER,
    message TEXT
	)
`)

// FOR THE GUESTBOOK
db.run(` 
	CREATE TABLE IF NOT EXISTS guests (
		id INTEGER PRIMARY KEY,
		firstname TEXT,
		lastname TEXT,
    email TEXT,
    message TEXT
	)
`)

const app = express()

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


app.get('/', function(request, response){
  
  const model = {
		session: request.session
	}

  response.render('home.hbs')
})


app.get('/projects', function(request, response){

  const query = `SELECT * FROM projects`

  db.all(query, function(error, projects){

    const model = {
      projects
    }
  
      response.render('projects.hbs', model)
  
  })
  
})


app.get('/create-project', function(request, response){
  response.render('create-project.hbs')
})

app.post("/create-project",function(request, response) {

  const name = request.body.name
  const date = request.body.date
  const content = request.body.content
  const link = request.body.link

  const query = `INSERT INTO projects (name, date, content, link) VALUES (?, ?, ?, ?)`;

  const values = [name, date, content, link];

  db.run(query, values, function (error){
    if(error){
      console.log(error)
    }else{
      response.redirect("/projects/"+this.lastID)
    }
  })

})



  app.get("/projects/:id", function(request, response){

    const id = request.params.id
	
    const query = `SELECT * FROM projects WHERE id = ?`
    const values = [id]
    
    db.get(query, values, function(error, project){

      if(error){
        console.log(error)
        //Display error
      }else{

        const model = {
          project,
        }
        
        response.render('project.hbs', model)
      }
      
    })

  })


  app.get("/projects-delete/:id", function(request, response){
    const id = request.params.id

    const query = `DELETE FROM projects where id = ?`
    const values = [id]

    db.run(query, values)

    response.redirect('/projects')
  })


  app.get("/edit-project/:id", function(request, response){

    const id = request.params.id

    const query = `SELECT * FROM projects WHERE id = ?`
    const values = [id]
    
    db.get(query, values, function(error, project){

      if(error){
        console.log(error)
        //Display error
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

    const name = request.body.name
    const date = request.body.date
    const content = request.body.content
    const link = request.body.link
  
    const query = `UPDATE projects SET name = ?, date = ?, content = ?, link = ? WHERE id = ?`;
  
    const values = [name, date, content, link, id];
  
    db.run(query, values, function (error){
      if(error){
        console.log(error)
      }else{
        response.redirect("/projects/" + id)
      }
    })
  
  })

  app.listen(8080)




//CONTACT ME//
//CONTACT ME//
  app.get('/create-message', function(request, response){
    response.render('create-message.hbs')
  })

  app.post("/create-message",function(request, response) {
  
    const firstname = request.body.firstname
    const lastname = request.body.lastname
    const email = request.body.email
    const phone = request.body.phone
    const message = request.body.message
  
    const query = `INSERT INTO messages (firstname, lastname, email, phone, message) VALUES (?, ?, ?, ?, ?)`
  
    const values = [firstname, lastname, email, phone, message]

    db.run(query, values, function (error){
      if(error){
        console.log(error)
      }else{
        response.render("message-sent.hbs")
      }
    })

  })
  
  app.get('/messages', function(request, response){

    const query = `SELECT * FROM messages`
  
    db.all(query, function(error, messages){
  
      const model = {
        messages,
      }
    
        response.render('messages.hbs', model)
    })
    
  })
  
    app.get("/message/:id", function(request, response){
  
      const id = request.params.id
    
      const query = `SELECT * FROM messages WHERE id = ?`
      const values = [id]
      
      db.get(query, values, function(error, message){
  
        if(error){
          console.log(error)
          //Display error
        }else{
  
          const model = {
            message,
          }
          
          response.render('message.hbs', model)
        }
        
      })
  
    })







    //GUESTBOOK//GUESTBOOK
    
    app.get('/guests', function(request, response){
      response.render('guests.hbs')
    })

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
          console.log(error)
        }else{
          response.render("guest-sent.hbs")
        }
      })
  
    })
    
    app.get('/guests', function(request, response){
  
      const query = `SELECT * FROM guests`
    
      db.all(query, function(error, guests){
    
        const model = {
          guests,
        }
      
          response.render('guests.hbs', model)
      })
      
    })
    
      app.get("/guest/:id", function(request, response){
    
        const id = request.params.id
      
        const query = `SELECT * FROM guests WHERE id = ?`
        const values = [id]
        
        db.get(query, values, function(error, guest){
    
          if(error){
            console.log(error)
            //Display error
          }else{
    
            const model = {
              guest,
            }
            
            response.render('guest.hbs', model)
          }
          
        })
    
      })









  app.get('/about', function(request, response){
    response.render('about.hbs')
  })









//*HAVENT IMPLEMENTED THIS YET*/
  /*
app.get("/login", function(request, response){
	response.render("login.hbs")
})

app.post("/login", function(request, response){
	
	const username = request.body.username
	const password = request.body.password
	
	if(username == ADMIN_USERNAME && password == ADMIN_PASSWORD){
		
		request.session.isLoggedIn = true
		
	  response.redirect("/")
		
	}else{
		
		const model = {
			failedToLogin: true
		}
		
		response.render('login.hbs', model)
		
	}
	
})
*/