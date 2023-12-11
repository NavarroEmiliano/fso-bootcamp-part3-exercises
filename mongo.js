



if (process.argv.length <= 3) {
  Person.find({}).then((result) => {
    console.log("notebook:");
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const noteToSave = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  
  noteToSave.save().then((result) => {
    console.log(`added ${noteToSave.name} ${noteToSave.number} to phonebook`);
    mongoose.connection.close();
  });
}

