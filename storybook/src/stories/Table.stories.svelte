<script context="module" lang="ts">
import { Table, TableColumn, TableDurationColumn, TableRow, TableSimpleColumn } from '@podman-desktop/ui-svelte';
import { type Args, defineMeta, type StoryContext } from '@storybook/addon-svelte-csf';

/**
 * These are the stories for the `Table` component.
 * Allow to display a table.
 */
const { Story } = defineMeta({
  component: Table,
  render: template,
  title: 'Table',
  tags: ['autodocs'],
  args: {},
});

type Person = {
  name: string;
  duration?: number;
};

const people: Person[] = [
  { name: 'John', duration: new Date().getTime() - 600_000 },
  { name: 'Henry', duration: new Date().getTime() },
  { name: 'Charlie', duration: new Date().getTime() - 3_600_000 },
];

type Group = {
  name: string;
};

const group: Group[] = [{ name: 'Teacher' }, { name: 'Student' }];

const nameCol: TableColumn<Person, string> = new TableColumn('Name', {
  renderMapping: obj => obj.name,
  renderer: TableSimpleColumn,
});

const durationCol = new TableColumn<Person, Date | undefined>('Duration', {
  renderMapping: (obj): Date | undefined => (obj.duration ? new Date(obj.duration) : undefined),
  renderer: TableDurationColumn,
});

const columns = [nameCol, durationCol];
const selectable = (_person: Person): boolean => true;
const row = new TableRow<Person>({
  selectable,
  disabledText: 'cannot be selected',
});

const rowGroup = new TableRow<Group, Person>({
  children: (group: Group): Array<Person> => {
    switch (group.name) {
      case 'Teacher':
        return [people[0]];
      case 'Student':
        return [people[1], people[2]];
      default:
        return [];
    }
  },
});
</script>

{#snippet template({ _children, ...args }: Args<typeof Story>, _context: StoryContext<typeof Story>)}
  <Table {...args}></Table>
{/snippet}

<Story
  name="Basic"
  args={{
    data: people,
    columns,
    row,
  }} />

<Story
  name="Children"
  args={{
    data: group,
    columns: [nameCol],
    row: rowGroup,
  }} />
