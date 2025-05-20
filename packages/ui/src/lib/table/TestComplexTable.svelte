<script lang="ts">
import SimpleColumn from './SimpleColumn.svelte';
import { Column, Row } from './table';
import Table from './Table.svelte';
import type { Person } from './test-table';

interface Props {
  people: Array<Person>;
}

let { people }: Props = $props();

const nameColumn: Column<Person, string> = new Column('Name', {
  width: '3fr',
  renderMapping: obj => obj.name,
  renderer: SimpleColumn,
  comparator: (a, b) => a.name.localeCompare(b.name),
});

const row = new Row<Person, Person>({
  children: (group: Person): Array<Person> => {
    return group.children;
  },
});
</script>

<Table
  kind="persons"
  data={people}
  columns={[nameColumn]}
  {row}
  defaultSortColumn="Name">
</Table>
