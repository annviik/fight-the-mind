import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import { z } from 'zod';

const app = express();
const db = new Database('database.sqlite');

// JWT Secret - Use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'fight-the-mind-secret-key-change-in-production';

// Auto-seed database if empty
const seedIfEmpty = async () => {
  const storyCount = db.prepare('SELECT COUNT(*) as count FROM stories').get();
  if (storyCount.count === 0) {
    console.log('📦 Database empty, seeding initial data...');
    
    // Add sample stories
    const stories = [
      {
        title: 'Finding Light in the Darkness: My Journey with Depression',
        content: 'After years of struggling in silence, I finally found the courage to seek help. Depression had become my constant companion, but therapy and support changed everything. Recovery isn\'t linear, but hope is real.',
        excerpt: 'After years of struggling in silence, I finally found the courage to seek help...',
        authorName: 'Anonymous',
        category: 'Depression',
        likes: 245
      },
      {
        title: 'Anxiety Doesn\'t Define Me Anymore',
        content: 'Living with anxiety felt like being trapped in a storm. But with therapy, medication, and support, I found my calm. The panic attacks still come sometimes, but I have tools now. You can find peace too.',
        excerpt: 'Living with anxiety felt like being trapped in a storm. But with therapy...',
        authorName: 'Sarah M.',
        category: 'Anxiety',
        likes: 189
      },
      {
        title: 'The Power of Community in Mental Health Recovery',
        content: 'I never knew how much connection could heal until I found others who understood. Joining a support group changed my life. We are not meant to heal alone.',
        excerpt: 'I never knew how much connection could heal until I found others who understood...',
        authorName: 'James T.',
        category: 'Recovery',
        likes: 312
      },
      {
        title: 'Breaking the Stigma: A Father\'s Perspective',
        content: 'As a man, I was taught to be strong and never show weakness. But mental health doesn\'t discriminate. Asking for help is the bravest thing I ever did.',
        excerpt: 'As a man, I was taught to be strong and never show weakness...',
        authorName: 'Michael R.',
        category: 'Personal Growth',
        likes: 423
      }
    ];
    
    const insertStory = db.prepare(
      'INSERT INTO stories (title, content, excerpt, author_name, category, likes) VALUES (?, ?, ?, ?, ?, ?)'
    );
    
    for (const s of stories) {
      insertStory.run(s.title, s.content, s.excerpt, s.authorName, s.category, s.likes);
    }
    
    // Add sample therapists
    const therapists = [
      { firstName: 'Emily', lastName: 'Chen', email: 'emily.chen@therapy.com', phone: '+1 (555) 123-4567', licenseType: 'Licensed Clinical Psychologist', licenseNumber: 'PSY12345', specialties: 'Anxiety, Depression, Trauma', bio: 'Dr. Chen has over 15 years of experience helping individuals overcome anxiety and depression.', photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face', city: 'New York', state: 'NY', zip: '10001', rating: 4.9, reviewsCount: 127, verified: 1 },
      { firstName: 'Marcus', lastName: 'Williams', email: 'marcus.williams@therapy.com', phone: '+1 (555) 234-5678', licenseType: 'Licensed Marriage & Family Therapist', licenseNumber: 'MFT67890', specialties: 'Relationships, Family Therapy, Grief', bio: 'Dr. Williams specializes in helping couples and families navigate difficult transitions.', photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face', city: 'New York', state: 'NY', zip: '10002', rating: 4.8, reviewsCount: 94, verified: 1 },
      { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@therapy.com', phone: '+1 (555) 345-6789', licenseType: 'Licensed Clinical Social Worker', licenseNumber: 'LCSW11111', specialties: 'Anxiety, PTSD, Life Transitions', bio: 'Sarah brings a compassionate, trauma-informed approach to therapy.', photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face', city: 'Brooklyn', state: 'NY', zip: '11201', rating: 4.7, reviewsCount: 82, verified: 1 }
    ];
    
    const insertTherapist = db.prepare(
      'INSERT INTO therapists (first_name, last_name, email, phone, license_type, license_number, specialties, bio, photo_url, city, state, zip, rating, reviews_count, verified, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)'
    );
    
    for (const t of therapists) {
      insertTherapist.run(t.firstName, t.lastName, t.email, t.phone, t.licenseType, t.licenseNumber, t.specialties, t.bio, t.photoUrl, t.city, t.state, t.zip, t.rating, t.reviewsCount, t.verified);
    }
    
    console.log('✅ Database seeded with sample data');
  }
};

seedIfEmpty();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS therapists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    license_type TEXT NOT NULL,
    license_number TEXT NOT NULL,
    specialties TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    address TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    available INTEGER DEFAULT 1,
    verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    author_name TEXT NOT NULL,
    category TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS story_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    user_id INTEGER,
    author_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS story_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(story_id, user_id),
    FOREIGN KEY (story_id) REFERENCES stories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    therapist_id INTEGER NOT NULL,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (therapist_id) REFERENCES therapists(id)
  );

  CREATE TABLE IF NOT EXISTS mood_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    mood INTEGER NOT NULL,
    energy INTEGER,
    notes TEXT,
    activities TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Optional auth middleware - doesn't require auth but attaches user if present
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) req.user = user;
    });
  }
  next();
};

