"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

 

export function ComboBox(props : {id?: string,value : string, onChange: (value: string) => void, valueToView: (value: string) => string, values: string[], disabled: boolean , placeholder : string } ) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={props.disabled} className="text-left">
        <Button
          disabled={props.disabled}
          variant="outline"
          role="combobox"
          type="button"
          aria-expanded={open}
          className="w-full justify-between "
          id={props.id}
        >
          {props.value   
            ? props.valueToView(props.value)
            : props.placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-3xs h-40 p-0">
        <Command filter={
          (v, search, _keywords) => {            
            return props.valueToView(v).toLocaleLowerCase().includes(search.toLowerCase())  ? 1 : 0
          }
        }>
          <CommandInput placeholder={props.placeholder} />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {props.values.map((v) => (
                <CommandItem
                  key={v}
                  value={v}

                  onSelect={(currentValue) => {
                    props.onChange(currentValue === props.value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {props.valueToView(v)}

                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      props.value === v ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}