/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.createTableIfNotExists("reports", (t) => {
    t.string("id").primary();
    t.string("status").defaultTo("pending").index();
    t.timestamp("scheduled_at").nullable().defaultTo(null).index();
    t.timestamp("processed_at").nullable().defaultTo(null);
    t.timestamp("created_at").defaultTo(knex.fn.now());
    t.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {};
