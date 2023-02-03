const Form = ({onSubmit, nameValue, nameHandler, numberValue, numberHandler}) => (
    <form onSubmit={onSubmit}>
      <table>
	<tbody>
	  <tr><td>Name: </td><td><input value={nameValue} onChange={nameHandler}/></td></tr>
	  <tr><td>Number: </td><td><input value={numberValue} onChange={numberHandler}/></td></tr>
	</tbody>
      </table>
     <div><button type="submit">Add to Phonebook</button></div>
    </form>
);

export default Form;
