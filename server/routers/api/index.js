const api = require("express").Router();
const authApiRequest = require("./middleware/authApiRequest");
const Shop = require("../../models/shop");

//api authentication
api.use(authApiRequest); // 8884406893

//Api Routes
// api.get("/1", (req, res) => {
//   res.json({ hi: "from first api" });
// });
// api.get("/2", (req, res) => {
//   res.json({ hi: "from second api" });
// });

api.get("/check12", async (req, res) => {
  // console.log("REQ", req);
  const shopOrigin = req.query.shop;
  console.log("SO", shopOrigin);
  const newShop = shopOrigin.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);

  //const request = req.params.object;
  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token", newAccessToken);

  const url1 = `https://${shopOrigin}/admin/api/2021-10/checkouts.json`;
  console.log(url1);

  try {
    const results = await fetch(url1, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": newAccessToken,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        return json;
      });
    const response = {
      status: "success",
      data: results,
    };
    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

api.get("/shop12", async (req, res) => {
  const shopOrigin = req.query.shop;
  console.log("SO", shopOrigin);
  const newShop = shopOrigin.split(".");
  const newShop12 = newShop[0];
  console.log("newShop12", newShop12);
  const request12 = req.params.object;

  const newAccess = await Shop.find(
    { shop: newShop12 },
    {
      accessToken: 1,
      _id: 0,
    }
  );
  console.log("newAccess", newAccess);
  const newAccessToken = newAccess[0].accessToken;
  console.log("Token", newAccessToken);

  const url = `https://${shopOrigin}/admin/api/2021-10/shop.json`;
  console.log(url);

  try {
    const results12 = await fetch(url, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": newAccessToken,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
        return json;
      });
    const response = {
      status: "success",
      data: results12,
    };
    res.send(response);
  } catch (err) {
    console.log(err);
  }
});

module.exports = api;
