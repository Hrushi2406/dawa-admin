import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "lucide-react";
import { Fragment, useState } from "react";
import { Button } from "./button";

export interface IModal {
  isOpen: boolean;
  size?: "md" | "lg" | "sm" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  closeModal: any;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  closeModal,
  size = "lg",
  children,
}: IModal) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black dark:bg-black/20 bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-0 text-center">
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
                  className={`w-full max-w-${size} transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all`}
                >
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
