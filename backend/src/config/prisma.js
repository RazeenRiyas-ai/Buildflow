require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// Bypassing the prisma+postgres proxy (port 51213) which fails with node-postgres.
// Connecting directly to the underlying Postgres instance on port 51214.
// We also force sslmode=disable to prevent connection termination.
const connectionString = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
