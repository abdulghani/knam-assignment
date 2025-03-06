/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  // initialize populate data
  await knex.raw(`
    INSERT INTO "reports" ("id", "status", "scheduled_at", "processed_at", "created_at", "updated_at") VALUES
      ('01JNN3FWQTWVSMBAVNZJBWCNPD',	'scheduled',	'2021-09-30 10:00:00+00',	NULL,	'2025-03-06 06:50:06.46292+00',	'2025-03-06 06:50:06.46292+00'),
      ('01JNN3H4J5AZQKWDMMTS0A5GSS',	'scheduled',	'2021-09-30 10:00:00+00',	NULL,	'2025-03-06 06:50:47.239384+00',	'2025-03-06 06:50:47.239384+00'),
      ('01JNN3FVXSX63VKRHG1ZJ2MDW3',	'cancelled',	'2021-09-30 10:00:00+00',	NULL,	'2025-03-06 06:50:05.639221+00',	'2025-03-06 06:50:05.639221+00'),
      ('01JNN4DCY5SH2X7F1QZDY7M8YP',	'cancelled',	NULL,	NULL,	'2025-03-06 07:06:13.32498+00',	'2025-03-06 07:06:13.32498+00');
    `);
};

exports.down = async function (knex) {};
