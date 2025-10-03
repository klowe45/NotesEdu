INSERT INTO teachers (first_name, last_name, email)
VALUES ('Alice','Anderson','alice@example.com'),
       ('Brian','Baker','brian@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO students (first_name, middle_name, last_name, grade)
VALUES ('John','M','Doe',5), ('Jane',NULL,'Smith',7), ('Chris','A','Johnson',8)
ON CONFLICT DO NOTHING;

INSERT INTO notes (student_id, teacher_id, title, body)
VALUES (1,1,'Reading Progress','Improved reading this week.'),
       (1,2,'Math Intervention','Needs help with fractions.'),
       (2,1,'Behavior','Excellent participation.');
