import knex from "knex"

export default knex({
    client: "sqlite3",
    connection: {
        filename: "./utils/db.sqlite"
    },
    pool: {
        afterCreate: (db, cb) => {
            db.run("PRAGMA foreign_keys = ON", cb)
        }
    },
    useNullAsDefault: true
})
