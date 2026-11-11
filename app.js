/* =========================================================
   PATHFINDER - interest assessments + course/career explorer
   No server required for the sample version.
   Parent/student pairing works by sharing a small score code.
   ========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   INTEREST AREAS
   ========================================================= */

const DOMAINS = {
  teaching: {
    name: "Teaching & Learning",
    icon: "📚",
    summary: "You may enjoy explaining ideas, guiding others, tutoring, and helping people learn.",
    careers: ["Teacher", "Tutor", "Learning Facilitator", "Instructional Material Developer"],
    courses: ["beed", "bece", "bsed-english", "bsed-filipino", "bsed-social", "bsed-math", "bsed-science", "bped", "communication", "english-studies"],
    tracks: ["HUMSS", "GAS", "SPORTS"],
    next: "Try explaining a topic to someone, helping with a study group, or creating a simple learning guide. Notice whether you enjoy the preparation as much as the teaching."
  },
  technology: {
    name: "Technology & Problem-Solving",
    icon: "💻",
    summary: "You may enjoy computers, digital tools, logical challenges, systems, and finding technical solutions.",
    careers: ["Software Developer", "IT Support Specialist", "Network Administrator", "Systems Analyst"],
    courses: ["it-network", "it-web", "it-service", "is-analytics", "computer-science", "electrical-engineering", "electronics-engineering"],
    tracks: ["STEM", "TVL"],
    next: "Try a beginner coding activity, build a small website, troubleshoot a device, or explore how networks and applications work."
  },
  science: {
    name: "Science, Health & Investigation",
    icon: "🔬",
    summary: "You may enjoy asking questions, investigating how things work, understanding health or nature, and using evidence.",
    careers: ["Research Assistant", "Nurse", "Laboratory Analyst", "Environmental Scientist"],
    courses: ["chemistry", "nursing", "environmental-science", "mathematics", "food-technology", "civil-engineering", "mechanical-engineering"],
    tracks: ["STEM", "SPORTS"],
    next: "Explore a science topic, observe a natural process, read about health or the environment, or try a simple safe investigation."
  },
  business: {
    name: "Business, Leadership & Organization",
    icon: "📈",
    summary: "You may enjoy planning, organizing people or projects, making decisions, handling money, and developing ideas into something useful.",
    careers: ["Entrepreneur", "Accountant", "Marketing Specialist", "Business Analyst"],
    courses: ["accountancy", "accounting-is", "entrepreneurship", "hospitality", "business-economics", "financial-management", "marketing-management", "public-administration"],
    tracks: ["ABM", "GAS"],
    next: "Try planning a small event or project, making a simple budget, or thinking of a product or service that could help people."
  },
  creative: {
    name: "Arts, Design & Communication",
    icon: "🎨",
    summary: "You may enjoy creating visuals, expressing ideas, writing, storytelling, designing, or communicating messages.",
    careers: ["Graphic Designer", "Writer", "Content Creator", "Art Director"],
    courses: ["visual-communication", "architecture", "communication", "english-studies"],
    tracks: ["ARTS-DESIGN", "HUMSS", "GAS", "STEM"],
    next: "Create a poster, write a short piece, edit a video, design a layout, or build a small portfolio of work you enjoy."
  },
  community: {
    name: "People, Society & Public Service",
    icon: "🤝",
    summary: "You may enjoy understanding people and communities, listening, communicating, helping others, and learning about society.",
    careers: ["Community Worker", "Psychology Assistant", "Public Administration Officer", "Communication Specialist"],
    courses: ["communication", "english-studies", "psychology", "human-services", "bsed-social", "public-administration", "criminology"],
    tracks: ["HUMSS", "GAS"],
    next: "Join a community activity, interview someone about their work, read about a social issue, or help organize a school or community project."
  },
  handsOn: {
    name: "Practical, Technical & Hands-on Work",
    icon: "🛠️",
    summary: "You may enjoy building, fixing, preparing, assembling, operating tools, and learning through practical activities.",
    careers: ["Automotive Technician", "Electrical Technician", "Mechatronics Technician", "Technical Trainer"],
    courses: ["automotive-technology", "electrical-technology", "mechatronics", "btled-industrial", "btvted-food", "civil-engineering", "mechanical-engineering"],
    tracks: ["TVL", "STEM"],
    next: "Try a supervised hands-on project, learn a practical skill, or observe how a product or machine is made and maintained."
  },
  sports: {
    name: "Sports, Movement & Fitness",
    icon: "🏃",
    summary: "You may enjoy physical activities, sports, fitness, teamwork, movement, and helping others become active.",
    careers: ["Physical Education Teacher", "Sports Coordinator", "Fitness Instructor", "Coach"],
    courses: ["bped", "beed", "bsed-social", "nursing"],
    tracks: ["SPORTS", "HUMSS", "GAS"],
    next: "Try helping organize a sports activity, learning basic coaching skills, or exploring how fitness and health connect."
  }
};

/* Each activity is a clue, not a test question with a right answer. */
const ACTIVITIES = [
  { id: "teach1", domain: "teaching", title: "I enjoy explaining lessons or helping classmates understand a topic.", detail: "Teaching, tutoring, and guiding others" },
  { id: "teach2", domain: "teaching", title: "I like presenting ideas, demonstrating steps, or leading a learning activity.", detail: "Presenting and facilitating" },
  { id: "teach3", domain: "teaching", title: "I enjoy making notes, reviewers, or materials that help others learn.", detail: "Creating learning resources" },

  { id: "tech1", domain: "technology", title: "I enjoy using computers, applications, or other digital tools.", detail: "Working with technology" },
  { id: "tech2", domain: "technology", title: "I like solving logic problems or figuring out why a device or system is not working.", detail: "Troubleshooting and logical thinking" },
  { id: "tech3", domain: "technology", title: "I am curious about coding, websites, mobile apps, or computer networks.", detail: "Learning how digital systems work" },

  { id: "science1", domain: "science", title: "I enjoy asking questions, doing safe experiments, or investigating how things work.", detail: "Research and investigation" },
  { id: "science2", domain: "science", title: "I am interested in health, the human body, caring, or helping people stay well.", detail: "Health and care" },
  { id: "science3", domain: "science", title: "I enjoy learning about nature, the environment, numbers, or scientific information.", detail: "Science and evidence" },

  { id: "business1", domain: "business", title: "I like organizing projects, making plans, or coordinating a group.", detail: "Planning and organization" },
  { id: "business2", domain: "business", title: "I am interested in selling, budgeting, managing money, or starting a small business.", detail: "Business and finance" },
  { id: "business3", domain: "business", title: "I enjoy taking responsibility, making decisions, or finding ways to improve a project.", detail: "Leadership and improvement" },

  { id: "creative1", domain: "creative", title: "I enjoy drawing, designing, decorating, or creating visual materials.", detail: "Visual arts and design" },
  { id: "creative2", domain: "creative", title: "I like writing, storytelling, photography, video, or other forms of media.", detail: "Writing and media" },
  { id: "creative3", domain: "creative", title: "I enjoy finding creative ways to communicate an idea or express myself.", detail: "Creative communication" },

  { id: "community1", domain: "community", title: "I enjoy listening to people and understanding their experiences or concerns.", detail: "People and relationships" },
  { id: "community2", domain: "community", title: "I care about community issues and want to help make things better.", detail: "Community involvement" },
  { id: "community3", domain: "community", title: "I am interested in history, culture, society, communication, or public issues.", detail: "Society and public life" },

  { id: "hands1", domain: "handsOn", title: "I enjoy building, fixing, assembling, or repairing things.", detail: "Making and repairing" },
  { id: "hands2", domain: "handsOn", title: "I like using tools, equipment, machines, or materials to complete a task.", detail: "Practical and technical work" },
  { id: "hands3", domain: "handsOn", title: "I enjoy preparing food, making products, or learning practical skills by doing them.", detail: "Applied and livelihood skills" },

  { id: "sports1", domain: "sports", title: "I enjoy sports, exercise, dancing, or other physical activities.", detail: "Movement and fitness" },
  { id: "sports2", domain: "sports", title: "I enjoy working with a team, practicing skills, or joining competitions.", detail: "Teamwork and sports" },
  { id: "sports3", domain: "sports", title: "I like encouraging others to stay active or helping organize physical activities.", detail: "Coaching and sports leadership" }
];

