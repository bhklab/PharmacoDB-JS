exports.up = function (knex) {
    return knex.schema.hasTable('profile').then(exists => {
        if (!exists) {
            return knex.schema.createTable('profile', table => {
                table.integer('experiment_id').unsigned().notNullable();
                table.string('HS');
                table.string('Einf');
                table.string('EC50');
                table.string('AAC');
                table.string('IC50');
                table.string('DSS1');
                table.string('DSS2');
                table.string('DSS3');
                table.foreign('experiment_id').references('id').inTable('experiment');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('profile');
};