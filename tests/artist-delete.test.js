// tests/artist-delete.test.js
const { expect } = require("chai");
const request = require("supertest");
const getDb = require("../src/services/db");
const app = require("../src/app");

describe("delete artist", () => {
  let db;
  let artists;
  beforeEach(async () => {
    db = await getDb();
    await Promise.all([
      db.query("INSERT INTO Artists (name, genre) VALUES($1, $2)", [
        "Tame Impala",
        "rock",
      ]),
      db.query("INSERT INTO Artists (name, genre) VALUES($1, $2)", [
        "Kylie Minogue",
        "pop",
      ]),
      db.query("INSERT INTO Artists (name, genre) VALUES($1, $2)", [
        "Dave Brubeck",
        "jazz",
      ]),
    ]);

    const results = await db.query("SELECT * from Artists");
    artists = results.rows;
  });

  afterEach(async () => {
    await db.query("DELETE FROM Artists");
  });

  describe("/artist/:artistId", () => {
    describe("DELETE", () => {
      it("deletes a single artist with the correct id", async () => {
        const artist = artists[0];
        const res = await request(app).delete(`/artists/${artist.id}`).send();
        expect(res.status).to.equal(200);

        const deletedArtistRecord = await db.query(
          "SELECT * FROM Artists WHERE id = $1",
          [artist.id]
        );
        expect(deletedArtistRecord.rows.length).equal(0);
      });

      it("returns a 404 if the artist is not in the database", async () => {
        const res = await request(app).delete("/artist/999999").send();
        expect(res.status).to.equal(404);
      });
    });
  });
});
