const Team = require('../models/Team');
const User = require('../models/User');

// Crear un nuevo equipo
exports.createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const leaderId = req.user.id;

        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
            return res.status(400).json({ message: "Ya existe un equipo con ese nombre" });
        }

        const newTeam = new Team({
            name,
            description,
            leader: leaderId,
            members: []
        });

        await newTeam.save();
        res.status(201).json({ message: "Equipo creado exitosamente", team: newTeam });
    } catch (error) {
        res.status(500).json({ message: "Error al crear equipo", error: error.message });
    }
};

// Obtener equipos del líder actual
exports.getMyTeams = async (req, res) => {
    try {
        const leaderId = req.user.id;
        const teams = await Team.find({ leader: leaderId }).populate('members', 'name email role phone student_id');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener equipos", error: error.message });
    }
};

// Obtener TODOS los equipos (Para Presidentes/VPs)
exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('members', 'name email role phone student_id').populate('leader', 'name');
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener todos los equipos", error: error.message });
    }
};

// Obtener un equipo por ID (Público/Protegido para ver miembros)
exports.getTeamById = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id).populate('members', 'name email role phone student_id');

        if (!team) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener equipo", error: error.message });
    }
};

// Agregar miembro al equipo
exports.addMember = async (req, res) => {
    try {
        const { teamId, memberId } = req.body;

        const team = await Team.findOne({ _id: teamId, leader: req.user.id });
        if (!team) {
            return res.status(404).json({ message: "Equipo no encontrado o no autorizado" });
        }

        // Verificar si el miembro ya está en el equipo
        if (team.members.includes(memberId)) {
            return res.status(400).json({ message: "El miembro ya está en este equipo" });
        }

        // Verificar si el miembro existe y es válido (opcional, pero recomendado)
        const member = await User.findById(memberId);
        if (!member || member.role !== 'member') {
            return res.status(400).json({ message: "Usuario inválido para agregar al equipo" });
        }

        team.members.push(memberId);
        await team.save();

        // Opcional: Actualizar el campo assignedLeader del usuario para mantener consistencia
        if (!member.assignedLeader) {
            member.assignedLeader = req.user.id;
            await member.save();
        }

        res.status(200).json({ message: "Miembro agregado exitosamente", team });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar miembro", error: error.message });
    }
};

// Remover miembro del equipo
exports.removeMember = async (req, res) => {
    try {
        const { teamId, memberId } = req.body;

        const team = await Team.findOne({ _id: teamId, leader: req.user.id });
        if (!team) {
            return res.status(404).json({ message: "Equipo no encontrado o no autorizado" });
        }

        team.members = team.members.filter(id => id.toString() !== memberId);
        await team.save();

        // Verificar si remover assignedLeader logic...
        const otherTeams = await Team.find({ leader: req.user.id, members: memberId });
        if (otherTeams.length === 0) {
            const member = await User.findById(memberId);
            if (member && member.assignedLeader && member.assignedLeader.toString() === req.user.id) {
                member.assignedLeader = null;
                await member.save();
            }
        }

        res.status(200).json({ message: "Miembro removido exitosamente", team });
    } catch (error) {
        res.status(500).json({ message: "Error al remover miembro", error: error.message });
    }
};

// Eliminar equipo
exports.deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findOneAndDelete({ _id: id, leader: req.user.id });

        if (!team) {
            return res.status(404).json({ message: "Equipo no encontrado" });
        }
        res.status(200).json({ message: "Equipo eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar equipo", error: error.message });
    }
};
