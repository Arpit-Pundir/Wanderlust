# Wanderlust

Wanderlust is a full-stack Airbnb-style travel accommodation web application where users can explore property listings, create and manage their own listings, upload images, add reviews, view locations on maps, and use authentication-based features.

## Live Demo

https://wanderlust-71oj.onrender.com

## Features

- User signup, login, and logout
- Passport-based authentication
- Create, edit, and delete listings
- Listing ownership and authorization
- Upload listing images using Cloudinary
- Add and delete reviews
- Review author authorization
- Flash success and error messages
- MongoDB Atlas cloud database
- MongoDB-backed session store
- Mapbox geocoding
- Interactive map with markers and popups
- Responsive listing cards
- Category filter UI
- Tax display toggle
- Search bar UI
- Server-side validation using Joi
- Client-side Bootstrap validation
- Custom error handling
- Responsive UI built with Bootstrap

## Tech Stack

### Frontend
- HTML
- CSS
- Bootstrap
- EJS
- JavaScript
- Font Awesome

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- Passport.js
- passport-local
- passport-local-mongoose
- express-session
- connect-mongo

### Other Services
- MongoDB Atlas
- Cloudinary
- Mapbox
- Render

## Project Structure

```text
Wanderlust/
├── controllers/
├── init/
├── models/
├── public/
│   ├── css/
│   └── js/
├── routes/
├── utils/
├── views/
│   └── listings/
├── app.js
├── cloudConfig.js
├── middleware.js
├── schema.js
├── package.json
└── README.md
