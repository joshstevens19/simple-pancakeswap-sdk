"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyUnique = void 0;
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}
exports.onlyUnique = onlyUnique;
