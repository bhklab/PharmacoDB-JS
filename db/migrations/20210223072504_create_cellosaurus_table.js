exports.up = function (knex) {
    return knex.schema.hasTable('cellosaurus').then(exists => {
        if (!exists) {
            return knex.schema.createTable('cellosaurus', table => {
                table.increments('id').primary();
                table.integer('cell_id').unsigned().notNullable();
                table.string('identifier').notNullable();
                table.string('accession').notNullable();
                table.string('as');
                table.string('sy');
                table.text('dr');
                table.text('rx');
                table.text('ww');
                table.text('cc');
                table.text('st');
                table.string('di');
                table.string('ox');
                table.string('hi');
                table.text('oi');
                table.string('sx');
                table.string('ca');
                table.foreign('cell_id').references('id').inTable('cell');
            });
        }
    });
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists('cellosaurus');
};
