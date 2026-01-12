import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('database.sqlite');

// Create tables first (same as server.js)
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

console.log('📦 Tables created');

// Clear existing data
db.exec(`
  DELETE FROM story_likes;
  DELETE FROM story_comments;
  DELETE FROM stories;
  DELETE FROM therapists;
  DELETE FROM users;
`);

console.log('🗑️  Cleared existing data');

// Create demo user
const hashedPassword = await bcrypt.hash('password123', 10);
db.prepare(`
  INSERT INTO users (first_name, last_name, email, password, role)
  VALUES ('Demo', 'User', 'demo@example.com', ?, 'user')
`).run(hashedPassword);

console.log('👤 Created demo user: demo@example.com / password123');

// Seed therapists with photos
const therapists = [
  {
    firstName: 'Emily',
    lastName: 'Chen',
    email: 'emily.chen@therapy.com',
    phone: '+1 (555) 123-4567',
    licenseType: 'Licensed Clinical Psychologist',
    licenseNumber: 'PSY12345',
    specialties: 'Anxiety, Depression, Trauma',
    bio: 'Dr. Chen has over 15 years of experience helping individuals overcome anxiety and depression. She uses a combination of CBT and mindfulness-based approaches.',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    address: '123 Wellness Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    rating: 4.9,
    reviewsCount: 127,
    available: 1,
    verified: 1,
  },
  {
    firstName: 'Marcus',
    lastName: 'Williams',
    email: 'marcus.williams@therapy.com',
    phone: '+1 (555) 234-5678',
    licenseType: 'Licensed Marriage & Family Therapist',
    licenseNumber: 'MFT67890',
    specialties: 'Relationships, Family Therapy, Grief',
    bio: 'Dr. Williams specializes in helping couples and families navigate difficult transitions and improve their relationships.',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
    address: '456 Healing Ave',
    city: 'New York',
    state: 'NY',
    zip: '10002',
    rating: 4.8,
    reviewsCount: 94,
    available: 1,
    verified: 1,
  },
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@therapy.com',
    phone: '+1 (555) 345-6789',
    licenseType: 'Licensed Clinical Social Worker',
    licenseNumber: 'LCSW11111',
    specialties: 'Anxiety, PTSD, Life Transitions',
    bio: 'Sarah brings a compassionate, trauma-informed approach to therapy, helping clients process difficult experiences and build resilience.',
    photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
    address: '789 Recovery Road',
    city: 'Brooklyn',
    state: 'NY',
    zip: '11201',
    rating: 4.7,
    reviewsCount: 82,
    available: 0,
    verified: 1,
  },
  {
    firstName: 'David',
    lastName: 'Park',
    email: 'david.park@therapy.com',
    phone: '+1 (555) 456-7890',
    licenseType: 'Psychiatrist',
    licenseNumber: 'MD22222',
    specialties: 'Medication Management, Bipolar, ADHD',
    bio: 'Dr. Park is a board-certified psychiatrist specializing in medication management for mood disorders and ADHD.',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
    address: '321 Mental Health Blvd',
    city: 'Manhattan',
    state: 'NY',
    zip: '10003',
    rating: 4.9,
    reviewsCount: 156,
    available: 1,
    verified: 1,
  },
  {
    firstName: 'Lisa',
    lastName: 'Martinez',
    email: 'lisa.martinez@therapy.com',
    phone: '+1 (555) 567-8901',
    licenseType: 'Licensed Professional Counselor',
    licenseNumber: 'LPC33333',
    specialties: 'Stress Management, Career Counseling, Self-Esteem',
    bio: 'Lisa helps professionals navigate career challenges while maintaining mental wellness and work-life balance.',
    photoUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop&crop=face',
    address: '555 Balance Street',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    rating: 4.6,
    reviewsCount: 68,
    available: 1,
    verified: 1,
  },
  {
    firstName: 'James',
    lastName: 'Thompson',
    email: 'james.thompson@therapy.com',
    phone: '+1 (555) 678-9012',
    licenseType: 'Licensed Clinical Psychologist',
    licenseNumber: 'PSY44444',
    specialties: 'OCD, Phobias, Panic Disorder',
    bio: 'Dr. Thompson is an expert in exposure therapy and CBT for anxiety disorders, with a special focus on OCD treatment.',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face',
    address: '777 Calm Way',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    rating: 4.8,
    reviewsCount: 112,
    available: 1,
    verified: 1,
  },
];

