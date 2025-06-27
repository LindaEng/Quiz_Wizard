-- Create test users
INSERT INTO users (name, email)
VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Alice Johnson', 'alice@example.com'),
  ('Bob Brown', 'bob@example.com');

-- Create test assignments
INSERT INTO assignments (title)
VALUES
  ('Basic Skeletal System Quiz'),
  ('Cardiovascular System Basics'),
  ('Digestive System Overview');

-- Create questions for Basic Skeletal System Quiz (assignment_id = 1)
INSERT INTO assignment_questions (assignment_id, question_content, choices)
VALUES
  (1, 'Which bone is the longest in the human body?', 'Femur;;Tibia;;Humerus;;Fibula'),
  (1, 'How many bones are in the adult human body?', '206;;186;;226;;196'),
  (1, 'Which part of the skull protects the brain?', 'Cranium;;Mandible;;Maxilla;;Hyoid'),
  (1, 'What is the common name for the clavicle?', 'Collarbone;;Wishbone;;Shoulderblade;;Neckbone'),
  (1, 'Explain the difference between compact and spongy bone tissue:', NULL);

-- Create questions for Cardiovascular System Basics (assignment_id = 2)
INSERT INTO assignment_questions (assignment_id, question_content, choices)
VALUES
  (2, 'Which chamber of the heart pumps blood to the body?', 'Left ventricle;;Right ventricle;;Left atrium;;Right atrium'),
  (2, 'What is the main function of red blood cells?', 'Carry oxygen;;Fight infection;;Form blood clots;;Produce antibodies'),
  (2, 'Which blood vessel carries oxygenated blood?', 'Arteries;;Veins;;Capillaries;;Venules'),
  (2, 'How many chambers are in the human heart?', '4;;2;;3;;6'),
  (2, 'Describe the path of blood flow through the heart:', NULL);

-- Create questions for Digestive System Overview (assignment_id = 3)
INSERT INTO assignment_questions (assignment_id, question_content, choices)
VALUES
  (3, 'Where does chemical digestion begin?', 'Mouth;;Stomach;;Small intestine;;Esophagus'),
  (3, 'Which organ produces bile?', 'Liver;;Pancreas;;Gallbladder;;Stomach'),
  (3, 'What is the longest part of the digestive system?', 'Small intestine;;Large intestine;;Esophagus;;Stomach'),
  (3, 'Which enzyme breaks down proteins in the stomach?', 'Pepsin;;Amylase;;Lipase;;Trypsin'),
  (3, 'Explain the role of villi in the small intestine:', NULL);
