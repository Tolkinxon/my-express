import path from "node:path";

export const serverConfig = {
    dbPath: (fileName) => path.join(process.cwd(), 'db', fileName + '.json')
    
}