/* =========================================================
   COURSE CATALOG
   ========================================================= */

const COURSES = {
  "civil-engineering": { name: "BS Civil Engineering", college: "College of Engineering", desc: "Studies the planning, design, construction, and maintenance of infrastructure such as roads, bridges, buildings, and water systems.", jobs: [["Civil Engineer", "Plans and designs infrastructure and structures."], ["Site Engineer", "Helps coordinate and supervise construction activities."]] },
  "electrical-engineering": { name: "BS Electrical Engineering", college: "College of Engineering", desc: "Focuses on electricity, power systems, circuits, electrical equipment, and control systems.", jobs: [["Electrical Engineer", "Designs and works with electrical systems and equipment."], ["Power Systems Engineer", "Works with electrical power generation and distribution."]] },
  "electronics-engineering": { name: "BS Electronics Engineering", college: "College of Engineering", desc: "Studies electronic circuits, communication systems, devices, and control technology.", jobs: [["Electronics Engineer", "Designs, develops, and tests electronic systems."], ["Telecommunications Engineer", "Works with communication and telecommunications systems."]] },
  "industrial-engineering": { name: "BS Industrial Engineering", college: "College of Engineering", desc: "Focuses on improving systems, processes, productivity, quality, and the use of resources.", jobs: [["Industrial Engineer", "Improves processes and organizational efficiency."], ["Quality Engineer", "Helps maintain product and process quality."]] },
  "mechanical-engineering": { name: "BS Mechanical Engineering", college: "College of Engineering", desc: "Focuses on machines, mechanical systems, energy, manufacturing, design, and maintenance.", jobs: [["Mechanical Engineer", "Designs and maintains mechanical systems."], ["Manufacturing Engineer", "Improves manufacturing methods and production systems."]] },

  "it-network": { name: "BS Information Technology – Network Administration", college: "College of Computer Studies", desc: "Focuses on computer networks, connectivity, network administration, security, and troubleshooting.", jobs: [["Network Administrator", "Maintains computer networks and connectivity."], ["IT Support Specialist", "Helps users solve hardware, software, and network problems."]] },
  "it-web": { name: "BS Information Technology – Web and Mobile Application", college: "College of Computer Studies", desc: "Focuses on creating websites, mobile applications, software solutions, and digital services.", jobs: [["Web Developer", "Builds and maintains websites and web applications."], ["Mobile App Developer", "Creates applications for mobile devices."]] },
  "it-service": { name: "BS Information Technology – Technical Service Management", college: "College of Computer Studies", desc: "Focuses on technical support, IT service operations, troubleshooting, and technology service management.", jobs: [["Help Desk Analyst", "Handles user support requests and troubleshooting."], ["IT Service Specialist", "Helps manage and deliver technology services."]] },
  "is-analytics": { name: "BS Information Systems – Business Analytics", college: "College of Computer Studies", desc: "Combines business, technology, and data analysis to support organizational decisions.", jobs: [["Business Analyst", "Studies business needs and recommends improvements."], ["Data Analyst", "Analyzes data to identify useful information and patterns."]] },
  "computer-science": { name: "BS Computer Science", college: "College of Computer Studies", desc: "Studies programming, algorithms, computing concepts, data structures, and software development.", jobs: [["Software Developer", "Builds and maintains software applications."], ["Software Engineer", "Designs and develops software systems."]] },

  "chemistry": { name: "BS Chemistry", college: "College of Science", desc: "Studies matter, chemical reactions, materials, laboratory methods, and chemical processes.", jobs: [["Chemist", "Studies substances, materials, and chemical processes."], ["Laboratory Analyst", "Performs laboratory tests and analyzes samples."]] },
  "nursing": { name: "BS Nursing", college: "College of Science", desc: "Focuses on patient care, health, clinical practice, health education, and nursing services.", jobs: [["Registered Nurse", "Provides nursing care, monitoring, and patient education."], ["Community Health Nurse", "Provides health services and education in communities."]] },
  "environmental-science": { name: "BS Environmental Science", college: "College of Science", desc: "Studies ecosystems, pollution, conservation, environmental problems, and sustainability.", jobs: [["Environmental Scientist", "Studies environmental conditions and problems."], ["Conservation Officer", "Supports the protection of ecosystems and natural resources."]] },
  "mathematics": { name: "BS Mathematics", college: "College of Science", desc: "Develops mathematical reasoning, quantitative analysis, logical thinking, and problem-solving.", jobs: [["Statistician", "Analyzes data using statistical methods."], ["Mathematics Teacher", "Teaches mathematical concepts and problem-solving."]] },
  "food-technology": { name: "BS Food Technology", college: "College of Science", desc: "Focuses on food processing, safety, quality, product development, and food production.", jobs: [["Food Technologist", "Develops and improves food products and processes."], ["Quality Assurance Specialist", "Checks food quality and safety requirements."]] },

  "architecture": { name: "BS Architecture", college: "College of Architecture and Fine Arts", desc: "Focuses on architectural design, building planning, spaces, and the built environment.", jobs: [["Architectural Designer", "Develops concepts and visual designs for buildings."], ["Architect", "Plans and designs buildings and spaces, subject to professional requirements."]] },
  "visual-communication": { name: "BFA – Visual Communication", college: "College of Architecture and Fine Arts", desc: "Focuses on graphic design, branding, layouts, typography, and visual storytelling.", jobs: [["Graphic Designer", "Creates visual materials for communication and branding."], ["Art Director", "Guides the visual direction of creative projects."]] },

  "automotive-technology": { name: "BIT – Automotive Technology", college: "College of Industrial Technology", desc: "Focuses on vehicle systems, automotive servicing, diagnostics, repair, and maintenance.", jobs: [["Automotive Technician", "Diagnoses, repairs, and maintains vehicles."], ["Automotive Service Advisor", "Helps customers understand vehicle service needs."]] },
  "electrical-technology": { name: "BIT – Electrical Technology", college: "College of Industrial Technology", desc: "Focuses on electrical installation, wiring, equipment, maintenance, and safety.", jobs: [["Electrical Technician", "Installs, maintains, and repairs electrical systems."], ["Maintenance Technician", "Maintains equipment and electrical systems."]] },
  "mechatronics": { name: "BIT – Mechatronics Technology", college: "College of Industrial Technology", desc: "Combines mechanical, electrical, electronics, and automation technologies.", jobs: [["Mechatronics Technician", "Maintains and troubleshoots automated systems."], ["Automation Technician", "Works with automated equipment and control systems."]] },

  "accountancy": { name: "BS Accountancy", college: "College of Business and Accountancy", desc: "Focuses on accounting principles, financial reporting, auditing, taxation, and financial management.", jobs: [["Accountant", "Prepares and analyzes financial records."], ["Auditor", "Examines financial records and systems."]] },
  "accounting-is": { name: "BS Accounting Information System", college: "College of Business and Accountancy", desc: "Combines accounting with information systems, business technology, and financial data.", jobs: [["Accounting Systems Specialist", "Works with accounting software and systems."], ["Systems Analyst", "Studies information systems and recommends improvements."]] },
  "entrepreneurship": { name: "BS Entrepreneurship", college: "College of Business and Accountancy", desc: "Develops knowledge and skills for starting, managing, and growing business ventures.", jobs: [["Entrepreneur", "Creates and manages a business venture."], ["Business Development Associate", "Helps identify opportunities for business growth."]] },
  "hospitality": { name: "BS Hospitality Management", college: "College of Business and Accountancy", desc: "Focuses on hospitality operations, guest services, hotels, food service, and events.", jobs: [["Hotel Supervisor", "Supervises hotel operations and guest services."], ["Event Coordinator", "Helps organize and manage events."]] },
  "business-economics": { name: "BSBA – Business Economics", college: "College of Business and Accountancy", desc: "Focuses on economics, markets, business decisions, and resource use.", jobs: [["Business Analyst", "Analyzes business conditions and processes."], ["Market Analyst", "Studies market conditions and business trends."]] },
  "financial-management": { name: "BSBA – Financial Management", college: "College of Business and Accountancy", desc: "Focuses on financial planning, investments, budgeting, risk, and financial decisions.", jobs: [["Financial Analyst", "Analyzes financial information to support decisions."], ["Budget Analyst", "Helps prepare and monitor budgets."]] },
  "marketing-management": { name: "BSBA – Marketing Management", college: "College of Business and Accountancy", desc: "Focuses on marketing strategy, consumer behavior, promotion, sales, and branding.", jobs: [["Marketing Specialist", "Plans and supports marketing activities."], ["Market Research Analyst", "Studies customers, markets, and business trends."]] },
  "public-administration": { name: "Bachelor of Public Administration", college: "College of Public Administration and Governance", desc: "Focuses on public service, government administration, organizational management, and public programs.", jobs: [["Administrative Officer", "Supports administrative work in public organizations."], ["Program Officer", "Helps manage public programs and projects."]] },

  "communication": { name: "BA Communication", college: "College of Arts and Social Sciences", desc: "Studies communication, media, writing, public speaking, journalism, and communication strategies.", jobs: [["Communication Specialist", "Creates communication materials and strategies."], ["Public Relations Assistant", "Supports communication between organizations and the public."]] },
  "english-studies": { name: "BA English Language Studies", college: "College of Arts and Social Sciences", desc: "Focuses on English language, communication, writing, literature, and language use.", jobs: [["Writer or Editor", "Creates, reviews, and improves written content."], ["English Language Instructor", "Teaches English language skills, subject to role requirements."]] },
  "psychology": { name: "BA Psychology", college: "College of Arts and Social Sciences", desc: "Studies human behavior, thoughts, emotions, development, and psychological processes.", jobs: [["Human Resources Associate", "Supports recruitment and employee-related activities."], ["Behavioral Research Assistant", "Supports research about human behavior."]] },
  "human-services": { name: "Bachelor in Human Services", college: "College of Arts and Social Sciences", desc: "Focuses on assisting individuals, families, and communities through support programs and services.", jobs: [["Human Services Worker", "Supports individuals and communities through service programs."], ["Community Outreach Worker", "Connects communities with services and programs."]] },

  "bsed-english": { name: "BSEd – English", college: "College of Education", desc: "Prepares students to teach English language and communication skills at the secondary level.", jobs: [["Secondary English Teacher", "Teaches English and communication to secondary students."], ["English Tutor", "Provides additional support in English learning."]] },
  "bsed-filipino": { name: "BSEd – Filipino", college: "College of Education", desc: "Prepares students to teach Filipino language, literature, and related subjects.", jobs: [["Filipino Teacher", "Teaches Filipino language and literature."], ["Language Tutor", "Supports learners in Filipino language development."]] },
  "bsed-social": { name: "BSEd – Social Studies", college: "College of Education", desc: "Prepares students to teach history, geography, economics, politics, society, and social studies.", jobs: [["Social Studies Teacher", "Teaches history, geography, civics, economics, and society."], ["Curriculum Assistant", "Supports curriculum planning and learning materials."]] },
  "bsed-math": { name: "BSEd – Mathematics", college: "College of Education", desc: "Prepares students to teach mathematics and develop learners' quantitative reasoning.", jobs: [["Mathematics Teacher", "Teaches mathematics and problem-solving skills."], ["Math Tutor", "Provides individual or group mathematics support."]] },
  "bsed-science": { name: "BSEd – Sciences", college: "College of Education", desc: "Prepares students to teach science subjects and scientific thinking.", jobs: [["Science Teacher", "Teaches science concepts and scientific inquiry."], ["Science Content Developer", "Creates science learning materials."]] },
  "bece": { name: "BECEd – Early Childhood Education", college: "College of Education", desc: "Prepares teachers to support young children's early learning and development.", jobs: [["Early Childhood Teacher", "Teaches and supports young children."], ["Preschool Teacher", "Provides learning activities for preschool children."]] },
  "beed": { name: "BEEd – General Education", college: "College of Education", desc: "Prepares teachers for elementary education and broad foundational learning areas.", jobs: [["Elementary Teacher", "Teaches foundational subjects to elementary learners."], ["Learning Facilitator", "Supports learners during educational activities."]] },
  "bped": { name: "Bachelor of Physical Education", college: "College of Education", desc: "Focuses on physical education, sports, movement, health, fitness, and teaching.", jobs: [["Physical Education Teacher", "Teaches movement, fitness, health, and physical activities."], ["Sports Coordinator", "Coordinates sports activities and programs."]] },
  "criminology": { name: "BS Criminology", college: "College of Criminal Justice Education", desc: "Studies crime, criminal justice, law enforcement, public safety, and related social issues.", jobs: [["Crime Analyst", "Analyzes crime-related information and patterns."], ["Public Safety Officer", "Supports community safety and public protection."]] },
  "btled-industrial": { name: "BTLEd – Industrial Arts", college: "College of Education", desc: "Prepares students to teach practical, technical, and industrial arts skills.", jobs: [["Industrial Arts Teacher", "Teaches practical and technical skills."], ["Technical Skills Trainer", "Provides hands-on technical training."]] },
  "btvted-food": { name: "BTVTEd – Food Service Management", college: "College of Education", desc: "Focuses on food preparation, service, hospitality, and vocational teaching.", jobs: [["Food Service Instructor", "Teaches food service and related skills."], ["Kitchen Supervisor", "Coordinates kitchen operations."]] }
};

