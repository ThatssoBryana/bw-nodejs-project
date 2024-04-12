const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect naar database
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    database: 'bw_project_database', 
    username: 'admin',
    password: 'Password!321',
  });

// Define User model
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  profile_photo_path: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Define News model
const News = sequelize.define('News', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  publish_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

// Sync models met de database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(error => {
    console.error('Error synchronizing models:', error);
  });

  app.get('/', (req, res) => {
    res.send('Server is running!');
  });

// Middleware to validate user data
function validateUserData(req, res, next) {
    const { name, email, password, is_admin, profile_photo_path } = req.body;
  
    // Check lege velden
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
  
    // Validate email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  
    // Validate is_admin 
    if (typeof is_admin !== 'boolean') {
      return res.status(400).json({ error: 'Invalid value for is_admin field' });
    }
  
    // Validate profile_photo_path field 
    if (profile_photo_path && typeof profile_photo_path !== 'string') {
      return res.status(400).json({ error: 'Invalid value for profile_photo_path field' });
    }
  
    // Validate name: geen nummers
    const nameRegex = /^[a-zA-Z\s]*$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: 'Name cannot contain numbers' });
    }
 
    next();
  }
  
  // Middleware to validate news data
  function validateNewsData(req, res, next) {
    const { title, content } = req.body;
  
    // Check lege velden
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
  
    next();
  }
  
  // Routes for users
  // Create
  app.post('/users', validateUserData, async (req, res) => {
    const { name, email, password, is_admin, profile_photo_path } = req.body;
    const newUser = await User.create({ name, email, password, is_admin, profile_photo_path });
    res.status(201).json(newUser);
  });
  
  // Get all users
  app.get('/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
  });

  // Get all users or a limited number of users with an offset
app.get('/users', async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const users = await User.findAll({ limit, offset });
    res.json(users);
  });
  
// Search for users based on multiple fields
app.get('/users/search', async (req, res) => {
    const { criteria } = req.query;
    if (!criteria || !Array.isArray(criteria)) {
      return res.status(400).json({ error: 'Search criteria must be provided as an array' });
    }
  
    let whereClause = {};
    criteria.forEach(({ field, term }) => {
      whereClause[field] = {
        [Sequelize.Op.like]: `%${term}%` // Case-insensitive search
      };
    });
  
    try {
      const users = await User.findAll({
        where: whereClause
      });
      res.json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get user by ID
  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
  
  // Update user by ID
  app.put('/users/:id', validateUserData, async (req, res) => {
    const { id } = req.params;
    const { name, email, password, is_admin, profile_photo_path } = req.body;
    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.name = name;
    user.email = email;
    user.password = password;
    user.is_admin = is_admin;
    user.profile_photo_path = profile_photo_path;
    await user.save();
    res.json(user);
  });
  
  // Delete user by ID
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.status(204).end();
  });
  
  // Routes for news
  // Create 
  app.post('/news', validateNewsData, async (req, res) => {
    const { title, content, cover_image, publish_date } = req.body;
    const newNews = await News.create({ title, content, cover_image, publish_date });
    res.status(201).json(newNews);
  });
  
  // Get all news items
  app.get('/news', async (req, res) => {
    const news = await News.findAll();
    res.json(news);
  });

  // Get all news items or a limited number of news items with an offset
app.get('/news', async (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    const news = await News.findAll({ limit, offset });
    res.json(news);
  });

// Search for news items based on multiple fields
app.get('/news/search', async (req, res) => {
    const { criteria } = req.query;
    if (!criteria || !Array.isArray(criteria)) {
      return res.status(400).json({ error: 'Search criteria must be provided as an array' });
    }
  
   
    let whereClause = {};
    criteria.forEach(({ field, term }) => {
      whereClause[field] = {
        [Sequelize.Op.like]: `%${term}%` 
      };
    });
  
    try {
      const news = await News.findAll({
        where: whereClause
      });
      res.json(news);
    } catch (error) {
      console.error('Error searching news items:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Get news by ID
  app.get('/news/:id', async (req, res) => {
    const { id } = req.params;
    const newsItem = await News.findByPk(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News item not found' });
    }
    res.json(newsItem);
  });
  
  // Update news by ID
  app.put('/news/:id', validateNewsData, async (req, res) => {
    const { id } = req.params;
    const { title, content, cover_image, publish_date } = req.body;
    let newsItem = await News.findByPk(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News item not found' });
    }
    newsItem.title = title;
    newsItem.content = content;
    newsItem.cover_image = cover_image;
    newsItem.publish_date = publish_date;
    await newsItem.save();
    res.json(newsItem);
  });
  
  // Delete news by ID

app.delete('/news/:id', async (req, res) => {
    const { id } = req.params;
    const newsItem = await News.findByPk(id);
    if (!newsItem) {
      return res.status(404).json({ error: 'News item not found' });
    }
    await newsItem.destroy();
    res.status(204).end();
  });
  
  
// Server starten
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});




