export const E2E_AUTH={
  tourist:{
    email:process.env.E2E_TOURIST_EMAIL||'turista@passaporte.local',
    password:process.env.E2E_TOURIST_PASSWORD||'turista-local',
  },
  partner:{
    email:process.env.E2E_PARTNER_EMAIL||'parceiro@passaporte.local',
    password:process.env.E2E_PARTNER_PASSWORD||'parceiro-local',
  },
  admin:{
    email:process.env.E2E_ADMIN_EMAIL||'admin@passaporte.local',
    password:process.env.E2E_ADMIN_PASSWORD||'admin-local',
  },
} as const;
