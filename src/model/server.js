const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user:'root',
  password:'root',
  database:'epms'
})

// Register
app.post('/register', (req, res) => {
  const { name, email, password, phone, authorID } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    const user = {
      lectName: name,
      lectEmail: email,
      lectPassword: hashedPassword,
      lectMobileNum: phone,
      remember_token: '',
      created_at: new Date(),
      updated_at: new Date(),
      authorID: authorID
    };

    // Insert the user into the 'lecturer' table
    const sql = 'INSERT INTO lecturer SET ?';
    db.query(sql, user, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to register user' });
      }

      const lectID = result.insertId; // Get the auto-generated lectID

      const user2 = {
        vrDate: new Date(),
        authorID: authorID,
        lectID: lectID
      };

      // Insert the user into the 'verifyreq' table
      const sql2 = 'INSERT INTO verifyreq SET ?';
      db.query(sql2, user2, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to register user' });
        }

        return res.status(200).json({ message: 'Registration successful' });
      });
    });
  });
});


// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const sql = 'SELECT lectID, authorID, lectPassword FROM lecturer WHERE lectEmail = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare the passwords
    bcrypt.compare(password, user.lectPassword, (err, match) => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Update remember_token and updated_at
      const token = jwt.sign({ userId: user.lectID }, '4gG5#2D!t0pS3cR3tK#y');
      const sqlUpdate = 'UPDATE lecturer SET remember_token = ?, updated_at = ? WHERE lectID = ?';
      const updatedToken = ''; // Generate or set the new remember_token

      db.query(sqlUpdate, [updatedToken, new Date(), user.lectID], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update user' });
        }

        return res.status(200).json({ message: 'Login successful', token, authorID: user.authorID });
      });
    });
  });
});


// Complaint
app.post('/complaint', (req, res) => {
  const { subject, desc, lectID } = req.body;

    const comp = {
      compDate: new Date(),
      compSubject: subject,
      compDesc: desc,
      lectID: lectID
    };

    // Insert the comp into the 'complaint' table
    const sql = 'INSERT INTO complaint SET ?';
    db.query(sql, comp, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to send complaintr' });
      }
    });
  });


// Protected route example
app.get('/protected', (req, res) => {
  // Verify the JWT token
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, '4gG5#2D!t0pS3cR3tK#y');
    const userId = decoded.userId;

    // Perform actions based on the user ID
    // ...

    return res.status(200).json({ message: 'Access granted' });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

  
function requireAuth(req, res, next) {
  // Check if the user is authenticated (e.g., by checking the session)
  if (req.session && req.session.authorID) {
    // User is authenticated, proceed to the next middleware/route handler
    next();
  } else {
    // Verify the JWT token
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(token, '4gG5#2D!t0pS3cR3tK#y');
      const authorID = decoded.authorID;

      // Store the authorID in the session
      req.session.authorID = authorID;

      // User is now authenticated, proceed to the next middleware/route handler
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

// Protected route
app.get('/authorProfile/:authorID', requireAuth, (req, res) => {
  const authorID = req.params.authorID;
  // Use the authorID to retrieve the author profile from your data source
  // ...

  // Return the author profile as a response
  res.send(`Author Profile: ${authorID}`);
});



app.get('/', (re, res)=> {
  return res.json("from backend");
})

app.get('/publication', (req, res)=> {
  const sql = "SELECT * FROM publication";
  db.query(sql, (err, data)=> {
    if(err) return res.json(err);
    return res.json(data);
  })
})

app.get('/publication/:id', (req, res) => {
    const publicationId = req.params.id;
    const sql = "SELECT * FROM publication WHERE pubID = ?";
    db.query(sql, [publicationId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

app.get('/authorPublication/:id', (req, res) => {
  const authorID = req.params.id;
  const sql = "SELECT * FROM publication WHERE authorID = ?";
  db.query(sql, [authorID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get('/author', (req, res)=> {
    const sql = "SELECT * FROM author";
    db.query(sql, (err, data)=> {
      if(err) return res.json(err);
      return res.json(data);
    })
  })

app.get('/author/:id', (req, res) => {
    const authorId = req.params.id;
    const sql = "SELECT * FROM author WHERE authorID = ?";
    db.query(sql, [authorId], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });

// Fetch lecturer by author ID
app.get("/lecturer/:authorID", (req, res) => {
  const authorID = req.params.authorID;
  const sql = "SELECT lectID FROM lecturer WHERE authorID = ?";
  db.query(sql, authorID, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch lecturer" });
    }
    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json({ error: "Lecturer not found" });
    }
  });
});

  // Serve the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Catchall route handler to serve the React app's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = 3001; // Port number for the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


