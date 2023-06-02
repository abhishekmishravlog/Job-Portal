const mongoose = require("mongoose");

let schema = new mongoose.Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["recruiter", "applicant"],
        required: true,
    },
},
    { collation: { locale: "en" } }
);

module.exports = mongoose.model("UserAuth", schema);
