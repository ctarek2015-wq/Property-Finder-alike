# PropertySeeker

![Property detail page wireframe](./public/wireframe/property-page.png)

PropertySeeker is a real estate marketplace for people looking to buy or rent
homes in Bahrain. Seekers can browse and filter listings, inspect property
images, book viewing appointments, and leave reviews after a completed visit.
Owners can create and manage listings, upload property images, set viewing
availability, and manage their upcoming appointments.

This project was built to make the property search experience more focused and
useful for both sides of the marketplace, with dashboards and workflows that
match each user's role.

## Features

- Owner and seeker registration with role-specific dashboards.
- Property listings for sale or rent with details such as price, location,
  bedrooms, bathrooms, and area.
- Property image and floorplan uploads through Cloudinary.
- Search, filtering, and pagination for property listings.
- Viewing appointment availability and scheduling.
- Appointment management for property owners.
- Reviews and ratings for seekers after completed viewings.
- Profile management and password reset emails.

## Getting Started

### Deployed App

[Open the deployed PropertySeeker app](https://propertyseeker.onrender.com/)

### Local Setup

Prerequisites:

- Node.js 20 or later.
- A MongoDB database.
- Cloudinary credentials for image uploads.
- An email account or SMTP provider for notifications and password resets.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the required configuration:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   EMAIL_USER=your_email_address
   EMAIL_APP_PASSWORD=your_email_app_password
   CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
   PORT=3000
   NODE_ENV=development
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

   The app runs at `http://localhost:3000` by default.

### Seed Mock Properties

Set `MONGODB_URI` to a development database, then run:

```bash
npm run seed:mockdata
```

This creates fifteen properties with four remote images each, five Bahraini
owners, and viewing appointment availability. All seeded owners use the
password `MockOwner123!`; their emails are listed in
[`mockdata/properties.js`](./mockdata/properties.js).

## Planning Materials

- [Role-specific dashboard wireframes](./public/wireframe/roles-dashboards.png)
- [Property detail page wireframe](./public/wireframe/property-page.png)
- [Property search results wireframe](./public/wireframe/search-results.png)
- [Global navigation wireframe](./public/wireframe/global-navbar.png)
- [Database entity relationship diagram](./public/erd/ERD.png)

![Database entity relationship diagram](./public/erd/ERD.png)

## Technologies Used

- JavaScript and Node.js.
- Express 5 for the web server and routing.
- EJS for server-rendered views.
- MongoDB and Mongoose for data storage.
- Cloudinary and Multer for image uploads.
- Express Session and Connect Mongo for authentication sessions.
- bcryptjs for password hashing.
- Nodemailer for email notifications and password resets.
- Morgan, method-override, dotenv, and Nodemon for supporting development.

## Attributions

- [Google Fonts](https://fonts.google.com/) provides the Manrope and Space
  Grotesk typefaces used by the interface.
- Brave image-search result URLs provide the remote demo property images used by
  the mock property data. Image rights remain subject to each original source.
- [Cloudinary](https://cloudinary.com/) provides image hosting and delivery for
  uploaded property media.

## Next Steps

- Add a first-visit onboarding message to introduce the Owner and Seeker
  workflows.
- Add loading screens and feedback states while listings, images, and forms are
  being processed.
