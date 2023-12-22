const sortByCountry = (customers, country) => {
    return customers.filter((customer) => customer.country === country);
}

const getCountryCode = (country, countries) => {
    const countryCode = Object.keys(countries).find((key) => countries[key] === country);
    return countryCode;
}

const addCountryCode = (customers, countries) => {
    return customers.map((customer) => {
        return {
            ...customer,
            country_code: getCountryCode(customer.country, countries),
        }
    });
}

module.exports = {
    sortByCountry,
    addCountryCode
}