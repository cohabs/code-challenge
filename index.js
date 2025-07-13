const fs = require('fs')
const Stripe = require('stripe');

// Import file utility functions
const { readJsonFile, writeJsonFile } = require('./utils/fileUtils');

// Import customer utility functions
const { filterCustomersByCountry, getCountryCode, formatStripeCustomer, createStripeCustomer} = require('./utils/customerUtils');

const STRIPE_TEST_SECRET_KEY = 'sk_test_51MEuPXA69JWLHl3Jxw3gKWTtXJCOkzmvjDs5oJ45DZEHFzo5HLz5JfWkNvzU03eCyo0ojkiW2ot6WXA8udWEkh0300nAnoJmcj'
const CUSTOMERS_FILE_PATH = './customers.json';
const FINAL_CUSTOMERS_FILE_PATH = './final-customers.json';
const COUNTRIES_ISO_FILE_PATH = './countries-ISO3166.json';

const stripe = Stripe(STRIPE_TEST_SECRET_KEY);

const handler = async (country) => {

  try{
    let finalCustomers = []

    /* add code below this line */

    // Load all customers and country mapping
    const allCustomers = await readJsonFile(CUSTOMERS_FILE_PATH);
    const countriesISO = await readJsonFile(COUNTRIES_ISO_FILE_PATH);

    // filter the customers by country
    const customersToProcess = filterCustomersByCountry(allCustomers, country);

    if (customersToProcess.length === 0) {
      console.log(`No customers found for country: ${country}`);
      // Always write the result in final-customers.json, even if empty for this country
      await writeJsonFile(FINAL_CUSTOMERS_FILE_PATH, []);
      console.log("Final customers array (empty):", finalCustomers);
      return;
    }

    // Get the two-letter country code for the target country
    const targetCountryCode = getCountryCode(country, countriesISO);

    if (!targetCountryCode) {
        console.error(`Could not find code for country: ${country} in the json.`);
        // Write an empty array 
        await writeJsonFile(FINAL_CUSTOMERS_FILE_PATH, []);
        console.log("Final customers array (empty due to country code issue):", finalCustomers);
        return;
    }

    // Process filtered customers
    for (const customer of customersToProcess) {
      try {
          // transform customers to save into Stripe
          const formattedCustomer = formatStripeCustomer(customer, targetCountryCode);

          // create a Stripe customer
          const createdStripeCustomer = await createStripeCustomer(stripe, formattedCustomer);

          // // push into finalCustomers the stripe customers with email, country and id as properties.
          finalCustomers.push({
              id: createdStripeCustomer.id,
              email: createdStripeCustomer.email,
              country: targetCountryCode
          });
      } catch (customerError) {
          console.error(`Skipping customer ${customer.email} due to error:`, customerError.message);
          // Continue to the next customer even if one fails
      }

      // write finalCustomers array into final-customers.json using fs
      await writeJsonFile(FINAL_CUSTOMERS_FILE_PATH, finalCustomers);
  }


    
    // filter the customers by country
    // transform customers to save into Stripe
    // for each customer create a Stripe customer
    // push into finalCustomers the stripe customers with email, country and id as properties.
    // write finalCustomers array into final-customers.json using fs
    /* 
      finalCustomers array should look like:
      finalCustomers = [{
          email: test@test.com
          customerId: 1d833d-12390sa-9asd0a2-asdas,
          country: 'ES'
        },
        {
          email: test@test.com
          customerId: 1d833d-12390sa-9asd0a2-asdas,
          country: 'ES'
        }
      }] 
    */

    /* add code above this line */

    console.log(finalCustomers)

}catch(e){
  throw e
}
 
} 

handler("Spain")