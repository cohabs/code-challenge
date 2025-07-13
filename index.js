const fs = require('fs')
const Stripe = require('stripe');
const STRIPE_TEST_SECRET_KEY = 'sk_test_51MEuPXA69JWLHl3Jxw3gKWTtXJCOkzmvjDs5oJ45DZEHFzo5HLz5JfWkNvzU03eCyo0ojkiW2ot6WXA8udWEkh0300nAnoJmcj'
const stripe = Stripe(STRIPE_TEST_SECRET_KEY);
const {
  readJsonFile,
  writeJsonFile,
  filterCustomersByCountry,
  transformCustomers,
  createStripeCustomers
} = require('./utils');

const handler = async (country) => {
  try {
    let finalCustomers = []

    // filter the customers by country
    const customers = await readJsonFile('customers.json');
    const filteredCustomers = filterCustomersByCountry(customers, country);

    // transform customers to save into Stripe
    const countryMapping = await readJsonFile('countries-ISO3166.json');
    const transformedCustomers = transformCustomers(filteredCustomers, countryMapping);

    // for each customer create a Stripe customer
    const stripeCustomers = await createStripeCustomers(stripe, transformedCustomers);

    // push into finalCustomers the stripe customers with email, country and id as properties.
    finalCustomers.push(...stripeCustomers);

    // write finalCustomers array into final-customers.json using fs
    writeJsonFile('final-customers.json', finalCustomers);

    // log the finalCustomers array
    console.log(finalCustomers)
  } catch (e) {
    throw e;
  }
}

handler('Spain');