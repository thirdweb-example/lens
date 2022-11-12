import { Fragment, Component } from 'react'
import { Dialog, Transition } from "@headlessui/react";

type Props = {
  isOpen: boolean,
  onClose: any,
  title: string,
  children: any
}

export default class Modal extends Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  render () {
    return (
        <>
          <Transition appear show={this.props.isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-20" onClose={this.props.onClose}>
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                    <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                          as="div"
                          className="flex justify-between items-center text-lg font-medium leading-6 text-gray-900"
                      >
                        <h3 className="text-base-content">{this.props.title}</h3>
                        <div>
                          <button className="btn btn-outlined btn-ghost text-base-content" onClick={this.props.onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </Dialog.Title>
                      <div className="mt-2">
                        {this.props.children}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
    )
  }
}
