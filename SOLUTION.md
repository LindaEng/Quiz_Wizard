# Solution

By Linda Eng/90lineng@gmail.com

## Notes on implementation

The database uses a table called `assignments` with a `title` column, but in the frontend, it made more sense to refer to these as `quizzes` with a `name` field.

To keep things consistent in the UI without changing the database schema, I updated the `/quizzes` endpoint to:

- Query `id` and `title` from the `assignments` table
- Map the result so that `title` becomes `name`

This keeps the backend and frontend aligned without changing any table or column names.

- I also ran into a small issue with seeding due to SQLite’s limited support for the VALUES (...) AS alias(...) syntax inside SELECT. I rewrote the seed to use explicit INSERT statements to fix that and preserve compatibility with the SQLite setup in the boilerplate.


- I decided to prefix all backend API routes with `/api` (e.g., `/api/quizzes`) for clarity and maintainability.  
Using an `/api` prefix is considered best practice because it clearly separates API endpoints from frontend routes, making it easier to distinguish between server-rendered pages and data endpoints. This approach also helps avoid potential route conflicts and keeps the application's routing structure organized as the project grows.


## (If you didn't go with the boilerplate) Notes on design/architecture and rationale
_Please leave notes for what languages / frameworks you chose, and why._
_Please leave instructions for how to run your solution locally._

## Feedback for Stepful
_Please feel free to share feedback with us! What you liked or didn't like, how this takehome compares to others you've taken in the past_

## Anything else you'd like us to know?
Not required, but we love learning about what you're passionate about, so if you link us a personal blog or website, or anything else that you've written, we'd love to check them out!
