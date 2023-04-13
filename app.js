const express = require("express");
const cors = require("cors");
const contactsRouter = require("./app/routes/product.route");
const newsRouter = require("./app/routes/news.route");
const ApiError = require("./app/api-error");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/api/news", newsRouter);
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to contact book application."
    });
});
// handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    });
});
    



module.exports = app;