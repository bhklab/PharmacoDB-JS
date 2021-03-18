exports.up = function (knex) {
    return knex.schema.hasTable('profile').then(exists => {
        if (!exists) {
            return knex.schema.createTable('profile', table => {
                table.integer('experiment_id').unsigned().notNullable();
                table.decimal('HS', 65, 8);
                table.decimal('Einf', 65, 8);
                table.decimal('EC50', 65, 8);
                table.decimal('AAC', 65, 8);
                table.decimal('IC50', 65, 8);
                table.decimal('DSS1', 65, 8);
                table.decimal('DSS2', 65, 8);
                table.decimal('DSS3', 65, 8);
                table.foreign('experiment_id').references('id').inTable('experiment');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('profile');
};