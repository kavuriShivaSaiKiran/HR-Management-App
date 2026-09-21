// Authentic, localized name repositories aligned with country hubs
// US (United States), GB (United Kingdom), DE (Germany), IN (India), SG (Singapore)

export interface CountryNameData {
  firstNames: string[];
  lastNames: string[];
}

export const COUNTRY_NAMES: Record<string, CountryNameData> = {
  US: {
    firstNames: [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
      'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
      'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan',
      'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
      'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Frank', 'Patrick', 'Raymond', 'Jack', 'Dennis', 'Jerry',
      'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan', 'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle',
      'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
      'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
      'Carol', 'Amanda', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia', 'Kathleen',
      'Amy', 'Angela', 'Shirley', 'Anna', 'Brenda', 'Pamela', 'Emma', 'Nicole', 'Helen', 'Samantha',
      'Katherine', 'Christine', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Catherine', 'Maria', 'Heather', 'Diane',
      'Ruth', 'Julie', 'Olivia', 'Joyce', 'Virginia', 'Victoria', 'Kelly', 'Lauren', 'Christina', 'Joan',
      'Evelyn', 'Judith', 'Megan', 'Andrea', 'Cheryl', 'Hannah', 'Jacqueline', 'Martha', 'Gloria', 'Teresa',
      'Ann', 'Sara', 'Madison', 'Frances', 'Kathryn', 'Janice', 'Jean', 'Abigail', 'Alice', 'Julia',
      'Judy', 'Sophia', 'Grace', 'Denise', 'Amber', 'Doris', 'Marilyn', 'Danielle', 'Beverly', 'Diana',
      'Brittany', 'Natalie', 'Jane', 'Harper', 'Avery', 'Chloe', 'Ella', 'Morgan', 'Savannah', 'Brooklyn'
    ],
    lastNames: [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
      'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
      'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
      'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
      'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
      'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
      'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
      'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
      'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
      'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'
    ]
  },
  GB: {
    firstNames: [
      'Oliver', 'George', 'Harry', 'Jack', 'Noah', 'Charlie', 'Jacob', 'Alfie', 'Freddie', 'Oscar',
      'Leo', 'Arthur', 'Archie', 'Thomas', 'Henry', 'Logan', 'Edward', 'Joshua', 'James', 'William',
      'Lucas', 'Ethan', 'Max', 'Isaac', 'Theo', 'Samuel', 'Harrison', 'Finley', 'Teddy', 'Toby',
      'Sebastian', 'Dylan', 'Elijah', 'Reuben', 'Caleb', 'Nathan', 'Gabriel', 'Elliot', 'Luke', 'Jude',
      'Rory', 'Callum', 'Hamish', 'Fraser', 'Angus', 'Ewan', 'Cameron', 'Alastair', 'Douglas', 'Declan',
      'Kieran', 'Rhys', 'Gareth', 'Lewis', 'Craig', 'Scott', 'Malcolm', 'Duncan', 'Niall', 'Blair',
      'Olivia', 'Amelia', 'Isla', 'Ava', 'Emily', 'Isabella', 'Mia', 'Poppy', 'Ella', 'Lily',
      'Grace', 'Evie', 'Sophia', 'Freya', 'Daisy', 'Charlotte', 'Florence', 'Phoebe', 'Alice', 'Sienna',
      'Ruby', 'Sophie', 'Ivy', 'Willow', 'Evelyn', 'Harper', 'Matilda', 'Chloe', 'Rosie', 'Scarlett',
      'Jessica', 'Maya', 'Eleanor', 'Erin', 'Imogen', 'Maisie', 'Georgia', 'Eliza', 'Beatrice', 'Harriet',
      'Clara', 'Gemma', 'Fiona', 'Catriona', 'Kirsty', 'Rhona', 'Morag', 'Eilidh', 'Megan', 'Sian',
      'Carys', 'Bethan', 'Bronwen', 'Lowri', 'Ffion', 'Seren', 'Catrin', 'Nia', 'Rhiannon', 'Anwen',
      'Alys', 'Elin', 'Gwen', 'Cerys', 'Aileen', 'Iona', 'Mhairi', 'Shona', 'Skye', 'Lorna'
    ],
    lastNames: [
      'Smith', 'Jones', 'Taylor', 'Brown', 'Williams', 'Wilson', 'Johnson', 'Davies', 'Robinson', 'Wright',
      'Thompson', 'Evans', 'Walker', 'White', 'Roberts', 'Green', 'Hall', 'Thomas', 'Clarke', 'Wood',
      'Jackson', 'Clark', 'Turner', 'Hill', 'Scott', 'Cooper', 'Morris', 'Ward', 'Watson', 'Moore',
      'King', 'Baker', 'Harrison', 'Morgan', 'Edwards', 'Young', 'Allen', 'Mitchell', 'Phillips', 'James',
      'Campbell', 'Anderson', 'Stewart', 'Hughes', 'Bell', 'Bailey', 'Parker', 'Miller', 'Davis', 'Murphy',
      'Price', 'Bennett', 'Barnes', 'Ross', 'Henderson', 'Murray', 'Hamilton', 'Graham', 'Fraser', 'MacDonald',
      'Morrison', 'Crawford', 'Griffiths', 'Bevan', 'Lloyd', 'Jenkins', 'Vaughan', 'Powell', 'Owen', 'Hopkins',
      'Bowen', 'Pugh', 'Rees', 'Llewellyn', 'MacLeod', 'MacLean', 'Robertson', 'Thomson', 'Ferguson', 'McIntosh',
      'Sinclair', 'Sutherland', 'Munro', 'Cameron', 'Forbes', 'Johnston', 'Mackay', 'Wallace', 'Gibson', 'Christie'
    ]
  },
  DE: {
    firstNames: [
      'Maximilian', 'Alexander', 'Lukas', 'Leon', 'Paul', 'Jonas', 'Felix', 'Elias', 'David', 'Tim',
      'Niklas', 'Finn', 'Luca', 'Julian', 'Philipp', 'Luis', 'Noah', 'Ben', 'Erik', 'Jan',
      'Moritz', 'Simon', 'Florian', 'Tom', 'Fabian', 'Sebastian', 'Daniel', 'Tobias', 'Johannes', 'Christian',
      'Marcel', 'Kevin', 'Patrick', 'Stefan', 'Marco', 'Sven', 'Dennis', 'Michael', 'Andreas', 'Martin',
      'Markus', 'Thomas', 'Steffen', 'Jens', 'Oliver', 'Matthias', 'Frank', 'Jürgen', 'Uwe', 'Carsten',
      'Dirk', 'Thorsten', 'Holger', 'Ralf', 'Bernd', 'Wolfgang', 'Klaus', 'Dieter', 'Manfred', 'Hans',
      'Sophie', 'Marie', 'Maria', 'Emma', 'Mia', 'Hannah', 'Anna', 'Emilia', 'Lea', 'Lina',
      'Lena', 'Mila', 'Clara', 'Luisa', 'Laura', 'Nele', 'Lara', 'Sarah', 'Johanna', 'Leni',
      'Julia', 'Lisa', 'Katharina', 'Nadine', 'Melanie', 'Stefanie', 'Christina', 'Tanja', 'Nicole', 'Sabrina',
      'Vanessa', 'Sandra', 'Daniela', 'Jessica', 'Jennifer', 'Katrin', 'Anja', 'Andrea', 'Claudia', 'Petra',
      'Susanne', 'Sabine', 'Birgit', 'Monika', 'Karin', 'Renate', 'Helga', 'Ursula', 'Gisela', 'Ingrid',
      'Erika', 'Christa', 'Elke', 'Marion', 'Angelika', 'Gabriele', 'Brigitte', 'Heike', 'Ute', 'Martina'
    ],
    lastNames: [
      'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
      'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann',
      'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
      'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber',
      'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Möller', 'Weiß', 'Jung', 'Hahn', 'Schubert',
      'Vogel', 'Friedrich', 'Keller', 'Günther', 'Frank', 'Berger', 'Winkler', 'Roth', 'Beck', 'Lorenz',
      'Baumann', 'Franke', 'Albrecht', 'Schuster', 'Simon', 'Ludwig', 'Böhm', 'Winter', 'Krauß', 'Schumacher',
      'Krämer', 'Vogt', 'Stein', 'Jäger', 'Otto', 'Sommer', 'Groß', 'Seidel', 'Heinrich', 'Brandt',
      'Haas', 'Schreiber', 'Graf', 'Schulte', 'Dietrich', 'Ziegler', 'Kuhn', 'Kühn', 'Pohl', 'Engel'
    ]
  },
  IN: {
    firstNames: [
      'Aarav', 'Vihaan', 'Vivaan', 'Advik', 'Kabir', 'Reyansh', 'Atharv', 'Aayush', 'Ishaan', 'Dhruv',
      'Samarth', 'Shaurya', 'Aryan', 'Rudra', 'Ayaan', 'Krishna', 'Sai', 'Arjun', 'Rajesh', 'Suresh',
      'Ramesh', 'Mahesh', 'Ganesh', 'Dinesh', 'Naresh', 'Mukesh', 'Sanjay', 'Ajay', 'Vijay', 'Manoj',
      'Vinod', 'Ashok', 'Sunil', 'Anil', 'Alok', 'Amit', 'Sumit', 'Rahul', 'Rohit', 'Sachin',
      'Gaurav', 'Saurabh', 'Vikas', 'Vishal', 'Manish', 'Nitish', 'Deepak', 'Sandeep', 'Pradeep', 'Kuldeep',
      'Naveen', 'Praveen', 'Pankaj', 'Chetan', 'Harish', 'Girish', 'Satish', 'Jagdish', 'Lokesh', 'Bhavesh',
      'Rakesh', 'Umesh', 'Yogesh', 'Hemant', 'Prashant', 'Nishant', 'Rohan', 'Vikram', 'Siddharth', 'Aditya',
      'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Pari', 'Kiara', 'Myra', 'Riya', 'Riddhi', 'Sneha',
      'Neha', 'Pooja', 'Priya', 'Shruti', 'Swati', 'Divya', 'Shreya', 'Deepa', 'Meera', 'Sunita',
      'Rekha', 'Anita', 'Geeta', 'Kavya', 'Avani', 'Siya', 'Prisha', 'Anika', 'Ira', 'Tanvi',
      'Ishita', 'Trisha', 'Tara', 'Sanya', 'Rhea', 'Nitya', 'Aditi', 'Vidya', 'Malini', 'Bhavna',
      'Rashmi', 'Jyoti', 'Vandana', 'Preeti', 'Payal', 'Komal', 'Shilpa', 'Poonam', 'Archana', 'Manisha',
      'Seema', 'Sangeeta', 'Radha', 'Lakshmi', 'Parvati', 'Shanti', 'Uma', 'Durga', 'Kalyani', 'Meenakshi'
    ],
    lastNames: [
      'Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Kumar', 'Mishra', 'Joshi', 'Yadav', 'Shah',
      'Rao', 'Reddy', 'Nair', 'Pillai', 'Iyer', 'Iyengar', 'Bhattacharya', 'Chatterjee', 'Banerjee', 'Mukherjee',
      'Sen', 'Ghosh', 'Das', 'Dutta', 'Bose', 'Roy', 'Sengupta', 'Choudhury', 'Majumdar', 'Chakraborty',
      'Nambiar', 'Menon', 'Kurup', 'Shetty', 'Hegde', 'Rai', 'Shenoy', 'Kamath', 'Pai', 'Bhat',
      'Kulkarni', 'Deshmukh', 'Patil', 'Shinde', 'Pawar', 'Gaikwad', 'Chavan', 'Kadam', 'Jadhav', 'Bhosale',
      'Mehta', 'Trivedi', 'Pandya', 'Dave', 'Shukla', 'Tiwari', 'Dubey', 'Pandey', 'Upadhyay', 'Tripathi',
      'Agarwal', 'Mittal', 'Bansal', 'Goyal', 'Singhal', 'Garg', 'Jindal', 'Goel', 'Jain', 'Saxena',
      'Mathur', 'Srivastava', 'Bhatnagar', 'Nigam', 'Prasad', 'Sinha', 'Kapoor', 'Khanna', 'Chopra', 'Malhotra',
      'Sethi', 'Anand', 'Ahuja', 'Grover', 'Batra', 'Chawla', 'Taneja', 'Bhasin', 'Bajaj', 'Dewan'
    ]
  },
  SG: {
    firstNames: [
      // Chinese Singaporean
      'Wei Ming', 'Zhi Hao', 'Jun Jie', 'Kai Le', 'Wei Lun', 'Zi Rui', 'Jian Hao', 'Zhi Wei', 'Ming Hui', 'Xiao Wei',
      'Yan Ting', 'Hui Min', 'Jia En', 'Xin Yi', 'Shu Ting', 'Yu Xuan', 'Zhi Ying', 'Pei Shan', 'Darren', 'Ryan',
      'Megan', 'Brandon', 'Chloe', 'Justin', 'Nicole', 'Dylan', 'Rachel', 'Marcus', 'Stephanie', 'Jason',
      'Vanessa', 'Bryan', 'Fiona', 'Aaron', 'Melissa', 'Kevin', 'Amanda', 'Gabriel', 'Grace', 'Lucas',
      'Cheryl', 'Keith', 'Jeremy', 'Shawn', 'Derek', 'Sean', 'Kenneth', 'Daryl', 'Eugene', 'Colin',
      // Malay Singaporean
      'Muhammad Farhan', 'Danial', 'Haziq', 'Amirul', 'Khairul', 'Nabil', 'Aiman', 'Irfan', 'Rahmat', 'Iskandar',
      'Siti Nurul', 'Fatin', 'Nadia', 'Farah', 'Natasha', 'Sabrina', 'Zulaikha', 'Nuraisha', 'Atiqah', 'Nur Aisyah',
      // Indian Singaporean
      'Suresh', 'Rajesh', 'Deepa', 'Priya', 'Anand', 'Harish', 'Sanjay', 'Vikram', 'Kavita', 'Shanti',
      'Meena', 'Prakash', 'Ravi', 'Senthil', 'Vignesh', 'Prema', 'Karthik', 'Mohan', 'Vasanth', 'Geetha',
      // Eurasian Singaporean
      'Dominic', 'Sarah', 'Samantha', 'Claire', 'Julian', 'Christopher', 'Alyssa', 'Gemma', 'Tristan', 'Nicole'
    ],
    lastNames: [
      // Singapore Chinese Surnames
      'Tan', 'Lim', 'Lee', 'Ng', 'Ong', 'Wong', 'Goh', 'Chua', 'Chan', 'Koh',
      'Teo', 'Ang', 'Yeo', 'Tay', 'Ho', 'Low', 'Toh', 'Sim', 'Chia', 'Seow',
      'Quek', 'Lau', 'Loo', 'Cheong', 'Foo', 'Fong', 'Kwek', 'Neo', 'Pang', 'Soon',
      'Tang', 'Wee', 'Yap', 'Yong', 'Chung', 'Leong', 'Liang', 'Heng', 'Khoo', 'Kwok',
      // Singapore Malay Patronomics / Surnames
      'bin Ismail', 'bin Rosli', 'bin Osman', 'bin Yusof', 'bin Ibrahim', 'bin Hassan', 'bin Abdullah',
      'binte Ahmad', 'binte Ali', 'binte Razak', 'binte Rahim', 'binte Hashim', 'binte Rahman', 'binte Othman',
      // Singapore Indian Surnames
      'Pillai', 'Raman', 'Krishnan', 'Nair', 'Raj', 'Menon', 'Govindasamy', 'Shanmugam', 'Subramaniam', 'Balakrishnan',
      'Murugan', 'Jayaraman', 'Chandran', 'Sundaram', 'Muthusamy', 'Arumugam',
      // Singapore Eurasian Surnames
      'De Souza', 'Pereira', 'Hendricks', 'Conceicao', 'D\'Aranjo', 'Rozario', 'Danker', 'Minjoot', 'Van Huizen'
    ]
  }
};

// Transliterate / sanitize accents and special characters for clean RFC-compliant corporate emails
export function sanitizeForEmail(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/['’]/g, '')
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function generateCountryAlignedName(countryCode: string, id: number): { firstName: string; lastName: string; email: string } {
  const data = COUNTRY_NAMES[countryCode] || COUNTRY_NAMES.US;
  
  // Use id-based deterministic spreading mixed with pseudo-randomness
  const fnIdx = (id * 17 + Math.floor(Math.random() * 5)) % data.firstNames.length;
  const lnIdx = (id * 31 + Math.floor(Math.random() * 7)) % data.lastNames.length;

  const firstName = data.firstNames[fnIdx];
  const lastName = data.lastNames[lnIdx];

  const cleanFirst = sanitizeForEmail(firstName);
  const cleanLast = sanitizeForEmail(lastName);
  const email = `${cleanFirst}.${cleanLast}.${id}@acme.org`;

  return { firstName, lastName, email };
}
