// ------------------- Utility functions for file processing --------------------
const fs = require('fs');
const path = require('path');

/**
 * Reads a JSON file and returns its content.
 * @param {string} filePath - Path to the JSON file.
 * @returns {Object} Parsed JSON content.
 */
function readJsonFile(filePath) {
  if (!filePath) {
    throw new Error('File path is required');
  }
  try {
    const absolutePath = path.resolve(__dirname, filePath);
    const data = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading JSON file: ${error.message}`);
  }
}

/**
 * Writes an array of objects to a JSON file.
 * @param {string} filePath - Path to the JSON file.
 * @param {Object[]} data - Data to write.
 */
function writeJsonFile(filePath, data) {
  if (!filePath || !data) {
    throw new Error('File path and data are required');
  }
  try {
    const absolutePath = path.resolve(__dirname, filePath);
    fs.writeFileSync(absolutePath, JSON.stringify(data, null, 2));
    console.log(`Data successfully written to ${absolutePath}`);
  } catch (error) {
    throw new Error(`Error writing JSON file: ${error.message}`);
  }
}

// -------------------- Customer Processing Utilities --------------------

/**
 * Converts a country name to its ISO 3166-1 alpha-2 code using a predefined mapping.
 * @param {string} countryName - Country name to convert.
 * @param {Object} countryMapping - Mapping of ISO codes to country names.
 * @returns {string} ISO country code.
 */
function convertCountryToIso(countryName, countryMapping) {
  if (!countryName || !countryMapping || typeof countryMapping !== 'object') {
    throw new Error('Invalid country name or mapping');
  }
  const isoCode = Object.keys(countryMapping).find(key => countryMapping[key].toLowerCase() === countryName.toLowerCase());
  if (!isoCode) {
    throw new Error(`Country name '${countryName}' not found in mapping`);
  }
  return isoCode;
}

/**
 * Filters customers by country.
 * @param {Object[]} customers - Array of customer objects.
 * @param {string} country - Country to filter by.
 * @returns {Object[]} Filtered customers.
 */
function filterCustomersByCountry(customers, country) {
  if (!Array.isArray(customers) || !country) {
    throw new Error('Invalid customers array or country');
  }
  return customers.filter(customer => customer.country === country);
}

/**
 * Transforms customer objects to the required format.
 * @param {Object[]} customers - Array of customer objects.
 * @param {Object} countryMapping - Mapping of ISO codes to country names.
 * @returns {Object[]} Transformed customers.
 */
function transformCustomers(customers, countryMapping) {
  if (!Array.isArray(customers)) {
    throw new Error('Invalid customers array');
  }
  return customers.map(customer => ({
    email: customer.email,
    name: `${customer.first_name} ${customer.last_name}`.trim(),
    country: convertCountryToIso(customer.country, countryMapping),
  }));
}

/**
 * Creates Stripe customers from the transformed data.
 * @param {Object} stripe - Stripe instance.
 * @param {Object[]} customers - Array of transformed customer objects.
 * @returns {Promise<Object[]>} Array of created Stripe customer info.
 */
async function createStripeCustomers(stripe, customers) {
  if (!stripe || !Array.isArray(customers)) {
    throw new Error('Invalid Stripe instance or customers array');
  }
  const stripeCustomers = [];
  for (const customer of customers) {
    const stripeCustomer = await stripe.customers.create({
      email: customer.email,
      name: customer.name,
      address: {
        country: customer.country
      }, // Stripe expects country in address, not directly in a country field
      metadata: {
        country: customer.country
      } // Store country in metadata for reference (optional)
    });
    stripeCustomers.push({
      email: customer.email,
      customerId: stripeCustomer.id,
      country: customer.country
    });
  }
  return stripeCustomers;
}

module.exports = {
  readJsonFile,
  writeJsonFile,
  filterCustomersByCountry,
  transformCustomers,
  createStripeCustomers
};