const Sequelize = require('sequelize');
const ReaderModel = require('./reader');
const BookModel = require('./book');
const GenreModel = require('./genre');

const { PGDATABASE, PGUSER, PGPASSWORD, PGHOST, PGPORT } = process.env;

const setupDatabase = () => {
  const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    host: PGHOST,
    port: PGPORT,
    dialect: 'postgres',
    logging: false,
  });

  const Reader = ReaderModel(sequelize, Sequelize);
  const Book = BookModel(sequelize, Sequelize);
  const Genre = GenreModel(sequelize, Sequelize);

  Genre.hasMany(Book);
  Book.belongsTo(Genre);

  sequelize.sync({ alter: true });
  return {
    Reader,
    Book,
    Genre,
  };
};

module.exports = setupDatabase();