const insertTherapist = db.prepare(`
  INSERT INTO therapists (
    first_name, last_name, email, phone, license_type, license_number,
    specialties, bio, photo_url, address, city, state, zip, rating, reviews_count,
    available, verified
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const t of therapists) {
  insertTherapist.run(
    t.firstName, t.lastName, t.email, t.phone, t.licenseType, t.licenseNumber,
    t.specialties, t.bio, t.photoUrl || null, t.address, t.city, t.state, t.zip, t.rating,
    t.reviewsCount, t.available, t.verified
  );
}

console.log(`👨‍⚕️ Created ${therapists.length} therapists`);

// Seed stories
const stories = [
  {
    title: 'Finding Light in the Darkness: My Journey with Depression',
    content: `After years of struggling in silence, I finally found the courage to seek help. The first step was the hardest—admitting I needed support.

Depression had become my constant companion. Every morning felt like climbing a mountain just to get out of bed. The things I once loved—music, painting, spending time with friends—felt meaningless.

What changed for me was hitting rock bottom. I remember sitting in my car, unable to move, unable to cry, just... empty. That's when I knew something had to change.

Finding a therapist who understood me was transformative. She didn't judge my messy thoughts or my inability to articulate exactly what was wrong. She just listened, really listened, and helped me see patterns I'd never noticed before.

Recovery isn't linear. I still have bad days. But now I have tools—breathing exercises, journaling, medication that actually works for me. Most importantly, I have hope.

If you're reading this and struggling, please know: you're not broken. You're not weak. You're human, and reaching out for help is the bravest thing you can do.`,
    authorName: 'Anonymous',
    category: 'Depression',
    likes: 245,
  },
  {
    title: "Anxiety Doesn't Define Me Anymore",
    content: `Living with anxiety felt like being trapped in a never-ending storm. But with therapy, medication, and a strong support system, I found my calm.

For years, I thought everyone felt this way—the racing heart before social events, the sleepless nights replaying conversations, the constant what-ifs. I thought I was just "a worrier."

It wasn't until a panic attack sent me to the ER that I realized what I was dealing with. The doctor said my heart was fine, but my mind was on overdrive.

Starting medication was scary. I worried about side effects, about becoming "dependent," about what others would think. But my psychiatrist helped me understand that treating anxiety with medication is no different than treating any other medical condition.

The real game-changer was Cognitive Behavioral Therapy. Learning to identify and challenge my anxious thoughts gave me back control. I started keeping a worry journal, scheduling "worry time," and practicing exposure to things that scared me.

Today, I still have anxiety, but it no longer controls my life. I've learned to dance in the rain instead of waiting for the storm to pass.`,
    authorName: 'Sarah M.',
    category: 'Anxiety',
    likes: 189,
  },
  {
    title: 'The Power of Community in Mental Health Recovery',
    content: `I never knew how much connection could heal until I found others who understood what I was going through. Community changed everything.

Isolation had become my default mode. When you're struggling, it's easy to convince yourself that you're a burden, that nobody wants to hear your problems, that you should figure things out alone.

But humans aren't meant to heal in isolation. We're social creatures, wired for connection. When I finally joined a support group, I discovered I wasn't alone in my struggles.

Hearing others share their stories, their fears, their small victories—it normalized what I was going through. For the first time, I didn't feel like a freak. I felt understood.

The group taught me that vulnerability is strength, not weakness. Sharing my own story helped others feel less alone, and their support carried me through my darkest moments.

If you're hesitant about joining a support group, I get it. It's scary to open up to strangers. But these strangers might become your lifeline. They certainly became mine.

Today, I volunteer as a peer support facilitator. Giving back to the community that saved me has given my struggles meaning.`,
    authorName: 'James T.',
    category: 'Recovery',
    likes: 312,
  },
  {
    title: "Breaking the Stigma: A Father's Perspective",
    content: `As a man, I was taught to be strong and never show weakness. But mental health doesn't discriminate, and my breakdown taught me valuable lessons.

I had built my identity around being the provider, the protector, the rock for my family. Admitting I was struggling felt like admitting failure.

The breaking point came during a routine presentation at work. My hands started shaking, my vision blurred, and I couldn't catch my breath. I had to leave the room, and the shame was overwhelming.

My wife found me later, sitting in my car in the garage, unable to go inside and face our kids. She didn't lecture me about being strong. She held my hand and said, "It's okay to not be okay."

Those words broke something open in me. I started crying—really crying—for the first time in years. And in that release, I found the beginning of healing.

Getting help felt like learning a new language. I had to learn to identify emotions I'd been suppressing for decades. I had to learn that asking for help isn't weakness—it's wisdom.

Now I talk openly about my mental health journey with my sons. I want them to grow up knowing that real strength includes emotional honesty. Breaking the stigma starts at home.`,
    authorName: 'Michael R.',
    category: 'Personal Growth',
    likes: 423,
  },
  {
    title: 'My Battle with OCD: Learning to Live with Uncertainty',
    content: `OCD made me feel like a prisoner in my own mind. Every thought was a battle. Here's how I learned to make peace with uncertainty.

It started with hand-washing. Then checking locks. Then intrusive thoughts so disturbing I was convinced I was a terrible person. OCD convinced me that if I just performed one more ritual, I'd finally feel safe.

But the relief never lasted. The anxiety always came back, demanding more reassurance, more rituals, more time. At my worst, I was spending four hours a day on compulsions.

Finding a therapist who specialized in OCD was crucial. She introduced me to Exposure and Response Prevention (ERP), which sounded terrifying—purposely triggering my anxiety and not doing rituals? Impossible.

But it worked. Slowly, painfully, I learned that I could tolerate uncertainty. The thoughts didn't go away, but they lost their power over me.

The hardest part was accepting that I'd never have 100% certainty about anything. OCD wants guarantees that life can't provide. Learning to sit with "maybe" instead of needing "definitely not" was revolutionary.

I still have OCD. I probably always will. But I no longer let it run my life. I've learned that living fully means accepting uncertainty as part of the human experience.`,
    authorName: 'Emma L.',
    category: 'OCD',
    likes: 178,
  },
  {
    title: 'Healing After Loss: Grief and Moving Forward',
    content: `Losing my mother broke me in ways I never expected. The grief felt endless. But slowly, I learned that healing isn't about forgetting.

When mom passed, everyone told me she was "in a better place" and that "time heals all wounds." I know they meant well, but those words felt hollow against the weight of my loss.

Grief isn't linear. Some days I felt okay, even guilty for feeling okay. Other days, months after her death, the pain would hit fresh and raw, triggered by a song or a smell or just... nothing.

What helped was giving myself permission to grieve without a timeline. There's no "should" in grief—you feel what you feel, for as long as you need to feel it.

I started a journal where I write letters to my mom. I tell her about my day, ask for her advice, share things I never got to say. It sounds strange, but it helps me maintain our connection.

Grief therapy taught me that grief is really just love with nowhere to go. The pain is proportional to the love, and I wouldn't trade that love to avoid the pain.

My mother is still with me—in the values she instilled, the recipes she taught me, the way I now treat my own children. Healing doesn't mean forgetting; it means carrying our loved ones forward.`,
    authorName: 'Anonymous',
    category: 'Grief',
    likes: 534,
  },
  {
    title: 'From Burnout to Balance: A Healthcare Worker\'s Story',
    content: `The pandemic pushed me to my breaking point. As an ICU nurse, I was surrounded by death and suffering daily. I didn't realize I was drowning until I almost lost everything.

I used to pride myself on being able to handle anything. But month after month of watching patients die alone, of holding iPads for final goodbyes, of seeing colleagues break down—it took a toll I didn't acknowledge.

I started drinking to fall asleep. Then drinking to get through shifts. Then drinking just to feel something other than the numbness that had taken over.

My rock bottom came when I made a medication error. Thankfully, the patient was fine, but I knew I wasn't. I took medical leave and finally sought help.

Treatment for burnout as a healthcare worker is complicated. We're taught to put patients first, to be strong, to keep going no matter what. Admitting we need help feels like betraying our calling.

But you can't pour from an empty cup. Taking time to heal wasn't abandoning my patients—it was the only way I could eventually return to caring for them safely.

I'm back at work now, but with boundaries I never had before. I take my breaks, I see my therapist weekly, and I've found meaning in advocating for better mental health resources for healthcare workers.`,
    authorName: 'Jessica R.',
    category: 'Recovery',
    likes: 287,
  },
  {
    title: 'Living with Bipolar: The Highs and Lows',
    content: `Being diagnosed with bipolar disorder at 25 felt like a life sentence. But understanding my brain has actually set me free.

For years, I was told I was "just moody" or "too sensitive." The highs felt amazing—I'd barely sleep, start a dozen projects, feel invincible. The lows were devastating—weeks in bed, unable to see any point in anything.

My first manic episode was what finally got me diagnosed. I spent $10,000 I didn't have, quit my job to start a business I had no plan for, and alienated friends with my erratic behavior.

The crash that followed was the worst depression of my life. I'd destroyed so much during the high that the low felt hopeless.

Getting the right medication took time. Mood stabilizers felt like they were dulling my creativity, my spark. I went through several before finding one that controlled the extremes without making me feel like a zombie.

I've learned to track my moods religiously. I know my warning signs—sleeping less, talking faster, making grandiose plans—and I have a plan for when they appear.

Bipolar disorder is part of who I am, but it's not all of who I am. I've built a life with systems and supports that let me thrive. And yes, I still have creativity, joy, and passion—just without the destruction that used to follow.`,
    authorName: 'Alex K.',
    category: 'Personal Growth',
    likes: 198,
  },
];