// Validation schemas
const signupSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const therapistSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  licenseType: z.string().min(1),
  licenseNumber: z.string().min(1),
  specialties: z.string().min(1),
  bio: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
});

const storySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(50, 'Story must be at least 50 characters'),
  authorName: z.string().min(1, 'Author name is required'),
  category: z.string().min(1, 'Category is required'),
});

// AUTH ROUTES

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    
    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const result = db.prepare(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)'
    ).run(data.firstName, data.lastName, data.email, hashedPassword);

    // Generate token
    const token = jwt.sign(
      { id: result.lastInsertRowid, email: data.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: result.lastInsertRowid,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: 'user',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(data.email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, first_name, last_name, email, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
  });
});

// THERAPIST ROUTES

// Register as therapist
app.post('/api/therapists', async (req, res) => {
  try {
    const data = therapistSchema.parse(req.body);

    // Check if therapist with email already exists
    const existingTherapist = db.prepare('SELECT id FROM therapists WHERE email = ?').get(data.email);
    if (existingTherapist) {
      return res.status(400).json({ error: 'A therapist with this email already exists' });
    }

    const result = db.prepare(`
      INSERT INTO therapists (
        first_name, last_name, email, phone, license_type, license_number,
        specialties, bio, address, city, state, zip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.firstName, data.lastName, data.email, data.phone || null,
      data.licenseType, data.licenseNumber, data.specialties,
      data.bio || null, data.address || null, data.city, data.state, data.zip
    );

    res.status(201).json({
      message: 'Therapist registration submitted successfully. We will review your application.',
      id: result.lastInsertRowid,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search therapists
app.get('/api/therapists', (req, res) => {
  try {
    const { location, specialty, available, verified } = req.query;
    
    let query = 'SELECT * FROM therapists WHERE 1=1';
    const params = [];

    if (location) {
      query += ' AND (city LIKE ? OR state LIKE ? OR zip LIKE ?)';
      const searchTerm = `%${location}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (specialty) {
      query += ' AND specialties LIKE ?';
      params.push(`%${specialty}%`);
    }

    if (available === 'true') {
      query += ' AND available = 1';
    }

    if (verified === 'true') {
      query += ' AND verified = 1';
    }

    query += ' ORDER BY verified DESC, rating DESC, reviews_count DESC';

    const therapists = db.prepare(query).all(...params);

    // Transform data for frontend
    const result = therapists.map(t => ({
      id: t.id,
      name: `Dr. ${t.first_name} ${t.last_name}`,
      title: t.license_type,
      specialties: t.specialties.split(',').map(s => s.trim()),
      rating: t.rating || 4.5,
      reviews: t.reviews_count || 0,
      distance: '2.5 miles', // Would calculate with geolocation in production
      available: t.available === 1,
      verified: t.verified === 1,
      city: t.city,
      state: t.state,
      bio: t.bio,
      phone: t.phone,
      email: t.email,
      photoUrl: t.photo_url,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single therapist
app.get('/api/therapists/:id', (req, res) => {
  try {
    const therapist = db.prepare('SELECT * FROM therapists WHERE id = ?').get(req.params.id);
    
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    res.json({
      id: therapist.id,
      name: `Dr. ${therapist.first_name} ${therapist.last_name}`,
      title: therapist.license_type,
      specialties: therapist.specialties.split(',').map(s => s.trim()),
      rating: therapist.rating || 4.5,
      reviews: therapist.reviews_count || 0,
      available: therapist.available === 1,
      verified: therapist.verified === 1,
      city: therapist.city,
      state: therapist.state,
      bio: therapist.bio,
      phone: therapist.phone,
      email: therapist.email,
      address: therapist.address,
      zip: therapist.zip,
      photoUrl: therapist.photo_url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// STORIES ROUTES

// Get all stories
app.get('/api/stories', optionalAuth, (req, res) => {
  try {
    const { category, search } = req.query;

    let query = `
      SELECT 
        s.*,
        (SELECT COUNT(*) FROM story_comments WHERE story_id = s.id) as comments_count
      FROM stories s
      WHERE 1=1
    `;
    const params = [];

    if (category && category !== 'All') {
      query += ' AND s.category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (s.title LIKE ? OR s.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY s.created_at DESC';

    const stories = db.prepare(query).all(...params);

    const result = stories.map(story => {
      let userLiked = false;
      if (req.user) {
        const like = db.prepare('SELECT id FROM story_likes WHERE story_id = ? AND user_id = ?')
          .get(story.id, req.user.id);
        userLiked = !!like;
      }

      return {
        id: story.id,
        title: story.title,
        excerpt: story.excerpt,
        content: story.content,
        author: story.author_name,
        category: story.category,
        likes: story.likes,
        comments: story.comments_count,
        date: new Date(story.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        readTime: `${Math.ceil(story.content.split(' ').length / 200)} min read`,
        userLiked,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single story
app.get('/api/stories/:id', optionalAuth, (req, res) => {
  try {
    const story = db.prepare(`
      SELECT 
        s.*,
        (SELECT COUNT(*) FROM story_comments WHERE story_id = s.id) as comments_count
      FROM stories s
      WHERE s.id = ?
    `).get(req.params.id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const comments = db.prepare(`
      SELECT * FROM story_comments WHERE story_id = ? ORDER BY created_at DESC
    `).all(req.params.id);

    let userLiked = false;
    if (req.user) {
      const like = db.prepare('SELECT id FROM story_likes WHERE story_id = ? AND user_id = ?')
        .get(story.id, req.user.id);
      userLiked = !!like;
    }

    res.json({
      id: story.id,
      title: story.title,
      content: story.content,
      excerpt: story.excerpt,
      author: story.author_name,
      category: story.category,
      likes: story.likes,
      comments: comments.map(c => ({
        id: c.id,
        author: c.author_name,
        content: c.content,
        date: new Date(c.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      })),
      date: new Date(story.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      readTime: `${Math.ceil(story.content.split(' ').length / 200)} min read`,
      userLiked,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create story
app.post('/api/stories', optionalAuth, (req, res) => {
  try {
    const data = storySchema.parse(req.body);
    
    // Create excerpt from content
    const excerpt = data.content.substring(0, 200) + (data.content.length > 200 ? '...' : '');

    const result = db.prepare(`
      INSERT INTO stories (user_id, title, content, excerpt, author_name, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      req.user?.id || null,
      data.title,
      data.content,
      excerpt,
      data.authorName,
      data.category
    );

    res.status(201).json({
      message: 'Story shared successfully',
      id: result.lastInsertRowid,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike story
app.post('/api/stories/:id/like', authenticateToken, (req, res) => {
  try {
    const storyId = req.params.id;
    const userId = req.user.id;

    // Check if already liked
    const existingLike = db.prepare('SELECT id FROM story_likes WHERE story_id = ? AND user_id = ?')
      .get(storyId, userId);

    if (existingLike) {
      // Unlike
      db.prepare('DELETE FROM story_likes WHERE story_id = ? AND user_id = ?').run(storyId, userId);
      db.prepare('UPDATE stories SET likes = likes - 1 WHERE id = ?').run(storyId);
      res.json({ liked: false });
    } else {
      // Like
      db.prepare('INSERT INTO story_likes (story_id, user_id) VALUES (?, ?)').run(storyId, userId);
      db.prepare('UPDATE stories SET likes = likes + 1 WHERE id = ?').run(storyId);
      res.json({ liked: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment to story
app.post('/api/stories/:id/comments', optionalAuth, (req, res) => {
  try {
    const { content, authorName } = req.body;

    if (!content || content.trim().length < 1) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const name = authorName || (req.user ? 'User' : 'Anonymous');

    const result = db.prepare(`
      INSERT INTO story_comments (story_id, user_id, author_name, content)
      VALUES (?, ?, ?, ?)
    `).run(req.params.id, req.user?.id || null, name, content);

    res.status(201).json({
      message: 'Comment added',
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get categories
app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT DISTINCT category FROM stories').all();
  res.json(['All', ...categories.map(c => c.category)]);
});

// MESSAGING ROUTES

// Send message to therapist
app.post('/api/messages', (req, res) => {
  try {
    const { therapistId, senderName, senderEmail, senderPhone, subject, message } = req.body;

    if (!therapistId || !senderName || !senderEmail || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify therapist exists
    const therapist = db.prepare('SELECT id, first_name, last_name, email FROM therapists WHERE id = ?').get(therapistId);
    if (!therapist) {
      return res.status(404).json({ error: 'Therapist not found' });
    }

    // Save message
    const result = db.prepare(`
      INSERT INTO messages (therapist_id, sender_name, sender_email, sender_phone, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(therapistId, senderName, senderEmail, senderPhone || null, subject, message);

    // In a real app, you would send an email notification to the therapist here
    // For now, we'll just save to database

    res.status(201).json({
      message: 'Message sent successfully! The therapist will respond to your email.',
      id: result.lastInsertRowid,
      therapistName: `Dr. ${therapist.first_name} ${therapist.last_name}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a therapist (would be used in therapist dashboard)
app.get('/api/therapists/:id/messages', authenticateToken, (req, res) => {
  try {
    const messages = db.prepare(`
      SELECT * FROM messages WHERE therapist_id = ? ORDER BY created_at DESC
    `).all(req.params.id);

    res.json(messages.map(m => ({
      id: m.id,
      senderName: m.sender_name,
      senderEmail: m.sender_email,
      senderPhone: m.sender_phone,
      subject: m.subject,
      message: m.message,
      status: m.status,
      date: new Date(m.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// MOOD TRACKER ROUTES

// Log a mood entry
app.post('/api/moods', authenticateToken, (req, res) => {
  try {
    const { mood, energy, notes, activities } = req.body;

    if (mood === undefined || mood < 1 || mood > 5) {
      return res.status(400).json({ error: 'Mood must be between 1 and 5' });
    }

    const result = db.prepare(`
      INSERT INTO mood_entries (user_id, mood, energy, notes, activities)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      mood,
      energy || null,
      notes || null,
      activities ? JSON.stringify(activities) : null
    );

    res.status(201).json({
      message: 'Mood logged successfully',
      id: result.lastInsertRowid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get mood entries for current user
app.get('/api/moods', authenticateToken, (req, res) => {
  try {
    const { days } = req.query;
    const daysLimit = parseInt(days) || 30;

    const entries = db.prepare(`
      SELECT * FROM mood_entries 
      WHERE user_id = ? 
      AND created_at >= datetime('now', '-${daysLimit} days')
      ORDER BY created_at DESC
    `).all(req.user.id);

    res.json(entries.map(e => ({
      id: e.id,
      mood: e.mood,
      energy: e.energy,
      notes: e.notes,
      activities: e.activities ? JSON.parse(e.activities) : [],
      date: e.created_at,
      formattedDate: new Date(e.created_at).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get mood stats
app.get('/api/moods/stats', authenticateToken, (req, res) => {
  try {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_entries,
        AVG(mood) as avg_mood,
        AVG(energy) as avg_energy,
        MAX(mood) as best_mood,
        MIN(mood) as lowest_mood
      FROM mood_entries 
      WHERE user_id = ?
      AND created_at >= datetime('now', '-30 days')
    `).get(req.user.id);

    const weeklyMoods = db.prepare(`
      SELECT 
        strftime('%w', created_at) as day_of_week,
        AVG(mood) as avg_mood
      FROM mood_entries 
      WHERE user_id = ?
      AND created_at >= datetime('now', '-30 days')
      GROUP BY strftime('%w', created_at)
    `).all(req.user.id);

    res.json({
      totalEntries: stats.total_entries || 0,
      avgMood: stats.avg_mood ? parseFloat(stats.avg_mood.toFixed(1)) : null,
      avgEnergy: stats.avg_energy ? parseFloat(stats.avg_energy.toFixed(1)) : null,
      bestMood: stats.best_mood,
      lowestMood: stats.lowest_mood,
      weeklyMoods: weeklyMoods.map(w => ({
        dayOfWeek: parseInt(w.day_of_week),
        avgMood: parseFloat(w.avg_mood.toFixed(1)),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

