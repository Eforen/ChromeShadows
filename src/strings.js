import Localize from 'localize'

/**
 * Get a new localize ("Strings") object
 * @param string file
 * @return Localize
 */
export function loader(file)
{
	return new Localize(require('js-yaml').load(require('fs').readFileSync(file).toString('utf8')), undefined, 'zz');
}

const baseFolder = './strings/'

const strings = []

export function getString(stringGroup, string, locale = "es"){
	if(!(stringGroup in strings))
		strings[stringGroup] = loader(baseFolder+stringGroup.replace('-','/')+'.yml')
	if(strings[stringGroup].getLocale() != locale)
		strings[stringGroup].setLocale(Locale)
	return strings[stringGroup].translate(string)
}