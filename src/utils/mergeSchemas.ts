import fs from 'fs';
import path from 'path';

const baseFile = path.join(__dirname, '../..', 'models', 'basic', 'base.prisma');
const fragmentsDir = path.join(__dirname, '../..', 'models');
const outputFile = path.join(__dirname, '../..', 'prisma', 'schema.prisma');

const mergeSchemas = () => {
    try {
        let schema = fs.readFileSync(baseFile, 'utf-8');

        const fragmentFiles = fs
            .readdirSync(fragmentsDir)
            .filter(file => file.endsWith('.prisma'))
            .sort();

        for (const file of fragmentFiles) {
            const content = fs.readFileSync(path.join(fragmentsDir, file), 'utf-8');
            schema += `\n\n// ===== ${file} =====\n\n` + content;
        }

        fs.writeFileSync(outputFile, schema);
        console.log(`✅ schema.prisma has been generated at ${outputFile}`);
    } catch (err) {
        console.error('❌ Failed to merge schema files:', err);
        process.exit(1);
    }
};

mergeSchemas();
