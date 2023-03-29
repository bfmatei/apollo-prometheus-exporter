"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEndpoint = void 0;
const prom_client_1 = require("prom-client");
function registerEndpoint({ register, app, path }) {
    const actualRegister = register !== null && register !== void 0 ? register : prom_client_1.register;
    app.get(path !== null && path !== void 0 ? path : '/metrics', async (_req, res) => {
        try {
            res.set('Content-Type', actualRegister.contentType);
            res.end(await actualRegister.metrics());
        }
        catch (err) {
            res.status(500).end(err);
        }
    });
}
exports.registerEndpoint = registerEndpoint;
//# sourceMappingURL=endpoint.js.map