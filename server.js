const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const ticketRoutes = require('./routes/ticket');
const scheduleRoutes = require('./routes/schedule');

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/schedules', scheduleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on "${PORT}"`));
