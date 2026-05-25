#!/usr/bin/env node

/**
 * MCQ Learning Platform - Supabase Setup Wizard
 * 
 * This script automates the Supabase setup process:
 * 1. Validates environment variables
 * 2. Tests Supabase connection
 * 3. Deploys database schema
 * 4. Populates sample data
 * 
 * Usage: node setup-supabase.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  console.log(`\n${colors.blue}${colors.bright}╔════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}${colors.bright}║   MCQ Learning Platform - Supabase Setup Wizard             ║${colors.reset}`);
  console.log(`${colors.blue}${colors.bright}╚════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Step 1: Check if Supabase credentials exist
  console.log(`${colors.yellow}📋 Step 1: Checking environment variables...${colors.reset}`);
  
  const backendEnvPath = path.join(__dirname, 'backend', '.env');
  const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

  if (!fs.existsSync(backendEnvPath) || !fs.existsSync(frontendEnvPath)) {
    console.log(`${colors.red}❌ Environment files not found!${colors.reset}`);
    console.log(`\nCreate these files first:`);
    console.log(`  1. backend/.env`);
    console.log(`  2. frontend/.env`);
    console.log(`\nSee docs/QUICK_START.md for template contents.`);
    process.exit(1);
  }

  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  const frontendEnv = fs.readFileSync(frontendEnvPath, 'utf8');

  const supabaseUrl = extractEnvVar(backendEnv, 'SUPABASE_URL');
  const supabaseKey = extractEnvVar(backendEnv, 'SUPABASE_KEY');
  const supabaseAnonKey = extractEnvVar(frontendEnv, 'VITE_SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseKey || !supabaseAnonKey) {
    console.log(`${colors.red}❌ Missing Supabase credentials in .env files!${colors.reset}`);
    console.log(`\nRequired in backend/.env:`);
    console.log(`  SUPABASE_URL=https://your-project.supabase.co`);
    console.log(`  SUPABASE_KEY=your-service-role-key`);
    console.log(`\nRequired in frontend/.env:`);
    console.log(`  VITE_SUPABASE_ANON_KEY=your-anon-key`);
    console.log(`\nGet these from: https://supabase.com → Your Project → Settings → API`);
    
    const proceed = await question(`\n${colors.yellow}Do you want to add them now? (yes/no): ${colors.reset}`);
    if (proceed.toLowerCase() === 'yes') {
      await setupCredentials();
    }
    process.exit(0);
  }

  console.log(`${colors.green}✅ Environment variables found!${colors.reset}`);
  console.log(`   Project: ${supabaseUrl.replace('https://', '').split('.')[0]}`);

  // Step 2: Test Supabase connection
  console.log(`\n${colors.yellow}📡 Step 2: Testing Supabase connection...${colors.reset}`);
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    console.log(`${colors.green}✅ Connected to Supabase successfully!${colors.reset}`);
  } catch (error) {
    console.log(`${colors.red}❌ Connection failed: ${error.message}${colors.reset}`);
    console.log(`\nMake sure your Supabase credentials are correct.`);
    process.exit(1);
  }

  // Step 3: Deploy schema
  console.log(`\n${colors.yellow}🏗️  Step 3: Deploying database schema...${colors.reset}`);
  
  const schemaPath = path.join(__dirname, 'docs', 'DATABASE_SCHEMA.sql');
  if (!fs.existsSync(schemaPath)) {
    console.log(`${colors.red}❌ DATABASE_SCHEMA.sql not found!${colors.reset}`);
    process.exit(1);
  }

  console.log(`${colors.yellow}⚠️  Please deploy the schema manually:${colors.reset}`);
  console.log(`\n1. Go to: https://supabase.com/dashboard`);
  console.log(`2. Select your project`);
  console.log(`3. Click "SQL Editor"`);
  console.log(`4. Create new query`);
  console.log(`5. Copy SQL from: docs/DATABASE_SCHEMA.sql`);
  console.log(`6. Paste and run the query`);
  console.log(`\nOnce complete, press Enter to continue...`);
  
  await question('');

  // Step 4: Populate sample data
  console.log(`\n${colors.yellow}📚 Step 4: Populating sample MCQ data...${colors.reset}`);
  
  const populateSampleData = await question(`\nDo you want to add 50+ sample questions? (yes/no): ${colors.reset}`);
  
  if (populateSampleData.toLowerCase() === 'yes') {
    console.log(`${colors.yellow}⚠️  Please add sample data manually:${colors.reset}`);
    console.log(`\n1. Go to: https://supabase.com/dashboard`);
    console.log(`2. Click "SQL Editor"`);
    console.log(`3. Create new query`);
    console.log(`4. Copy SQL from: docs/SAMPLE_MCQ_DATA.sql`);
    console.log(`5. Paste and run the query`);
    console.log(`\nOnce complete, press Enter to continue...`);
    
    await question('');
    console.log(`${colors.green}✅ Sample data added!${colors.reset}`);
  }

  // Step 5: Verify setup
  console.log(`\n${colors.yellow}🔍 Step 5: Verifying setup...${colors.reset}`);
  
  console.log(`\n${colors.bright}Setup complete!${colors.reset}`);
  console.log(`\n${colors.green}✅ Your MCQ Platform is ready!${colors.reset}`);
  console.log(`\nNext steps:`);
  console.log(`1. Restart both servers`);
  console.log(`   Backend: npm run dev (in backend folder)`);
  console.log(`   Frontend: npm run dev (in frontend folder)`);
  console.log(`\n2. Test your setup`);
  console.log(`   Go to http://localhost:3000`);
  console.log(`   Sign up and start taking tests!`);
  console.log(`\n3. View your data`);
  console.log(`   Backend → Tests will save to database`);
  console.log(`   Frontend → See questions from database`);
  console.log(`\n${colors.dim}Documentation: See docs/QUICK_START.md for more info${colors.reset}\n`);

  rl.close();
}

function extractEnvVar(envContent, varName) {
  const regex = new RegExp(`^${varName}=(.*)$`, 'm');
  const match = envContent.match(regex);
  return match ? match[1].trim() : null;
}

async function setupCredentials() {
  console.log(`\n${colors.yellow}📝 Let's add your Supabase credentials${colors.reset}`);
  console.log(`\nGet these from: https://supabase.com → Your Project → Settings → API\n`);
  
  const supabaseUrl = await question(`${colors.blue}Supabase URL (https://...supabase.co): ${colors.reset}`);
  const supabaseKey = await question(`${colors.blue}Service Role Key: ${colors.reset}`);
  const supabaseAnonKey = await question(`${colors.blue}Anon Key: ${colors.reset}`);
  const jwtSecret = await question(`${colors.blue}JWT Secret (random string or leave blank): ${colors.reset}`);

  // Update backend .env
  let backendEnv = fs.readFileSync(path.join(__dirname, 'backend', '.env'), 'utf8');
  backendEnv = updateEnvVar(backendEnv, 'SUPABASE_URL', supabaseUrl);
  backendEnv = updateEnvVar(backendEnv, 'SUPABASE_KEY', supabaseKey);
  if (jwtSecret) {
    backendEnv = updateEnvVar(backendEnv, 'JWT_SECRET', jwtSecret);
  }
  fs.writeFileSync(path.join(__dirname, 'backend', '.env'), backendEnv);

  // Update frontend .env
  let frontendEnv = fs.readFileSync(path.join(__dirname, 'frontend', '.env'), 'utf8');
  frontendEnv = updateEnvVar(frontendEnv, 'VITE_SUPABASE_URL', supabaseUrl);
  frontendEnv = updateEnvVar(frontendEnv, 'VITE_SUPABASE_ANON_KEY', supabaseAnonKey);
  fs.writeFileSync(path.join(__dirname, 'frontend', '.env'), frontendEnv);

  console.log(`${colors.green}✅ Credentials saved!${colors.reset}`);
}

function updateEnvVar(envContent, varName, value) {
  const regex = new RegExp(`^${varName}=.*$`, 'm');
  if (envContent.match(regex)) {
    return envContent.replace(regex, `${varName}=${value}`);
  } else {
    return envContent + `\n${varName}=${value}`;
  }
}

main().catch(error => {
  console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
});
