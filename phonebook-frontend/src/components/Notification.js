const Notification = ({notification}) => {
    const message = notification.message;
    if (message) {
	if (notification.error) {
	    const errorStyle = {
		color: 'red',
		border: '2px solid red',
		fontStyle: 'italic',
		padding: '5px',
		fontSize: 16
	    };
	    return (<div style={errorStyle}>{message}</div>);
	} else {
	    const infoStyle = {
		color: 'green',
		border: '2px solid green',
		fontStyle: 'italic',
		padding: '5px',
		fontSize: 16
	    };
	    return (<div style={infoStyle}>{message}</div>);
	}
    }
};

export default Notification;
