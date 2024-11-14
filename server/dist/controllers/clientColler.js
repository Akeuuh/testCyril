"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClient = exports.getClientById = exports.getClients = void 0;
const clients = [
    {
        id: "C-00003",
        nom: "DOMINGUEZ Roger",
        email: "roger@dominguez.fr",
        tel: "02 34 56 78 90",
        adresse: "836 rue du Mas de Verchant",
        code_postal: "34000",
        ville: "MONTPELLIER",
    },
];
const getClients = (req, res) => {
    const { nom, ville, sort, fields, limit } = req.query;
    let filteredClients = [...clients];
    if (nom) {
        filteredClients = filteredClients.filter((client) => client.nom.toLowerCase().includes(nom.toLowerCase()));
    }
    if (ville) {
        filteredClients = filteredClients.filter((client) => client.ville.toLowerCase().includes(ville.toLowerCase()));
    }
    if (sort) {
        const sortParams = sort.split(",");
        sortParams.forEach((param) => {
            const isDesc = param.startsWith("-");
            const field = isDesc ? param.slice(1) : param;
            filteredClients.sort((a, b) => {
                const aValue = a[field];
                const bValue = b[field];
                return isDesc
                    ? String(bValue).localeCompare(String(aValue))
                    : String(aValue).localeCompare(String(bValue));
            });
        });
    }
    let selectedClients = filteredClients;
    if (fields) {
        const selectedFields = fields.split(",");
        selectedClients = filteredClients.map((client) => {
            const selectedClient = { id: client.id };
            selectedFields.forEach((field) => {
                const clientField = field;
                if (client[clientField]) {
                    selectedClient[clientField] = client[clientField];
                }
            });
            return selectedClient;
        });
    }
    if (limit) {
        selectedClients = selectedClients.slice(0, parseInt(limit));
    }
    res.json({
        code: 200,
        message: "",
        datas: selectedClients,
        warnings: [],
    });
};
exports.getClients = getClients;
const getClientById = (req, res) => {
    const client = clients.find((c) => c.id === req.params.id);
    if (!client) {
        res.status(404).json({
            code: 404,
            message: "Client not found",
            datas: null,
            warnings: [],
        });
        return;
    }
    res.json({
        code: 200,
        message: "",
        datas: client,
        warnings: [],
    });
};
exports.getClientById = getClientById;
const updateClient = (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    const clientIndex = clients.findIndex((c) => c.id === id);
    if (clientIndex === -1) {
        res.status(404).json({
            code: 404,
            message: "Client not found",
            datas: null,
            warnings: [],
        });
        return;
    }
    if (updateData.nom !== undefined && !updateData.nom.trim()) {
        res.status(400).json({
            code: 400,
            message: "Name cannot be empty",
            datas: null,
            warnings: [],
        });
        return;
    }
    const updatedClient = {
        ...clients[clientIndex],
        ...updateData,
    };
    clients[clientIndex] = updatedClient;
    res.json({
        code: 200,
        message: "",
        datas: updatedClient,
        warnings: [],
    });
};
exports.updateClient = updateClient;
//# sourceMappingURL=clientColler.js.map