const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

const connectDB = require('./config/connectDB');
connectDB();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.use('/api/upload', require('./routes/upload'));
app.use('/api/user', require('./routes/user'));
app.use('/api/destination', require('./routes/destination'));
app.use('/api/voyage', require('./routes/voyage'));
app.use('/api/hotel', require('./routes/hotel'));
app.use('/api/reservation', require('./routes/reservation'));
app.use('/api/promotion', require('./routes/promotion'));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/contact", require("./routes/contact"));
app.use('/api/annonce', require('./routes/annonce'));
app.use("/api/chat", require("./routes/chatRoute"));
app.use("/api/recommendations", require("./routes/recommendation"));

const PORT = process.env.PORT;

app.listen(PORT, (err) =>
    err ? console.log(err) : console.log(`Server is running on port ${PORT} .. `)
);