const TRACKS = [
  { id: "STEM", name: "Science, Technology, Engineering, and Mathematics", icon: "🔬", group: "Academic", desc: "For students interested in science, technology, engineering, mathematics, research, health, and problem-solving.", colleges: [
    ["College of Engineering", ["civil-engineering","electrical-engineering","electronics-engineering","industrial-engineering","mechanical-engineering"]],
    ["College of Computer Studies", ["it-network","it-web","it-service","is-analytics","computer-science"]],
    ["College of Science", ["chemistry","nursing","environmental-science","mathematics","food-technology"]],
    ["College of Architecture and Fine Arts", ["architecture","visual-communication"]],
    ["College of Industrial Technology", ["automotive-technology","electrical-technology","mechatronics"]]
  ]},
  { id: "ABM", name: "Accountancy, Business, and Management", icon: "💼", group: "Academic", desc: "For students interested in business, finance, accounting, entrepreneurship, marketing, and management.", colleges: [
    ["College of Business and Accountancy", ["accountancy","accounting-is","entrepreneurship","hospitality","business-economics","financial-management","marketing-management"]],
    ["College of Public Administration and Governance", ["public-administration"]]
  ]},
  { id: "HUMSS", name: "Humanities and Social Sciences", icon: "🗣️", group: "Academic", desc: "For students interested in people, communication, society, culture, education, psychology, and public service.", colleges: [
    ["College of Arts and Social Sciences", ["communication","english-studies","psychology","human-services"]],
    ["College of Education", ["bsed-english","bsed-filipino","bsed-social","bsed-math","bsed-science","bece","beed","bped"]],
    ["College of Criminal Justice Education", ["criminology"]],
    ["College of Public Administration and Governance", ["public-administration"]]
  ]},
  { id: "GAS", name: "General Academic Strand", icon: "📖", group: "Academic", desc: "A broad academic strand for students who are still exploring different interests and possible college directions.", colleges: [
    ["College of Arts and Social Sciences", ["communication","english-studies","psychology","human-services"]],
    ["College of Business and Accountancy", ["entrepreneurship","hospitality","business-economics","financial-management","marketing-management"]],
    ["College of Education", ["beed","bsed-english","bsed-filipino","bsed-social","bsed-math","bsed-science","bece","bped"]],
    ["College of Public Administration and Governance", ["public-administration"]],
    ["College of Criminal Justice Education", ["criminology"]]
  ]},
  { id: "TVL", name: "Technical-Vocational-Livelihood", icon: "🛠️", group: "Technical", desc: "For students interested in practical, technical, service, technology, and livelihood skills.", colleges: [
    ["College of Industrial Technology", ["automotive-technology","electrical-technology","mechatronics"]],
    ["College of Education", ["btled-industrial","btvted-food"]],
    ["College of Computer Studies", ["it-network","it-web","it-service","is-analytics","computer-science"]],
    ["College of Business and Accountancy", ["hospitality","entrepreneurship"]]
  ]},
  { id: "ARTS-DESIGN", name: "Arts and Design", icon: "🎨", group: "Creative", desc: "For students interested in visual arts, communication, design, media, and creative expression.", colleges: [
    ["College of Architecture and Fine Arts", ["architecture","visual-communication"]],
    ["College of Arts and Social Sciences", ["communication","english-studies"]]
  ]},
  { id: "SPORTS", name: "Sports", icon: "🏃", group: "Sports", desc: "For students interested in physical education, health, sports, fitness, teamwork, and movement.", colleges: [
    ["College of Education", ["bped","beed","bsed-social"]],
    ["College of Science", ["nursing","environmental-science"]]
  ]}
];

