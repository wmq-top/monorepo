interface PduOptions {
  id: string,
  value: string
  isFavor?: boolean,
  label?: any,
  children?: PduOptions[],
  title?: string,
  disabled?: boolean
}
interface pduSourceDataProps {
  label: string,
  value: string | number
  children?: pduSourceDataProps[],
  disabled?: boolean
  isFavor?: boolean
}

type EmitTrigger = (event: string, data: any) => true

export type { PduOptions, pduSourceDataProps, EmitTrigger }
