

/**
* Helper for advancing staged events
* @param string stage
* @param object firstarg Override for the default arg
*/
exports.make_next = function (event)
{
	/**
	 * Move to the next stage of a staged event
	 * @param Socket|Player arg       Either a Socket or Player on which emit() will be called
	 * @param string        nextstage
	 * @param ...
	 */
	return function (arg, nextstage) {
		func = (arg instanceof Player ? arg.getSocket() : arg);
		func.emit.apply(func, [event].concat([].slice.call(arguments)));
	}
};

/**
 * Helper for repeating staged events
 * @param Array repeat_args
 * @return function
 */
exports.make_repeat = function (repeat_args, next)
{
	return function () { next.apply(null, [].slice.call(repeat_args)) };
};