/* =========================================================
   CAREER PROFILES
   ========================================================= */

const CAREER_PROFILES = {
  teaching: { about: "Education professionals help learners gain knowledge, skills, and confidence. Teachers plan lessons, explain concepts, guide activities, assess learning, and support students with different needs.", tasks: ["Plan and deliver lessons or learning activities.","Prepare learning materials and classroom activities.","Check student progress and give feedback.","Communicate with learners, families, and other education professionals."], places: ["Elementary and high schools","Colleges and universities","Learning centers and tutorial services","Training and educational organizations"], skills: ["Clear communication","Patience and empathy","Organization","Creativity","Classroom or group facilitation"], prep: "Build communication and presentation skills, practice explaining topics, volunteer as a peer tutor, and learn about the subject area you may want to teach. Professional teaching requirements must also be checked." },
  technology: { about: "Technology professionals build, maintain, analyze, or support digital tools and systems. Their work may involve software, applications, computer networks, databases, information systems, or user support.", tasks: ["Develop, configure, test, or maintain technology systems.","Troubleshoot technical problems.","Document systems and technical processes.","Work with users, clients, developers, or technical teams."], places: ["Technology and software companies","Banks and private organizations","Schools and universities","Government offices","IT service providers"], skills: ["Logical thinking","Digital literacy","Troubleshooting","Technical communication","Continuous learning"], prep: "Try beginner coding, make a simple website, practice computer troubleshooting, or build a small digital project. Keep examples of your work." },
  science: { about: "Science and health professionals use evidence, observation, testing, and subject knowledge to understand problems, support health, or improve products and environments.", tasks: ["Collect and organize information or samples.","Conduct tests, observations, or measurements.","Analyze results and prepare reports.","Follow safety, ethical, and quality procedures."], places: ["Laboratories and research facilities","Hospitals and clinics for applicable health roles","Schools and universities","Government agencies","Environmental and food-related organizations"], skills: ["Scientific reasoning","Observation","Research and data analysis","Attention to detail","Responsible teamwork"], prep: "Strengthen science and mathematics, practice research and careful observation, and explore laboratory or community activities related to your interests." },
  business: { about: "Business professionals help organizations plan, operate, communicate with customers, manage resources, and grow. Depending on the role, the work may involve finance, marketing, accounting, sales, operations, or entrepreneurship.", tasks: ["Prepare plans, budgets, reports, or presentations.","Analyze business information and opportunities.","Coordinate with customers, employees, or partners.","Support decisions and organizational goals."], places: ["Private companies","Banks and financial institutions","Retail and service businesses","Hospitality organizations","Government and nonprofit offices"], skills: ["Communication","Organization","Numerical and analytical skills","Teamwork and leadership","Customer awareness"], prep: "Practice budgeting, spreadsheets, presentations, customer communication, and planning. Try organizing a small project or developing a simple business idea." },
  creative: { about: "Creative professionals use design, writing, media, and storytelling to communicate ideas. Work can include developing concepts, preparing drafts, receiving feedback, and producing final creative materials.", tasks: ["Develop concepts and creative ideas.","Create visual, written, or multimedia materials.","Revise work based on feedback and project needs.","Present ideas to clients, teams, or audiences."], places: ["Design studios and advertising agencies","Media and publishing companies","Marketing departments","Creative organizations","Freelance or independent work"], skills: ["Creativity","Visual or written communication","Digital tools","Attention to detail","Receiving and applying feedback"], prep: "Create posters, writing samples, photographs, videos, or designs. Practice relevant tools and build a portfolio of work you are proud of." },
  community: { about: "People- and community-focused professionals work with individuals, groups, organizations, or public programs. They may support communication, research, outreach, public service, or community development.", tasks: ["Listen to people and understand their needs.","Prepare reports, communication materials, or program documents.","Coordinate with offices, groups, or communities.","Support services, activities, or public programs."], places: ["Community and nonprofit organizations","Government offices and local government units","Schools and universities","Communication and media organizations","Public service institutions"], skills: ["Listening and communication","Research","Empathy and respect","Organization","Critical thinking"], prep: "Join community activities, practice writing and public speaking, learn about social issues, and develop respectful communication with different people." },
  handsOn: { about: "Technical and hands-on professionals use tools, equipment, practical knowledge, and procedures to build, install, maintain, prepare, or repair products and systems.", tasks: ["Use tools or equipment safely.","Install, assemble, inspect, or maintain materials and systems.","Identify and solve practical problems.","Follow technical instructions and safety procedures."], places: ["Workshops and service centers","Factories and production facilities","Construction and maintenance sites","Automotive and electrical service businesses","Training facilities"], skills: ["Practical problem-solving","Manual and technical skills","Safety awareness","Attention to detail","Reliability"], prep: "Look for supervised practical activities, learn safe tool use, and explore technical-vocational subjects related to the kind of work you enjoy." },
  sports: { about: "Sports and physical education professionals support physical activity, fitness, sports development, teaching, and organized recreation.", tasks: ["Plan or conduct physical activity sessions.","Teach movement, fitness, or sports skills.","Help organize practices, events, or competitions.","Encourage safe and inclusive participation."], places: ["Schools and universities","Gyms and fitness centers","Sports organizations and clubs","Community recreation programs","Training facilities"], skills: ["Communication and leadership","Physical fitness","Organization","Teamwork","Safety awareness"], prep: "Participate in sports or fitness activities, help organize events, practice leadership, and learn how physical activity supports health and development." }
};

