import {Fragment, Component} from 'react'
import {RadioGroup} from '@headlessui/react'
import {Dialog, Transition} from "@headlessui/react";

const plans = [
    {
        id: 1,
        name: 'Best Collector',
        description: 'Reward your n°1 collector'
    },
    {
        id: 2,
        name: 'Best Commentator',
        description: 'Reward your n°1 commentary'
    },
    {
        id: 3,
        name: 'Random Post collector',
        description: 'Chose a post and reward one random collector'
    },
    {
        id: 4,
        name: 'x Followers',
        description: 'Reward an amount of random followers'
    },
    {
        id: 5,
        name: 'x Collectors',
        description: 'Reward an amount of random collectors'
    },
    {
        id: 6,
        name: 'x Commentary',
        description: 'Reward an amount of random commentaries'
    }
]

type Props = {
    onSelect: any,
    selected: any
}

type Stat = {
    isOpen: boolean
}

export default class ModuleSelector extends Component<Props, Stat> {
    constructor(props: any) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

    closeModal = () => {
        this.setState({ isOpen: false })
    }

    openModal = () => {
        this.setState({ isOpen: true })
    }

    handleSelect = (item: any) => {
        this.setState({ isOpen: false })
        this.props.onSelect(item)
    }

    render () {
        return (
            <div>
                {this.props.selected ? (
                    <div
                        onClick={this.openModal}
                        className='cursor-pointer badge badge-info gap-2'
                    >{this.props.selected.name}</div>
                ) : (
                    <button className="btn btn-ghost" onClick={this.openModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                )
                }
                <Transition appear show={this.state.isOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-30" onClose={this.closeModal}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25"/>
                        </Transition.Child>

                        <div className="fixed inset-0 overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4 text-center">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 scale-95"
                                    enterTo="opacity-100 scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 scale-100"
                                    leaveTo="opacity-0 scale-95"
                                >
                                    <Dialog.Panel
                                        className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title as="div" className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold leading-6 text-base-content">
                                                Select giveaway module
                                            </h3>
                                            <div>
                                                <button className="btn btn-ghost" onClick={this.closeModal}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </Dialog.Title>
                                        <div className="w-full mt-4">
                                            <div className="mx-auto w-full max-w-md">
                                                <RadioGroup value={this.props.selected} onChange={this.handleSelect} name="module">
                                                    <div className="space-y-2">
                                                        {plans.map((plan) => (
                                                            <RadioGroup.Option
                                                                key={plan.name}
                                                                value={plan}
                                                                className={({active, checked}) =>
                                                                    `${
                                                                        active
                                                                            ? ''
                                                                            : ''
                                                                    }
                  ${
                                                                        checked ? 'text-base-content' : 'bg-base-100'
                                                                    } relative flex cursor-pointer rounded-lg px-5 py-4 border border-gray-500 focus:outline-none`
                                                                }
                                                            >
                                                                {({active, checked}) => (
                                                                    <>
                                                                        <div
                                                                            className="flex w-full items-center justify-between">
                                                                            <div className="flex items-center">
                                                                                <div className="text-sm">
                                                                                    <RadioGroup.Label
                                                                                        as="p"
                                                                                        className={`font-semibold  ${
                                                                                            checked ? 'text-base-content' : 'text-base-content'
                                                                                        }`}
                                                                                    >
                                                                                        {plan.name}
                                                                                    </RadioGroup.Label>
                                                                                    <RadioGroup.Description
                                                                                        as="span"
                                                                                        className='inline text-gray-500'
                                                                                    >
                                                                                        <span>{plan.description}</span>
                                                                                    </RadioGroup.Description>
                                                                                </div>
                                                                            </div>
                                                                            {checked && (
                                                                                <div className="shrink-0 text-teal-500">
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                    </svg>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </RadioGroup.Option>
                                                        ))}
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        )
    }
}
