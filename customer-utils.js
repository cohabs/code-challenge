const sortByCountry = (customers, country) => {
    return customers.filter((customer) => customer.country === country);
}

module.exports = {
    sortByCountry
}