/* =========================================================
   APP STATE + LOCAL STORAGE HELPERS
   ========================================================= */

let currentAssessmentType = null;
let selectedActivityIds = new Set();
let deferredInstallPrompt = null;

function safeStore(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch (error) { console.warn("Local storage unavailable:", error); return false; }
}
function safeRead(key) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
  catch (error) { console.warn("Could not read local data:", error); return null; }
}
function showModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  if (!$$(".modal.show").length) document.body.style.overflow = "";
}

/* =========================================================
   ASSESSMENT RENDERING
   ========================================================= */

function openAssessment(type) {
  currentAssessmentType = type;
  selectedActivityIds = new Set();
  const isParent = type === "parent";

  $("#assessmentKicker").textContent = isParent ? "For parents or guardians" : "For students";
  $("#assessmentTitle").textContent = isParent ? "How well do you know your child?" : "Discover your own interests";
  $("#assessmentSubtitle").textContent = isParent
    ? "Choose the activities you have genuinely noticed your child enjoying. It is okay not to know every answer."
    : "Choose the activities that genuinely interest you. You do not need to know your future career yet.";
  $("#studentReflection").classList.toggle("hidden", isParent);
  $("#parentReflection").classList.toggle("hidden", !isParent);
  $("#parentCodeBlock").classList.toggle("hidden", isParent);
  $("#parentCodeInput").value = "";
  $$("input[name='influence']").forEach(input => input.checked = false);
  $$("input[name='parentConfidence']").forEach(input => input.checked = false);
  $("#formMessage").textContent = "";
  renderActivityOptions(isParent);
  updateSelectionCount();
  showModal("assessmentModal");
}

function renderActivityOptions(isParent) {
  const grid = $("#activityGrid");
  grid.innerHTML = ACTIVITIES.map(activity => `
    <label class="activity-option" data-activity="${activity.id}">
      <input type="checkbox" value="${activity.id}" aria-label="${escapeHTML(activity.title)}" />
      <span><strong>${escapeHTML(activity.title)}</strong><small>${escapeHTML(activity.detail)}</small></span>
    </label>
  `).join("");

  $$(".activity-option input", grid).forEach(input => {
    input.addEventListener("change", () => {
      if (input.checked && selectedActivityIds.size >= 8) {
        input.checked = false;
        $("#formMessage").textContent = "Please choose no more than 8 activities so your strongest interests stand out.";
        return;
      }
      if (input.checked) selectedActivityIds.add(input.value);
      else selectedActivityIds.delete(input.value);
      input.closest(".activity-option").classList.toggle("selected", input.checked);
      $("#formMessage").textContent = "";
      updateSelectionCount();
    });
  });
}

function updateSelectionCount() {
  const count = selectedActivityIds.size;
  $("#selectionCount").textContent = `${count} ${count === 1 ? "activity" : "activities"} selected`;
}

function calculateScores(activityIds) {
  const scores = Object.fromEntries(Object.keys(DOMAINS).map(key => [key, 0]));
  const evidence = Object.fromEntries(Object.keys(DOMAINS).map(key => [key, []]));
  for (const id of activityIds) {
    const item = ACTIVITIES.find(activity => activity.id === id);
    if (!item) continue;
    scores[item.domain] += 1;
    evidence[item.domain].push(item.title);
  }
  return { scores, evidence, selectedCount: activityIds.length };
}

