"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._sayHello = void 0;
/**
 * Say Hello!
 *
 * @param name
 */
const _sayHello = (name) => {
    name = name?.length ? name : 'Thuku';
    const hello = `[x] - Hello ${name}!`;
    console.log(hello);
    return hello;
};
exports._sayHello = _sayHello;
//# sourceMappingURL=_hello.js.map