import mongoose from "mongoose";
import bcrypt from "bcrypt";
import connectDB from "./db.js";
import User from "../models/User.js";
import Pin from "../models/Pin.js";
import Board from "../models/Board.js";
import Comment from "../models/Comment.js";

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    await User.deleteMany({});
    await Pin.deleteMany({});
    await Board.deleteMany({});
    await Comment.deleteMany({});

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash("password123", saltRounds);

    const users = await User.create([
      {
        username: "alice_art",
        displayName: "Alice Johnson",
        email: "alice@example.com",
        password: hashedPassword,
        avatar: "general/noavatar.svg",
      },
      {
        username: "bob_photo",
        displayName: "Bob Smith",
        email: "bob@example.com",
        password: hashedPassword,
        avatar: "general/noavatar.svg",
      },
      {
        username: "carol_design",
        displayName: "Carol Williams",
        email: "carol@example.com",
        password: hashedPassword,
        avatar: "general/noavatar.svg",
      },
      {
        username: "david_nature",
        displayName: "David Brown",
        email: "david@example.com",
        password: hashedPassword,
        avatar: "general/noavatar.svg",
      },
    ]);

    const boards = await Board.create([
      {
        title: "Art & Inspiration",
        description: "Beautiful artwork and creative inspiration",
        owner: users[0]._id,
        coverImage: "/pins/pin1.jpg",
      },
      {
        title: "Photography",
        description: "Stunning photography from around the world",
        owner: users[1]._id,
        coverImage: "/pins/pin5.jpg",
      },
      {
        title: "UI/UX Design",
        description: "Modern design patterns and interfaces",
        owner: users[2]._id,
        coverImage: "/pins/pin10.jpg",
      },
      {
        title: "Nature & Landscapes",
        description: "Beautiful natural scenery",
        owner: users[3]._id,
        coverImage: "/pins/pin15.jpg",
      },
      {
        title: "Abstract Art",
        description: "Creative abstract compositions",
        owner: users[0]._id,
        isPrivate: true,
      },
    ]);

    const pinTitles = [
      "Sunset Painting",
      "Mountain Photography",
      "Modern UI Design",
      "Forest Path",
      "Abstract Composition",
      "Ocean Waves",
      "Mobile App Design",
      "Desert Landscape",
      "City Skyline",
      "Flower Garden",
      "Vintage Car",
      "Space Galaxy",
      "Coffee Art",
      "Beach Paradise",
      "Winter Forest",
      "Street Art",
      "Architecture Study",
      "Food Photography",
      "Music Festival",
      "Travel Journal",
      "Minimal Design",
      "Portrait Art",
      "Nature Macro",
      "Urban Style",
      "Digital Art",
      "Landscape View",
      "Fashion Design",
      "Art Installation",
      "Product Design",
      "Creative Illustration",
      "Photography Series",
      "Visual Arts",
      "Modern Architecture",
      "Nature Photography",
      "Abstract Painting",
      "Design Concept",
      "Artistic Expression",
      "Creative Process",
      "Visual Storytelling",
      "Design Inspiration",
    ];

    const descriptions = [
      "Beautiful and inspiring visual content",
      "Creative design with modern aesthetics",
      "Stunning photography captured perfectly",
      "Artistic expression at its finest",
      "Innovative design concept and execution",
      "Natural beauty in perfect composition",
      "Contemporary art with unique perspective",
      "Professional photography with great lighting",
    ];

    const tagSets = [
      ["art", "painting", "creative"],
      ["photography", "nature", "landscape"],
      ["design", "ui", "modern"],
      ["abstract", "colorful", "artistic"],
      ["minimal", "clean", "simple"],
      ["vintage", "retro", "classic"],
      ["urban", "city", "architecture"],
      ["nature", "outdoor", "peaceful"],
    ];

    const imageKitPins = [
      { file: "pin1.jpg", width: 400, height: 600 },
      { file: "pin2.jpg", width: 400, height: 500 },
      { file: "pin3.jpg", width: 400, height: 700 },
      { file: "pin4.jpg", width: 400, height: 550 },
      { file: "pin5.jpg", width: 400, height: 650 },
      { file: "pin6.jpg", width: 400, height: 580 },
      { file: "pin7.jpg", width: 400, height: 620 },
      { file: "pin8.jpg", width: 400, height: 540 },
      { file: "pin9.jpg", width: 400, height: 670 },
      { file: "pin10.jpg", width: 400, height: 600 },
      { file: "pin11.jpg", width: 400, height: 590 },
      { file: "pin12.jpg", width: 400, height: 610 },
      { file: "pin13.jpg", width: 400, height: 630 },
      { file: "pin14.jpg", width: 400, height: 570 },
      { file: "pin15.jpg", width: 400, height: 640 },
      { file: "pin16.jpg", width: 400, height: 560 },
      { file: "pin17.jpg", width: 400, height: 680 },
      { file: "pin18.jpg", width: 400, height: 520 },
      { file: "pin19.jpg", width: 400, height: 660 },
      { file: "pin20.jpg", width: 400, height: 600 },
      { file: "pin21.jpg", width: 400, height: 580 },
      { file: "pin22.jpg", width: 400, height: 620 },
      { file: "pin23.jpg", width: 400, height: 590 },
      { file: "pin24.jpg", width: 400, height: 610 },
      { file: "pin25.jpg", width: 400, height: 570 },
    ];

    const pinPromises = [];

    for (let i = 0; i < 40; i++) {
      const imageIndex = i % imageKitPins.length;
      const imageData = imageKitPins[imageIndex];

      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomBoard = boards[Math.floor(Math.random() * boards.length)];
      const randomTags = tagSets[Math.floor(Math.random() * tagSets.length)];
      const randomDescription =
        descriptions[Math.floor(Math.random() * descriptions.length)];

      pinPromises.push({
        title: pinTitles[i] || `Pin ${i + 1}`,
        description: randomDescription,
        imageUrl: `/pins/${imageData.file}`,
        width: imageData.width,
        height: imageData.height,
        owner: randomUser._id,
        board: randomBoard._id,
        tags: randomTags,
      });
    }

    const pins = await Pin.create(pinPromises);

    await Board.findByIdAndUpdate(boards[0]._id, {
      $push: { pins: [pins[0]._id, pins[4]._id] },
    });
    await Board.findByIdAndUpdate(boards[1]._id, {
      $push: { pins: [pins[1]._id, pins[5]._id] },
    });
    await Board.findByIdAndUpdate(boards[2]._id, {
      $push: { pins: [pins[2]._id, pins[6]._id] },
    });
    await Board.findByIdAndUpdate(boards[3]._id, {
      $push: { pins: [pins[3]._id, pins[7]._id] },
    });
    await Board.findByIdAndUpdate(boards[4]._id, {
      $push: { pins: pins[4]._id },
    });

    const comments = await Comment.create([
      {
        content: "This is absolutely gorgeous! Love the color palette.",
        author: users[1]._id,
        pin: pins[0]._id,
      },
      {
        content: "Amazing capture! The lighting is perfect.",
        author: users[2]._id,
        pin: pins[1]._id,
      },
      {
        content: "Such a clean and modern design. Very inspiring!",
        author: users[3]._id,
        pin: pins[2]._id,
      },
      {
        content: "This makes me want to go hiking right now!",
        author: users[0]._id,
        pin: pins[3]._id,
      },
      {
        content: "The composition is really well balanced.",
        author: users[1]._id,
        pin: pins[4]._id,
      },
      {
        content: "Nature at its finest. Beautiful shot!",
        author: users[2]._id,
        pin: pins[5]._id,
      },
    ]);

    await Pin.findByIdAndUpdate(pins[0]._id, {
      $push: { comments: comments[0]._id },
    });
    await Pin.findByIdAndUpdate(pins[1]._id, {
      $push: { comments: comments[1]._id },
    });
    await Pin.findByIdAndUpdate(pins[2]._id, {
      $push: { comments: comments[2]._id },
    });
    await Pin.findByIdAndUpdate(pins[3]._id, {
      $push: { comments: comments[3]._id },
    });
    await Pin.findByIdAndUpdate(pins[4]._id, {
      $push: { comments: comments[4]._id },
    });
    await Pin.findByIdAndUpdate(pins[5]._id, {
      $push: { comments: comments[5]._id },
    });

    await Pin.findByIdAndUpdate(pins[0]._id, {
      $push: { likes: [users[1]._id, users[2]._id] },
    });
    await Pin.findByIdAndUpdate(pins[1]._id, {
      $push: { likes: [users[0]._id, users[3]._id] },
    });
    await Pin.findByIdAndUpdate(pins[2]._id, {
      $push: { likes: [users[1]._id, users[3]._id] },
    });

    await User.findByIdAndUpdate(users[0]._id, {
      $push: { following: [users[1]._id, users[2]._id] },
    });
    await User.findByIdAndUpdate(users[1]._id, {
      $push: { followers: users[0]._id, following: users[3]._id },
    });
    await User.findByIdAndUpdate(users[2]._id, {
      $push: { followers: users[0]._id, following: users[3]._id },
    });
    await User.findByIdAndUpdate(users[3]._id, {
      $push: { followers: [users[1]._id, users[2]._id] },
    });

    console.log("Database seeded successfully!");
    console.log(`Created ${users.length} users`);
    console.log(`Created ${boards.length} boards`);
    console.log(`Created ${pins.length} pins`);
    console.log(`Created ${comments.length} comments`);
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed();
}

export default seedDatabase;
