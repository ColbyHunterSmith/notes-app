import { useCallback, useMemo, useState } from 'react'
import { Combobox } from '@headlessui/react'
import { Badge } from './ui/badge'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const multiple: any = true

export function ComboboxInput() {
  const [selectedPeople, setSelectedPeople] = useState([people[0], people[1]])
  const [query, setQuery] = useState('')

  const unselectedPeople = useMemo(() => {
    return people.filter((person) =>
      query
        ? person.name.toLowerCase().includes(query.toLowerCase()) &&
          !selectedPeople.includes(person)
        : !selectedPeople.includes(person),
    )
  }, [selectedPeople, query])

  const handleUnselect = useCallback(
    (person: (typeof people)[number]) => {
      setSelectedPeople((people) => people.filter((p) => p.id !== person.id))
    },
    [setSelectedPeople],
  )

  return (
    <div>
      <Combobox value={selectedPeople} onChange={setSelectedPeople} multiple={multiple} as="div">
        {selectedPeople.length > 0 && (
          <ul>
            {selectedPeople.map((person) => (
              <li key={person.id}>
                <Badge onClick={() => handleUnselect(person)}>{person.name}</Badge>
              </li>
            ))}
          </ul>
        )}

        {/* https://github.com/tailwindlabs/headlessui/discussions/1236#discussioncomment-2970969 */}
        <Combobox.Button as="div">
          <Combobox.Input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(event) => setQuery(event.target.value)}
          />
        </Combobox.Button>

        <Combobox.Options className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
          {unselectedPeople.map((person) => (
            <Combobox.Option
              key={person.id}
              value={person}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent"
            >
              {person.name}
            </Combobox.Option>
          ))}

          {query.length > 0 && (
            <Combobox.Option
              value={{ id: null, name: query }}
              className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent"
            >
              Create &#34;{query}&#34;
            </Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox>
    </div>
  )
}
