const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const organizerRoutes = require('./routes/organizerRoutes');
const respondentRoutes = require('./routes/respondentRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const attributeRoutes = require('./routes/attributeRoutes');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors()); // Allow all origins

// OR if you want to be specific:
app.use(cors({
    origin: 'http://localhost:4200'
}));

// Routes
app.use('/api/organizers', organizerRoutes);
app.use('/api/respondents', respondentRoutes);
app.use('/api/orgs', organizationRoutes);
app.use('/api/orgs', attributeRoutes);

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
