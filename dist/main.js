"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const example_module_1 = require("./example/example.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(example_module_1.ExampleModule);
    await app.listen(3000);
    console.log('Application is running on: http://localhost:3000');
}
bootstrap();
//# sourceMappingURL=main.js.map