const dbConnection = require('../../config/dbConnection');
const connection = dbConnection();

module.exports = app => {

    app.get('/', (req, res) => {
        res.render('index.ejs');
    });
    app.get('/Foodie_map', (req, res) => {
        res.render('Map.ejs');
    });
    app.get('/login', (req, res) => {
        res.render('login.ejs');
    });
    app.get('/profile', (req, res) => {
        if (!req.session.isLoggedIn) {
            return res.redirect('/login');
          }
      
          // ID del usuario
          const email = req.session.user.email;
         //informacion del usuario (en caso de ser vegano/alergias)
          const sqlSelectUser = 'SELECT * FROM users WHERE mail = ?';
          connection.query(sqlSelectUser, [email], (err, results) => {
            if (err) {
              console.error('Error al obtener información del usuario:', err);
              return res.status(500).send('<script>alert("Error al obtener información del usuario"); window.location.href="/";</script>');
            }

            console.log('respuesta/resultados de SQL:', results);
      
            if (results.length > 0) {
              const user = results[0];

              res.render('profile.ejs', { user });
            } else {
              res.status(404).send('<script>alert("Usuario not found"); window.location.href="/";</script>');
            }
          });
    });
    app.get('/settings', (req, res) => {
        res.render('settings.ejs');
    });

    //agregar usuario a DB
    app.post('/usersignup', (req, res) => {
        const { name, lastName, email, password } = req.body;

            const sqlInsert = 'INSERT INTO users (name, last_name, mail, passw, zone) VALUES (..., ..., ..., ...)';
            const values = [name, lastName, email, password, zone];

            connection.query(sqlInsert, values, (err, results) => {
                if (err) {
                    console.error('Error al registrar usuario:', err);
                    return res.status(500).send('<script>window.location.href="/login"; alert("Error al registrar usuario");</script>');
                }
    
                console.log('Usuario registrado');
                res.send('<script>window.location.href="/login"; alert("Usuario registrado");</script>');
            });
    });
    app.post('/userlogin', (req, res) => {
        const { email, password } = req.body;

    const sqlSelect = 'SELECT * FROM users WHERE mail = ?';
    connection.query(sqlSelect, [email], (err, results) => {
        if (err) {
            console.error('Error al detectar usuario:', err);
            return res.status(500).send('<script>window.location.href="/login"; alert("Error al iniciar sesión");</script>');
        }

        if (results.length > 0) {
            const user = results[0];
            console.log('Contraseña guardada:', user.passw.toString('utf-8'));
            console.log('Contraseña ingresada:', password);
            if (user.passw.toString('utf-8').trim() === password) {
                // Inicio de sesión exitoso
                req.session.user = { id: user.id_user, email: user.mail, zones: user.user_zones}; 
                req.session.isLoggedIn = true;
                res.redirect('/');
                
            } else {
                // Contraseña incorrecta
                res.status(401).send('<script>alert("Contraseña incorrecta"); window.location.href="/login";</script>');
            }
        } else {
            // Usuario no encontrado
            res.status(404).send('<script>alert("Usuario no encontrado"); window.location.href="/login";</script>');
        }
    });
    });
    app.get('/logout', (req, res) => {
        // Redirige al usuario a la página de login/inicio
        req.session.destroy(err => {
          if (err) {
            console.error('Error al iniciar sesión:', err);
            return res.status(500).send('<script>alert("Error al iniciar sesión"); window.location.href="/";</script>');
          }
    
          res.redirect('/');
        });
      });
            }
    
            