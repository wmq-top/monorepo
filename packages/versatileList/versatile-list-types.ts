interface VersatileData {
  label: string,
  value: string | number
  isFavor?: boolean
  source?: any
}

interface VersatileListProps {
  dataSource: VersatileData[]
  /**
   * onEdit must use async function and return a boolean value
  */
  onEdit: ({data}: {data: VersatileData}) => Promise<boolean>
  onCopy: ({data}: {data: VersatileData}) => Promise<boolean>
  onDelete: ({data}: {data: VersatileData}) => Promise<boolean>
  onAdd: () => Promise<boolean>
  onSearch: (searchValue: string) => Promise<boolean>
  onShare: ({data}: {data: VersatileData}) => Promise<boolean>
}


type refItem = HTMLInputElement | null;

export type { VersatileData, VersatileListProps, refItem }
