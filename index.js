const fs = require("fs");
const Stripe = require("stripe");
const STRIPE_TEST_SECRET_KEY =
  "sk_test_51MEuPXA69JWLHl3Jxw3gKWTtXJCOkzmvjDs5oJ45DZEHFzo5HLz5JfWkNvzU03eCyo0ojkiW2ot6WXA8udWEkh0300nAnoJmcj";
const stripe = Stripe(STRIPE_TEST_SECRET_KEY);

const CustomerUtils = require("./customer-utils");

/**
 * Open a JSON file and return a promise with the parsed data
 * @param {string} path - Path to the JSON file
 * @returns {Promise<any>} - Promise with the parsed data
*/
const openJsonFile = async (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

/**
 * Save a JSON file with the given data
 * @param {string} path - Path to the JSON file
 * @param {any} data - Data to save
 * @returns {Promise<void>} - Promise
 */
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
    // Using a utility function that retrieves customers from a specific country
    customers = CustomerUtils.filterByCountry(customers, country);

    // A simple check to see if there are customers from the given country
    if(customers.length === 0) throw new Error("No customers found for the given country");

    const countries = await openJsonFile("./countries-ISO3166.json");
    // Using a utility function that adds the country code to each customer object
    customers = CustomerUtils.addCountryCode(customers, countries);

    /* This function creates Stripe customers and returns an array of customers added to Stripe
       It uses the customer object from the previous step and the Stripe instance
    */
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
  // Slice the first two arguments because they are node and index.js (in most cases)
  const argv = process.argv.slice(2);
  const argc = argv.length;
  if (argc < 1) {
    console.warn("Usage: node index.js <country>");
    return;
  }
  const country = argv[0];
  await handler(country);
})();
