var Localize = require('localize');
/**
 * Get a new localize ("Strings") object
 * @param string file
 * @return Localize
 */
module.exports = function (file)
{
	return new Localize(require('js-yaml').load(require('fs').readFileSync(file).toString('utf8')), undefined, 'zz');
};
