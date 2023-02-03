import { useState, useEffect } from 'react';
// Services
import phonebookService from './services/Phonebook'
// Components
import Form from './components/Form';
import Filter from './components/Filter';
import Phonebook from './components/Phonebook';
import Notification from './components/Notification';

const App = () => {
    const [persons, setPersons] = useState([]);
    
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [notification, setNotification] = useState({message: null, error: false});
    
    const handleNameChange = (event) => setNewName(event.target.value);
    const handleNumberChange = (event) => setNewNumber(event.target.value);
    const handleNameFilter = (event) => setNameFilter(event.target.value);

    const displayNotification = (obj) => {
	setNotification(obj);
	setTimeout(() => setNotification({message: null, error: false}), 5000);
    };

    const addEntry = (event) => {
        event.preventDefault();

        if (!newName || !newNumber) return alert(`Please input all values.`);

	// Server generates the id prop
	const newPersonObject = {name: newName, number: newNumber};
        const existingPersonObject = persons.find(person => person.name === newName);
	
	if (existingPersonObject) {
	    if (window.confirm(`${newName} is already in the phonebook, replace old number with "${newNumber}"?`)) {
		const id = existingPersonObject.id;
		// returnedPerson includes server generated id prop
		phonebookService.update(id, newPersonObject)
		    .then(returnedPerson => {
			setPersons(persons.map(person => (person.id === id) ? returnedPerson : person));
			displayNotification({message: `Updated ${newName}'s number to "${newNumber}".`, error: false})
			setNewName('');
			setNewNumber('');
		    })
		    .catch(() => {
			displayNotification({message: `${newName} doesn't exist on the server`, error: true});
			setPersons(persons.filter(person => person.id !== id))});
	    };
	    
	} else {
	    // Person was not found, do a new entry
	    phonebookService
		.create(newPersonObject)
		.then(returnedPerson => {
		    setPersons(persons.concat(returnedPerson));
		    displayNotification({message: `Added ${newName} to the phonebook.`, error: false})
		    setNewName('');
		    setNewNumber('');
		});
	};
    };

    const deleteEntry = (id, name) => {
	const doDeletion = () => {
	    if (window.confirm(`Delete ${name}?`)) {
		phonebookService
		    .deleteById(id)
		    .then(() => {
			setPersons(persons.filter(person => person.id !== id))
			displayNotification({message: `Deleted ${name} from the phonebook.`, error: false})
		    })
		    .catch(() => {
			displayNotification({message: `${name} was already deleted from server`, error: true});
			setPersons(persons.filter(person => person.id !== id))});
	    }
	}
	return doDeletion;
    };
    
    // Render initial entries
    useEffect(() => {
	phonebookService
	    .getAll()
	    .then(initialPersons => setPersons(initialPersons));
    }, []);
    
    // Filter entries if there is a filter
    const filteredPersons = persons.filter(person => {
        return (!nameFilter ||
                person.name.toLowerCase().includes(nameFilter.toLowerCase()));
    });

    return (
            <>
            <h2>Filter</h2>
            <Filter nameFilter={nameFilter} nameFilterHandler={handleNameFilter}/>
            <h2>Person</h2>
            <Form onSubmit={addEntry}
        nameValue={newName} nameHandler={handleNameChange}
        numberValue={newNumber} numberHandler={handleNumberChange}/>
            <h2>Phonebook</h2>
	    <Notification notification={notification}/>
            <Phonebook array={filteredPersons} deletionHandler={deleteEntry}/>
            </>
    );
};

export default App;
