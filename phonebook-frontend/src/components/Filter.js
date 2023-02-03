const Filter = ({nameFilter, nameFilterHandler}) => (
    <table>
      <tbody>
	<tr>
	  <td>Filter by name: </td>
	  <td><input value={nameFilter} onChange={nameFilterHandler}/></td>
	</tr>
    </tbody>
    </table>);

export default Filter;
