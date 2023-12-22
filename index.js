const fs = require("fs");
const Stripe = require("stripe");
const STRIPE_TEST_SECRET_KEY =
  "sk_test_51MEuPXA69JWLHl3Jxw3gKWTtXJCOkzmvjDs5oJ45DZEHFzo5HLz5JfWkNvzU03eCyo0ojkiW2ot6WXA8udWEkh0300nAnoJmcj";
const stripe = Stripe(STRIPE_TEST_SECRET_KEY);

const CustomerUtils = require("./customer-utils");

const openJsonFile = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

const saveJsonToFile = async (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data), (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

const handler = async (country) => {
  try {
    let finalCustomers = [];

    let customers = await openJsonFile("./customers.json");
    customers = CustomerUtils.sortByCountry(customers, country);

    const countries = await openJsonFile("./countries-ISO3166.json");
    customers = CustomerUtils.addCountryCode(customers, countries);

    finalCustomers = await CustomerUtils.createStripeCustomers(
      customers,
      stripe
    );

    console.table(finalCustomers);
    await saveJsonToFile("./final-customers.json", finalCustomers);
  } catch (e) {
    throw e;
  }
};

(async () => {
  const argv = process.argv.slice(2);
  const argc = argv.length;
  if (argc < 1) {
    console.warn("Usage: node index.js <country>");
    return;
  }
  const country = argv[0];
  await handler(country);
})();