const insertStory = db.prepare(`
  INSERT INTO stories (title, content, excerpt, author_name, category, likes)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const s of stories) {
  const excerpt = s.content.substring(0, 200) + '...';
  insertStory.run(s.title, s.content, excerpt, s.authorName, s.category, s.likes);
}

console.log(`📖 Created ${stories.length} stories`);

// Add some comments
const addComment = db.prepare(`
  INSERT INTO story_comments (story_id, author_name, content)
  VALUES (?, ?, ?)
`);

const comments = [
  { storyId: 1, author: 'hopeful_reader', content: 'Thank you for sharing this. I needed to read this today.' },
  { storyId: 1, author: 'Anonymous', content: 'Your words gave me courage to finally make that therapy appointment.' },
  { storyId: 2, author: 'anxiety_warrior', content: 'This is exactly my experience. So validating to read.' },
  { storyId: 3, author: 'finding_my_way', content: 'Community really is everything. Thank you for this reminder.' },
  { storyId: 4, author: 'proud_dad', content: 'As a fellow father, this hit home. Thank you for your vulnerability.' },
  { storyId: 6, author: 'still_grieving', content: 'The part about grief being love with nowhere to go made me cry. Beautiful.' },
];

for (const c of comments) {
  addComment.run(c.storyId, c.author, c.content);
}

console.log(`💬 Created ${comments.length} comments`);

console.log('\n✅ Database seeded successfully!');
console.log('\n📍 Run the server with: npm run dev');