function getRankedDomains(scores) {
  return Object.entries(scores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([key, score]) => ({ key, score, ...DOMAINS[key] }));
}

function getTopDomainKeys(scores, limit = 3) {
  const ranked = getRankedDomains(scores);
  if (!ranked.length) return [];
  const cutoff = ranked[Math.min(limit - 1, ranked.length - 1)].score;
  return ranked.filter(item => item.score >= cutoff).map(item => item.key);
}

/* =========================================================
   PARENT-STUDENT PAIRING CODE
   This is a portable score summary, not encryption.
   It does not contain names or the individual selected answers.
   ========================================================= */

function encodeParentCode(scores) {
  const payload = { v: 1, s: scores };
  const json = JSON.stringify(payload);
  const encoded = btoa(unescape(encodeURIComponent(json)))
    .replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  return `PF1-${encoded}`;
}

function decodeParentCode(code) {
  const clean = String(code || "").trim().replace(/\s+/g, "");
  if (!clean.startsWith("PF1-")) throw new Error("That code does not look like a PATHFINDER parent code.");
  let encoded = clean.slice(4).replaceAll("-", "+").replaceAll("_", "/");
  while (encoded.length % 4) encoded += "=";
  let payload;
  try { payload = JSON.parse(decodeURIComponent(escape(atob(encoded)))); }
  catch { throw new Error("The pairing code could not be read. Please copy the full code and try again."); }
  if (payload?.v !== 1 || !payload.s || !Object.keys(DOMAINS).every(key => Number.isFinite(payload.s[key]))) {
    throw new Error("This PATHFINDER pairing code is incomplete or unsupported.");
  }
  return { scores: payload.s, version: payload.v };
}

function getParentComparison(inputCode) {
  if (inputCode.trim()) return decodeParentCode(inputCode);
  const saved = safeRead("pathfinder_parent_result_v1");
  if (saved?.scores) return { scores: saved.scores, version: 1, fromSameDevice: true };
  return null;
}

/* =========================================================
   RESULTS RENDERING
   ========================================================= */

function submitAssessment() {
  const type = currentAssessmentType;
  if (!type) return;
  const calculated = calculateScores([...selectedActivityIds]);
  const influences = type === "student"
    ? $$("input[name='influence']:checked").map(input => input.value)
    : [];

  if (type === "parent") {
    const confidence = $("input[name='parentConfidence']:checked")?.value || "";
    const parentResult = { scores: calculated.scores, selectedCount: calculated.selectedCount, confidence, completedAt: new Date().toISOString() };
    safeStore("pathfinder_parent_result_v1", parentResult);
    const code = encodeParentCode(calculated.scores);
    closeModal("assessmentModal");
    renderResults({ type, ...calculated, confidence, code });
    return;
  }

  let parentResult = null;
  const enteredCode = $("#parentCodeInput").value.trim();
  try {
    parentResult = getParentComparison(enteredCode);
  } catch (error) {
    $("#formMessage").textContent = error.message;
    return;
  }

  const studentResult = {
    scores: calculated.scores,
    selectedCount: calculated.selectedCount,
    influences,
    completedAt: new Date().toISOString()
  };
  safeStore("pathfinder_student_result_v1", studentResult);
  closeModal("assessmentModal");
  renderResults({ type, ...calculated, influences, parentResult });
}

function renderResults(result) {
  const isParent = result.type === "parent";
  $("#resultsTitle").textContent = isParent ? "Your parent perspective" : "Your interest profile";
  $("#resultsSubtitle").textContent = isParent
    ? "This reflects what you have noticed about your child. Use it as a conversation starter, not a decision for them."
    : "These are possible directions based on the activities you selected. Explore them before making a decision.";

  const ranked = getRankedDomains(result.scores);
  const topKeys = getTopDomainKeys(result.scores, 3);
  const maxScore = Math.max(1, ...Object.values(result.scores));

  let html = `<div class="result-intro"><strong>${isParent ? "A parent's perspective" : "Your interests deserve attention"}</strong><p>${isParent ? "Your answers show the interest areas you currently notice in your child. Your child's own answers may be similar or different, and both perspectives can help start a respectful discussion." : "An interest profile is not a fixed label. People can have several interests, and these can change as they gain experience."}</p></div>`;

  html += `<h3 class="result-section-title">${isParent ? "Interest areas you noticed" : "Your leading interest areas"}</h3>`;
  if (!ranked.length) {
    html += `<div class="result-intro"><strong>Still observing or exploring?</strong><p>No activities were selected. That is okay. You can return to the assessment later, or browse the track and course guide together.</p></div>`;
  } else {
    html += `<div class="interest-results">${ranked.map(item => `
      <div class="interest-row">
        <span class="interest-label">${item.icon} ${escapeHTML(item.name)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(item.score / maxScore * 100)}%"></div></div>
        <span class="interest-score">${item.score}</span>
      </div>`).join("")}</div>`;
    html += `<p class="result-note">Bars compare the number of selected activities across interest areas. A higher score means more of the selected activities were connected to that area; it does not measure ability or guarantee career fit.</p>`;
  }

  if (ranked.length) {
    html += `<h3 class="result-section-title">${isParent ? "Courses worth discussing" : "Courses you may want to explore"}</h3>`;
    html += renderCourseRecommendations(topKeys);
    html += `<h3 class="result-section-title">Possible career directions</h3><div class="recommendation-grid">`;
    topKeys.forEach(key => {
      const d = DOMAINS[key];
      html += `<article class="recommendation-card"><h4>${d.icon} ${escapeHTML(d.name)}</h4><p>${escapeHTML(d.summary)}</p><div class="tag-list">${d.careers.map(job => `<span class="tag">${escapeHTML(job)}</span>`).join("")}</div></article>`;
    });
    html += `</div>`;
  }

  if (isParent) {
    const confidenceLabels = { very: "Very confident", somewhat: "Somewhat confident", learning: "Still getting to know my child's interests", unsure: "Not sure yet" };
    if (result.confidence) {
      html += `<div class="influence-result"><h3>Your confidence check</h3><p>You selected: <strong>${escapeHTML(confidenceLabels[result.confidence])}</strong>.</p><p class="result-note">This is a self-reflection, not a score of parenting. The best next step is to ask your child what they enjoy and listen to their reasons.</p></div>`;
    }
    html += `<div class="pair-code-box"><strong>Compare with your child's self-assessment</strong><p class="result-note">Share this code with your child. It contains only your category scores, not your name or individual selections. The code is readable data, not encryption, so share it privately.</p><code id="parentPairCode">${escapeHTML(result.code)}</code><button class="button button-maroon" id="copyPairCode" type="button">Copy Parent Pairing Code</button></div>`;
    html += `<div class="section-callout"><strong>Parent reminder:</strong> Use this result to ask your child what they enjoy and why. It should support their decision, not replace their voice.</div>`;
  } else {
    html += renderInfluenceReflection(result.influences || []);
    if (result.parentResult?.scores) html += renderComparison(result.scores, result.parentResult.scores, result.parentResult.fromSameDevice);
    else html += `<div class="comparison-box"><h3>Want to compare with a parent or guardian?</h3><p>You can enter the pairing code they received after completing the parent assessment. If they completed it on this same browser, PATHFINDER will use the saved result automatically.</p></div>`;
    html += `<div class="section-callout"><strong>Remember:</strong> Your results are suggestions for exploration. Consider your interests, strengths, values, financial and practical circumstances, admission requirements, and the actual content of each course. You do not need to choose based only on one assessment.</div>`;
  }

  html += `<div class="result-actions"><button class="button button-light" type="button" data-close-modal="resultsModal">Close Results</button><a class="button button-gold" href="#explore" id="goExploreFromResults">Explore Courses <span>→</span></a><button class="button button-light" type="button" id="retakeAssessment">Retake Assessment</button></div>`;
  $("#resultsBody").innerHTML = html;
  showModal("resultsModal");

  const copyButton = $("#copyPairCode");
  if (copyButton) copyButton.addEventListener("click", () => copyText(result.code, copyButton));
  const retake = $("#retakeAssessment");
  if (retake) retake.addEventListener("click", () => { closeModal("resultsModal"); openAssessment(result.type); });
  const goExplore = $("#goExploreFromResults");
  if (goExplore) goExplore.addEventListener("click", () => closeModal("resultsModal"));
  $$('[data-close-modal="resultsModal"]').forEach(button => button.addEventListener("click", () => closeModal("resultsModal")));
}

