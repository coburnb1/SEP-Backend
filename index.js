const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const organizerRoutes = require('./routes/organizerRoutes');
const respondentRoutes = require('./routes/respondentRoutes');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use('/api/organizers', organizerRoutes);
app.use('/api/respondents', respondentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));