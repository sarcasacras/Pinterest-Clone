import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from './db.js';
import User from '../models/User.js';
import Pin from '../models/Pin.js';
import Board from '../models/Board.js';
import Comment from '../models/Comment.js';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Pin.deleteMany({});
    await Board.deleteMany({});
    await Comment.deleteMany({});

    // Hash passwords
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('password123', saltRounds);

    // Create Users
    const users = await User.create([
      {
        username: 'alice_art',
        displayName: 'Alice Johnson',
        email: 'alice@example.com',
        password: hashedPassword,
        avatar: 'https://picsum.photos/200/200?random=1'
      },
      {
        username: 'bob_photo',
        displayName: 'Bob Smith',
        email: 'bob@example.com',
        password: hashedPassword,
        avatar: 'https://picsum.photos/200/200?random=2'
      },
      {
        username: 'carol_design',
        displayName: 'Carol Williams',
        email: 'carol@example.com',
        password: hashedPassword,
        avatar: 'https://picsum.photos/200/200?random=3'
      },
      {
        username: 'david_nature',
        displayName: 'David Brown',
        email: 'david@example.com',
        password: hashedPassword,
        avatar: 'https://picsum.photos/200/200?random=4'
      }
    ]);

    // Create Boards
    const boards = await Board.create([
      {
        title: 'Art & Inspiration',
        description: 'Beautiful artwork and creative inspiration',
        owner: users[0]._id,
        coverImage: 'https://picsum.photos/400/300?random=10'
      },
      {
        title: 'Photography',
        description: 'Stunning photography from around the world',
        owner: users[1]._id,
        coverImage: 'https://picsum.photos/400/300?random=11'
      },
      {
        title: 'UI/UX Design',
        description: 'Modern design patterns and interfaces',
        owner: users[2]._id,
        coverImage: 'https://picsum.photos/400/300?random=12'
      },
      {
        title: 'Nature & Landscapes',
        description: 'Beautiful natural scenery',
        owner: users[3]._id,
        coverImage: 'https://picsum.photos/400/300?random=13'
      },
      {
        title: 'Abstract Art',
        description: 'Creative abstract compositions',
        owner: users[0]._id,
        isPrivate: true
      }
    ]);

    // Create Pins
    const pins = await Pin.create([
      {
        title: 'Sunset Painting',
        description: 'Beautiful sunset landscape painting with warm colors',
        imageUrl: 'https://picsum.photos/400/600?random=20',
        owner: users[0]._id,
        board: boards[0]._id,
        tags: ['art', 'painting', 'sunset', 'landscape']
      },
      {
        title: 'Mountain Photography',
        description: 'Breathtaking mountain view captured at golden hour',
        imageUrl: 'https://picsum.photos/400/600?random=21',
        owner: users[1]._id,
        board: boards[1]._id,
        tags: ['photography', 'mountains', 'nature']
      },
      {
        title: 'Modern UI Design',
        description: 'Clean and minimal user interface design concept',
        imageUrl: 'https://picsum.photos/400/600?random=22',
        owner: users[2]._id,
        board: boards[2]._id,
        tags: ['ui', 'design', 'minimal', 'modern']
      },
      {
        title: 'Forest Path',
        description: 'Peaceful forest path in autumn',
        imageUrl: 'https://picsum.photos/400/600?random=23',
        owner: users[3]._id,
        board: boards[3]._id,
        tags: ['nature', 'forest', 'autumn', 'path']
      },
      {
        title: 'Abstract Composition',
        description: 'Colorful abstract geometric composition',
        imageUrl: 'https://picsum.photos/400/600?random=24',
        owner: users[0]._id,
        board: boards[4]._id,
        tags: ['abstract', 'geometric', 'colorful']
      },
      {
        title: 'Ocean Waves',
        description: 'Powerful ocean waves crashing on rocks',
        imageUrl: 'https://picsum.photos/400/600?random=25',
        owner: users[1]._id,
        board: boards[1]._id,
        tags: ['ocean', 'waves', 'seascape']
      },
      {
        title: 'Mobile App Design',
        description: 'Elegant mobile app interface design',
        imageUrl: 'https://picsum.photos/400/600?random=26',
        owner: users[2]._id,
        board: boards[2]._id,
        tags: ['mobile', 'app', 'interface', 'design']
      },
      {
        title: 'Desert Landscape',
        description: 'Vast desert landscape with sand dunes',
        imageUrl: 'https://picsum.photos/400/600?random=27',
        owner: users[3]._id,
        board: boards[3]._id,
        tags: ['desert', 'landscape', 'dunes']
      }
    ]);

    // Add pins to boards
    await Board.findByIdAndUpdate(boards[0]._id, { $push: { pins: [pins[0]._id, pins[4]._id] } });
    await Board.findByIdAndUpdate(boards[1]._id, { $push: { pins: [pins[1]._id, pins[5]._id] } });
    await Board.findByIdAndUpdate(boards[2]._id, { $push: { pins: [pins[2]._id, pins[6]._id] } });
    await Board.findByIdAndUpdate(boards[3]._id, { $push: { pins: [pins[3]._id, pins[7]._id] } });
    await Board.findByIdAndUpdate(boards[4]._id, { $push: { pins: pins[4]._id } });

    // Create Comments
    const comments = await Comment.create([
      {
        content: 'This is absolutely gorgeous! Love the color palette.',
        author: users[1]._id,
        pin: pins[0]._id
      },
      {
        content: 'Amazing capture! The lighting is perfect.',
        author: users[2]._id,
        pin: pins[1]._id
      },
      {
        content: 'Such a clean and modern design. Very inspiring!',
        author: users[3]._id,
        pin: pins[2]._id
      },
      {
        content: 'This makes me want to go hiking right now!',
        author: users[0]._id,
        pin: pins[3]._id
      },
      {
        content: 'The composition is really well balanced.',
        author: users[1]._id,
        pin: pins[4]._id
      },
      {
        content: 'Nature at its finest. Beautiful shot!',
        author: users[2]._id,
        pin: pins[5]._id
      }
    ]);

    // Add comments to pins
    await Pin.findByIdAndUpdate(pins[0]._id, { $push: { comments: comments[0]._id } });
    await Pin.findByIdAndUpdate(pins[1]._id, { $push: { comments: comments[1]._id } });
    await Pin.findByIdAndUpdate(pins[2]._id, { $push: { comments: comments[2]._id } });
    await Pin.findByIdAndUpdate(pins[3]._id, { $push: { comments: comments[3]._id } });
    await Pin.findByIdAndUpdate(pins[4]._id, { $push: { comments: comments[4]._id } });
    await Pin.findByIdAndUpdate(pins[5]._id, { $push: { comments: comments[5]._id } });

    // Add some likes
    await Pin.findByIdAndUpdate(pins[0]._id, { $push: { likes: [users[1]._id, users[2]._id] } });
    await Pin.findByIdAndUpdate(pins[1]._id, { $push: { likes: [users[0]._id, users[3]._id] } });
    await Pin.findByIdAndUpdate(pins[2]._id, { $push: { likes: [users[1]._id, users[3]._id] } });

    // Add some followers/following relationships
    await User.findByIdAndUpdate(users[0]._id, { $push: { following: [users[1]._id, users[2]._id] } });
    await User.findByIdAndUpdate(users[1]._id, { $push: { followers: users[0]._id, following: users[3]._id } });
    await User.findByIdAndUpdate(users[2]._id, { $push: { followers: users[0]._id, following: users[3]._id } });
    await User.findByIdAndUpdate(users[3]._id, { $push: { followers: [users[1]._id, users[2]._id] } });

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${boards.length} boards`);
    console.log(`Created ${pins.length} pins`);
    console.log(`Created ${comments.length} comments`);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Run the seed function if this file is executed directly
const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed();
}

export default seedDatabase;