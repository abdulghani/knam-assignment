# REST API Report application

## Overview
This project is a RESTful API built using Hono, PgBoss, and Knex to manage report and schedule generation. The system allows users to request reports either immediately or on a schedule, processes them asynchronously using a queue, and provides status updates on requested reports.

## Setup Instructions
### Prerequisites
Ensure you have the following installed:
- Node.js (>=v20.18.3)
- Docker and Docker compose (>=27.5.1)

### Installation
1. Clone the repository:
   ```sh
   git clone git@github.com:abdulghani/knam-assignment.git
   cd knam-assignment
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

The API should be served in `http://localhost:3000` with the default `.env` provided

## Design Choices
- **Hono over Express**: Identical API with helper packages for documentations.
- **PgBoss for Job Queue**: Ensures reliable scheduling and processing of reports.
- **Knex for Database Access**: Simplifies SQL queries and improves maintainability.
- **TypeScript**: Provides type safety and better code organization.

## Assumptions
- Reports are processed asynchronously and not immediately available.
- Cancellation only works before the report is processed.

## Future Improvements
- Implement authentication and authorization.
- Add unit and integration tests.

