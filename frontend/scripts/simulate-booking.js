/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const values = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();
    values[key] = value;
  }

  return values;
}

async function findFirstProfile(supabase, roleLike) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('role', roleLike)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Profile lookup failed (${roleLike}): ${error.message}`);
  }

  return data;
}

async function createProfileIfNeeded(supabase, profile) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select('*')
    .maybeSingle();

  if (error) {
    throw new Error(`Profile creation failed (${profile.role}): ${error.message}`);
  }

  return data;
}

async function main() {
  const envPath = path.join(process.cwd(), '.env.local');
  const env = loadEnv(envPath);
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local');
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log(`Using Supabase: ${supabaseUrl}`);

  let customer = null;
  let technician = null;

  try {
    customer = await findFirstProfile(supabase, '%customer%');
  } catch (error) {
    console.log(`Customer profile lookup skipped: ${error.message}`);
  }

  if (!customer) {
    try {
      customer = await findFirstProfile(supabase, '%user%');
    } catch (error) {
      console.log(`Fallback customer lookup skipped: ${error.message}`);
    }
  }

  try {
    technician = await findFirstProfile(supabase, '%technician%');
  } catch (error) {
    console.log(`Technician profile lookup skipped: ${error.message}`);
  }

  if (!customer) {
    console.log('No customer profile found, attempting to create one.');
    customer = await createProfileIfNeeded(supabase, {
      full_name: 'Test Customer',
      role: 'customer',
      email: `test.customer.${Date.now()}@local.test`,
    });
    console.log(`Created customer profile: ${customer.id}`);
  } else {
    console.log(`Using customer profile: ${customer.id}`);
  }

  if (!technician) {
    console.log('No technician profile found, attempting to create one.');
    technician = await createProfileIfNeeded(supabase, {
      full_name: 'Test Technician',
      role: 'technician',
      email: `test.technician.${Date.now()}@local.test`,
    });
    console.log(`Created technician profile: ${technician.id}`);
  } else {
    console.log(`Using technician profile: ${technician.id}`);
  }

  const bookingPayload = {
    customer_id: customer.id,
    technician_id: null,
    service_name: 'Test: Screen Repair',
    service_type: 'Screen Repair',
    address: '123 Test Street, Demo City',
    status: 'Pending',
    eta_minutes: 15,
    booking_date: new Date().toISOString(),
    last_updated_at: new Date().toISOString(),
  };

  console.log('Creating booking...');
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert(bookingPayload)
    .select('*')
    .maybeSingle();

  if (insertError) {
    throw new Error(`Booking insert failed: ${insertError.message}`);
  }

  console.log(`Booking created: ${booking.id}`);
  console.log(JSON.stringify(booking, null, 2));

  const states = ['Assigned', 'On The Way', 'Repairing', 'Completed'];

  for (const status of states) {
    console.log(`Updating booking to ${status}...`);
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status,
        technician_id: technician.id,
        last_updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new Error(`Booking update failed (${status}): ${error.message}`);
    }

    console.log(`Updated: ${data.id} -> ${data.status}`);
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  console.log('Simulation finished successfully.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exitCode = 1;
});
