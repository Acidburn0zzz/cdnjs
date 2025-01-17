"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
const MoveType_1 = require("../../Enums/MoveType");
class Move {
    constructor() {
        this.radius = 10;
        this.type = MoveType_1.MoveType.path;
    }
    load(data) {
        if (data !== undefined) {
            if (data.radius !== undefined) {
                this.radius = data.radius;
            }
            if (data.type !== undefined) {
                this.type = data.type;
            }
        }
    }
}
exports.Move = Move;
