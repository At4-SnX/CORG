import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';

const file = path.join(config.dataDir, 'nigend.json');
fs.mkdirSync(config.dataDir, { recursive: true });

// { [userId]: { nigend, prenom, nom, date } }
let data = {};
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch {
  data = {};
}

const save = () => fs.writeFileSync(file, JSON.stringify(data, null, 2));

export const getByUser = (userId) => data[userId] ?? null;
export const isTaken = (nigend) => Object.values(data).some((e) => e.nigend === nigend);

export function register(userId, entry) {
  data[userId] = { ...entry, date: new Date().toISOString() };
  save();
}
