const fs = require('fs');
const path = require('path');

const schemaHeader = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

const modelDir = path.join(__dirname, 'models');
const modelFiles = fs.readdirSync(modelDir);

const mergedModels = modelFiles.map((file) => fs.readFileSync(path.join(modelDir, file), 'utf8')).join('\n\n');

fs.writeFileSync(path.join(__dirname, 'schema.prisma'), schemaHeader + '\n' + mergedModels);
