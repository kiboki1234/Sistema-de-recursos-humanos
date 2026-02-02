const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const fixUsers = async () => {
    try {
        console.log("Conectando a MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Conectado.");

        // Poner isActive: true a todos los que no lo tengan
        console.log("Actualizando usuarios sin campo isActive...");
        const result = await User.updateMany(
            { isActive: { $exists: false } },
            { $set: { isActive: true } }
        );

        console.log(`Operación completada. Usuarios actualizados: ${result.modifiedCount}`);

        // Verificación
        const activeCount = await User.countDocuments({ isActive: true });
        console.log(`Total usuarios activos ahora: ${activeCount}`);

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

fixUsers();