function renderCourseRecommendations(domainKeys) {
  const seen = new Set();
  const entries = [];
  domainKeys.forEach(key => {
    DOMAINS[key].courses.forEach(courseId => {
      if (!seen.has(courseId) && COURSES[courseId]) {
        seen.add(courseId);
        entries.push({ ...COURSES[courseId], id: courseId, domain: key });
      }
    });
  });
  const limited = entries.slice(0, 8);
  if (!limited.length) return `<p class="result-note">Explore the course guide to learn about possible programs.</p>`;
  return `<div class="recommendation-grid">${limited.map(course => `
    <article class="recommendation-card"><h4>${escapeHTML(course.name)}</h4><p>${escapeHTML(course.desc)}</p><div class="tag-list"><span class="tag">${escapeHTML(course.college)}</span><span class="tag">Related to ${escapeHTML(DOMAINS[course.domain].name)}</span></div></article>`).join("")}</div>`;
}

function renderComparison(studentScores, parentScores, sameDevice) {
  const studentTop = getTopDomainKeys(studentScores, 3);
  const parentTop = getTopDomainKeys(parentScores, 3);
  const shared = studentTop.filter(key => parentTop.includes(key));
  const studentOnly = studentTop.filter(key => !parentTop.includes(key));
  const parentOnly = parentTop.filter(key => !studentTop.includes(key));
  const list = (keys, fallback) => keys.length ? keys.map(key => `<li>${escapeHTML(DOMAINS[key].name)}</li>`).join("") : `<li>${fallback}</li>`;
  return `
    <div class="comparison-box">
      <h3>Parent–student comparison</h3>
      <p>${sameDevice ? "The comparison uses the parent assessment saved in this browser." : "The comparison uses the pairing code shared by the parent or guardian."} This is a conversation aid, not a score of how well a parent knows a child.</p>
      <div class="comparison-columns">
        <div class="comparison-col"><h4>Shared interest areas</h4><ul>${list(shared, "No leading area overlaps yet. This is a good topic to discuss.")}</ul></div>
        <div class="comparison-col"><h4>Areas to discuss</h4><ul>${list([...studentOnly.map(k => `${DOMAINS[k].name} (student)`), ...parentOnly.map(k => `${DOMAINS[k].name} (parent view)`)], "The leading areas are currently similar.")}</ul></div>
      </div>
      <p><strong>How to use this:</strong> Ask the student what makes an activity enjoyable, then let the parent share what they have observed. Differences are not failures; they may reveal interests that have not yet been discussed.</p>
    </div>`;
}

function renderInfluenceReflection(influences) {
  if (!influences.length) return `<div class="influence-result"><h3>Decision check</h3><p class="result-note">You did not select any decision-pressure statements. You can still reflect on whether your course choice comes from your own interests and whether you have enough information.</p></div>`;
  const messages = {
    parent: "Family expectations may be influencing your decision. Consider discussing what you enjoy and reviewing course information together.",
    peer: "Friends' choices may be influencing your decision. Try exploring your own interests separately before comparing choices with friends.",
    information: "You may need more information. Read course descriptions, ask current students or advisers, and compare the actual subjects and career paths.",
    own: "You are making an effort to consider your own interests. Keep checking those interests against course requirements and real course content."
  };
  const labels = { parent: "Family expectations", peer: "Peer influence", information: "Need for more information", own: "Personal interests" };
  return `<div class="influence-result"><h3>Your decision check</h3><p class="result-note">These are reflections, not labels or diagnoses.</p><ul>${influences.map(key => `<li><strong>${labels[key]}:</strong> ${messages[key]}</li>`).join("")}</ul></div>`;
}

async function copyText(text, button) {
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
  } catch {
    const input = document.createElement("textarea");
    input.value = text;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    button.textContent = copied ? "Copied!" : "Select and copy the code above";
  }
  setTimeout(() => button.textContent = original, 2200);
}

/* =========================================================
   COURSE / TRACK EXPLORER
   ========================================================= */

let activeTrackFilter = "all";

function renderTracks() {
  const grid = $("#trackGrid");
  const query = $("#trackSearch").value.trim().toLowerCase();
  const visibleTracks = TRACKS.filter(track => {
    const matchesFilter = activeTrackFilter === "all" || track.group === activeTrackFilter;
    const searchable = `${track.id} ${track.name} ${track.desc}`.toLowerCase();
    return matchesFilter && (!query || searchable.includes(query));
  });
  if (!visibleTracks.length) {
    grid.innerHTML = `<div class="no-tracks">No matching track found. Try another search or filter.</div>`;
    return;
  }
  grid.innerHTML = visibleTracks.map(track => `
    <button type="button" class="track-card" data-track="${track.id}">
      <span class="track-symbol">${track.icon}</span>
      <h3>${escapeHTML(track.id.replace("ARTS-DESIGN", "Arts & Design"))}</h3>
      <p>${escapeHTML(track.desc)}</p>
      <span class="track-meta">${escapeHTML(track.group)} pathway · View programs →</span>
    </button>
  `).join("");
  $$("[data-track]").forEach(button => button.addEventListener("click", () => openTrack(button.dataset.track)));
}

