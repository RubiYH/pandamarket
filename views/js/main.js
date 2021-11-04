module.exports = function (app) {
  app.get("/main", async (req, res) => {
    res.render("main", {
      req: req,
      res: res,
    });
  });
};
