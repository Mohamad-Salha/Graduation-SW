const mongoose = require('./connection');
const bcrypt = require('bcrypt');

// Models
const User = require('./models/User');
const License = require('./models/License');
const Vehicle = require('./models/Vehicle');

async function seedDatabase() {
  try {
    // ---------------------------
    // 2. Licenses / Courses
    // ---------------------------
    const licenses = [
      { name: 'Light Vehicle', description: 'Car license', minPracticalSessions: 10, price: 500 },
      { name: 'Motorcycle', description: 'Motorcycle license', minPracticalSessions: 8, price: 300 }
    ];

    for (const lic of licenses) {
      const existingLicense = await License.findOne({ name: lic.name });
      if (!existingLicense) {
        await License.create(lic);
        console.log(`License created: ${lic.name}`);
      } else {
        console.log(`License already exists: ${lic.name}`);
      }
    }

    // ---------------------------
    // 3. Teachers
    // ---------------------------
    const teachers = [
      { name: 'Teacher One', email: 'teacher1@example.com', password: await bcrypt.hash('Teacher123!', 10), role: 'teacher' },
      { name: 'Teacher Two', email: 'teacher2@example.com', password: await bcrypt.hash('Teacher123!', 10), role: 'teacher' }
    ];

    for (const t of teachers) {
      const existingTeacher = await User.findOne({ email: t.email });
      if (!existingTeacher) {
        await User.create(t);
        console.log(`Teacher created: ${t.name}`);
      } else {
        console.log(`Teacher already exists: ${t.name}`);
      }
    }

    // ---------------------------
    // 4. Trainers
    // ---------------------------
    const trainers = [
      { name: 'Trainer One', email: 'trainer1@example.com', password: await bcrypt.hash('Trainer123!', 10), role: 'trainer' },
      { name: 'Trainer Two', email: 'trainer2@example.com', password: await bcrypt.hash('Trainer123!', 10), role: 'trainer' }
    ];

    for (const tr of trainers) {
      const existingTrainer = await User.findOne({ email: tr.email });
      if (!existingTrainer) {
        await User.create(tr);
        console.log(`Trainer created: ${tr.name}`);
      } else {
        console.log(`Trainer already exists: ${tr.name}`);
      }
    }

    // ---------------------------
    // 5. Vehicles (assigned to trainers)
    // ---------------------------
    const trainerDocs = await User.find({ role: 'trainer' });
    const vehicles = [
      { plateNumber: 'CAR101', type: 'Car', assignedTrainer: trainerDocs[0]._id },
      { plateNumber: 'CAR102', type: 'Car', assignedTrainer: trainerDocs[1]._id }
    ];

    for (const v of vehicles) {
      const existingVehicle = await Vehicle.findOne({ plateNumber: v.plateNumber });
      if (!existingVehicle) {
        await Vehicle.create(v);
        console.log(`Vehicle created: ${v.plateNumber}`);
      } else {
        console.log(`Vehicle already exists: ${v.plateNumber}`);
      }
    }

    console.log('Database seeding completed!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();