function openTrack(trackId) {
  const track = TRACKS.find(item => item.id === trackId);
  if (!track) return;
  $("#detailCode").textContent = `${track.group} PATHWAY`;
  $("#detailTitle").textContent = track.id === "ARTS-DESIGN" ? "Arts & Design" : track.id;
  $("#detailDescription").textContent = track.desc;
  $("#courseGroups").innerHTML = track.colleges.map(([college, courseIds]) => `
    <section class="college-group">
      <div class="college-title">${escapeHTML(college)}</div>
      <div class="course-list">${courseIds.map(id => {
        const course = COURSES[id];
        if (!course) return "";
        return `<article class="course-item"><h4>${escapeHTML(course.name)}</h4><p>${escapeHTML(course.desc)}</p><button class="text-button" type="button" data-jobs="${id}">Show Job Opportunities ↓</button><ul class="course-job-list" id="jobs-${id}">${course.jobs.map(([job, desc]) => `<li><strong>${escapeHTML(job)}</strong>${escapeHTML(desc)} <button class="text-button" type="button" data-career="${id}" data-job="${encodeURIComponent(job)}">Learn more</button></li>`).join("")}</ul></article>`;
      }).join("")}</div>
    </section>`).join("");
  $$("[data-jobs]").forEach(button => button.addEventListener("click", () => {
    const list = document.getElementById(`jobs-${button.dataset.jobs}`);
    const open = list.classList.toggle("open");
    button.textContent = open ? "Hide Job Opportunities ↑" : "Show Job Opportunities ↓";
  }));
  $$("[data-career]").forEach(button => button.addEventListener("click", () => openCareer(button.dataset.career, decodeURIComponent(button.dataset.job))));
  $("#trackDetail").classList.remove("hidden");
  $("#trackDetail").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openCareer(courseId, jobTitle) {
  const course = COURSES[courseId];
  const categories = Object.keys(DOMAINS).filter(key => DOMAINS[key].courses.includes(courseId));
  const profileKey = categories[0] || "community";
  const profile = CAREER_PROFILES[profileKey];
  $("#careerModalTitle").textContent = jobTitle;
  $("#careerModalBody").innerHTML = `
    <div class="career-detail">
      <div class="career-block"><h3>About this career</h3><p>${escapeHTML(profile.about)}</p><p>This career is one possible path connected to <strong>${escapeHTML(course.name)}</strong>. Actual duties depend on the employer, specialization, and local professional requirements.</p></div>
      <div class="career-block"><h3>What might the work involve?</h3><ul>${profile.tasks.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
      <div class="career-block"><h3>Where might you work?</h3><ul>${profile.places.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
      <div class="career-block"><h3>Useful skills</h3><ul>${profile.skills.map(item => `<li>${escapeHTML(item)}</li>`).join("")}</ul></div>
      <div class="career-block"><h3>How can you prepare?</h3><p>${escapeHTML(profile.prep)}</p></div>
      <p class="result-note">Career information is introductory. Check current job requirements, qualifications, licensure rules, and employer expectations before making decisions.</p>
    </div>`;
  showModal("careerModal");
}

/* =========================================================
   NAVIGATION + MODAL EVENTS
   ========================================================= */

$("#trackSearch").addEventListener("input", renderTracks);
$$("[data-track-filter]").forEach(button => button.addEventListener("click", () => {
  activeTrackFilter = button.dataset.trackFilter;
  $$("[data-track-filter]").forEach(item => item.classList.toggle("active", item === button));
  renderTracks();
}));

$("#menuToggle").addEventListener("click", () => {
  const expanded = $("#navLinks").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", String(expanded));
});
$$("#navLinks a").forEach(link => link.addEventListener("click", () => {
  $("#navLinks").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}));
$$("[data-open-assessment]").forEach(button => button.addEventListener("click", () => openAssessment(button.dataset.openAssessment)));
$("#submitAssessment").addEventListener("click", submitAssessment);
$("#closeTrackDetail").addEventListener("click", () => $("#trackDetail").classList.add("hidden"));
$$('[data-close-modal]').forEach(button => button.addEventListener("click", () => closeModal(button.dataset.closeModal)));
$$('.modal').forEach(modal => modal.addEventListener("click", event => {
  if (event.target === modal) closeModal(modal.id);
}));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") $$(".modal.show").forEach(modal => closeModal(modal.id));
});

/* =========================================================
   PWA INSTALL HELP
   ========================================================= */

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}
function deviceType() {
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  return "desktop";
}
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
});
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  $("#installButton").textContent = "✓ App Installed";
});

$("#installButton").addEventListener("click", async () => {
  if (isInstalled()) {
    showInstallInstructions("PATHFINDER is already installed on this device.", ["You can close this message and continue using the app."]);
    return;
  }
  if (deferredInstallPrompt) {
    try {
      await deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      return;
    } catch (error) {
      console.warn("Install prompt could not be opened:", error);
    }
  }
  const device = deviceType();
  if (device === "ios") {
    showInstallInstructions("Add PATHFINDER to your iPhone or iPad Home Screen", [
      "Open this website in Safari.",
      "Tap the Share button.",
      "Choose Add to Home Screen.",
      "Keep Open as Web App enabled if the option appears, then tap Add."
    ], "iOS does not use the Android-style install prompt. Use Safari's Add to Home Screen option.");
  } else if (device === "android") {
    showInstallInstructions("Install PATHFINDER on Android", [
      "Open PATHFINDER in Google Chrome.",
      "If the install prompt is not shown, open Chrome's three-dot menu.",
      "Choose Install app or Add to Home screen if available."
    ], "The install option appears only when the site meets the browser's install requirements.");
  } else {
    showInstallInstructions("Install PATHFINDER on your computer", [
      "Open PATHFINDER in Google Chrome or Microsoft Edge.",
      "Look for the Install icon in the address bar, or open the browser menu.",
      "Choose Install PATHFINDER if it is offered."
    ], "The site must be served from HTTPS or localhost for PWA installation.");
  }
});

function showInstallInstructions(title, steps, note = "") {
  $("#installBody").innerHTML = `<h3>${escapeHTML(title)}</h3><ol class="install-steps">${steps.map(step => `<li>${escapeHTML(step)}</li>`).join("")}</ol>${note ? `<p class="install-small">${escapeHTML(note)}</p>` : ""}`;
  showModal("installModal");
}

/* =========================================================
   SERVICE WORKER
   ========================================================= */

if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .then(registration => console.log("PATHFINDER service worker:", registration.scope))
      .catch(error => console.error("Service worker registration failed:", error));
  });
}

/* =========================================================
   INITIALIZE
   ========================================================= */
renderTracks();
