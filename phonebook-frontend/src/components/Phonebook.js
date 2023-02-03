const Phonebook = ({array, deletionHandler}) => (
    <table>
	<tbody>
	  {array.map(person =>
	      <tr key={person.id}>
		  <td>{person.name}</td>
		  <td>{person.number}</td>
		  <td><button onClick={deletionHandler(person.id, person.name)}>Delete</button></td>
	      </tr>)}
	</tbody>
      </table>
);

export default Phonebook;
