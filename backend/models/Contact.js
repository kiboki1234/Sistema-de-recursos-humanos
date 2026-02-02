const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        maxLength: 15,
        validate: {
            validator: function (v) {
                return /^\+?\d{7,15}$/.test(v);  // Validación para números internacionales
            },
            message: props => `${props.value} no es un número de teléfono válido!`,
        },
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
