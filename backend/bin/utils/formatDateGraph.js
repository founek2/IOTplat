module.exports = function(time, today) {
	if(time < today) {
		return (
			 time.getDate() + ". "+
			 (time.getMonth() + 1) + ". " +
			 time.getHours() +
			 ":" +
			 ("0" + time.getMinutes()).slice(-2)
		);
    }else {
		return (
			 time.getHours() +
			 ":" +
			 ("0" + time.getMinutes()).slice(-2)
		);
    }
}