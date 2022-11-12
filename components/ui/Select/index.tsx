import {Component, Fragment} from 'react'
import {Listbox, Transition} from '@headlessui/react'

type Props = {
    onSelect: any,
    selected: any,
    list: any
}

export default class Select extends Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    handleSelect = (item: any) => {
        this.props.onSelect(item)
    }

    render() {
        return (
            <div className="w-full">
                <Listbox value={this.props.selected} onChange={this.handleSelect}>
                    <div className="relative mt-1">
                        <Listbox.Button
                            className="relative w-full cursor-default border border-gray-200 dark:border-gray-600 rounded-lg bg-base-300 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            {
                                this.props.selected ? (
                                    <span className="block truncate">{this.props.selected.name}</span>
                                ) : (
                                    <span className="block truncate">Choose a currency</span>
                                )
                            }
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"/>
                                </svg>
            </span>
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options
                                className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-base-300 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {this.props.list.map((person: any, personIdx: any) => (
                                    <Listbox.Option
                                        key={personIdx}
                                        className={({active}) =>
                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                active ? 'bg-base-100' : ''
                                            }`
                                        }
                                        value={person}
                                    >
                                        {({selected}) => (
                                            <>
                      <span
                          className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                          }`}
                      >
                        {person.name}
                      </span>
                                                {selected ? (
                                                    <span
                                                        className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                             viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                                                             className="w-6 h-6">
                                                          <path strokeLinecap="round" strokeLinejoin="round"
                                                                d="M4.5 12.75l6 6 9-13.5"/>
                                                        </svg>
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </Listbox>
            </div>
        )
    }
}
