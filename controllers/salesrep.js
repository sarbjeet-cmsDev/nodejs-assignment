const Country = require('../model/country');

const MAX_COUNTRY = 7;
const MIN_COUNTRY = 3;

//Return the list of countries filter by region
const countries = async (req, res)=>{
    try {
    	const q = req.query.region;
    	const filter = q ? { region: q } : {};
        const items = await Country.find(filter);
        res.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Internal Server Error');
    }
}

//Return the list of sales rep, required by regions
const salesrep = async (req, res)=>{
    try {
        const region = await Country.aggregate([
            { $group: { _id: '$region', countries: { $sum: 1 } } },
            { $sort: { countries: -1 } }
        ]);

        const rtn = region.map(reg => ({
		    region: reg._id,
		    minSalesReq: Math.ceil(reg.countries / MAX_COUNTRY),
		    maxSalesReq: Math.floor(reg.countries / MIN_COUNTRY)
		}));

        res.json(rtn);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Internal Server Error');
    }
}

//Return the list of countries with optimal assignment to sales rep.
const optimal = async (req, res)=>{
    try {
        const regions = await Country.distinct('region');

        const optimizeDistribution = (array, numChunks) => {
		    const chunks = [];
		    const baseSize = Math.floor(array.length / numChunks);
		    const extra = array.length % numChunks;
		    let index = 0;
		    for (let i = 0; i < numChunks; i++) {
		        const chunkSize = baseSize + (i < extra ? 1 : 0);
		        chunks.push(array.slice(index, index + chunkSize));
		        index += chunkSize;
		    }
		    return chunks;
		};

        var rtn = [];
        for (let i = 0; i < regions.length; i++) {
        	const reg = regions[i];
        	const countries = await Country.distinct('name').where('region').equals(reg);
        	const rep = Math.ceil(countries.length / MAX_COUNTRY);
        	const optimlist = optimizeDistribution(countries, rep);

        	optimlist.forEach((ele)=>{
        		rtn.push({
	        		"region":reg,
	        		"countryList":ele,
	        		"counrtyCount":ele.length
	        	});
        	});
		}
        res.json(rtn);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Export of all methods as object
module.exports = {
    countries,
    salesrep,
    optimal
}