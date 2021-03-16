exports.up = function (knex) {
    return knex.schema.hasTable('profile').then(exists => {
        if (!exists) {
            return knex.schema.createTable('profile', table => {
                table.integer('experiment_id').unsigned().notNullable();
                table.float('HS', 12, 6);
                table.float('Einf', 12, 6);
                table.float('EC50', 12, 6);
                table.float('AAC', 12, 6);
                table.float('IC50', 12, 6);
                table.float('DSS1', 12, 6);
                table.float('DSS2', 12, 6);
                table.float('DSS3', 12, 6);
                table.foreign('experiment_id').references('id').inTable('experiment');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('profile');
};