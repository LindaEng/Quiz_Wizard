# Solution

By Linda Eng / lindaeng@gmail.com

## Notes on implementation

- I used the boilerplate but had to fix some PostgreSQL syntax in the SQLite migrations to get things running.
- The database uses "assignments" table but I mapped it to "quizzes" in the frontend for better UX.
- I added email-only authentication to make the resume feature work across devices.
- Real-time saving was tricky but I got it working by updating the quiz_attempts table on every answer.
- The AI feedback integration was smooth using Stepful's API - just had to handle rate limiting gracefully.
- I went with a clean, modern UI inspired by educational platforms like Codecademy.
- Session management with cookies was the right choice for cross-device functionality.

## (If you didn't go with the boilerplate) Notes on design/architecture and rationale

*Used the provided boilerplate with React, TypeScript, Fastify, and SQLite.*

## Feedback for Stepful

### What I liked:
- The user stories were clear and well-defined.
- The boilerplate saved a lot of setup time.
- The free AI API access was really helpful.
- The flexibility in technology choices was appreciated.

### What could be improved:
- Some starter files had PostgreSQL syntax while the project uses SQLite.
- The authentication requirements weren't super clear initially.
- Could use more guidance on expected UI/UX quality.
- API endpoint documentation could be more detailed.

### Comparison to other takehomes:
This was well-structured and focused on real-world skills rather than just algorithm challenges.

## Anything else you'd like us to know?

I'm passionate about building user-friendly applications that solve real problems.

