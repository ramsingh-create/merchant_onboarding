import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Building2, MapPin } from 'lucide-react';

export const Dropdown = ({
        items,
        selected,
        setSelected,
        label,
    }: {
        items: string[];
        selected: string;
        setSelected: (val: string) => void;
        label: string;
    }) => {
        const [open, setOpen] = useState(false);
        const [focused, setFocused] = useState(false);
        const wrapperRef = useRef<HTMLDivElement>(null);

        // Close dropdown if clicked outside
        useEffect(() => {
            function handleClickOutside(event: MouseEvent) {
                if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                    setOpen(false);
                    setFocused(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
            <div ref={wrapperRef} className="relative mb-6 w-full">
                {/* Floating Label */}
                <label
                    className={`absolute left-3 transition-all duration-200 pointer-events-none
        ${focused || selected
                            ? "text-[#4328ae] text-xs -top-2 bg-white px-1"
                            : "text-gray-500 text-sm top-2.5"}`}
                >
                    {label}
                </label>

                {/* Select Box */}
                <div
                    className={`w-full px-3 pt-4 pb-2 border rounded-md flex justify-between items-center cursor-pointer transition
        ${open || focused ? "border-[#4328ae]" : "border-gray-400"}`}
                    onClick={() => {
                        setOpen(!open);
                        setFocused(true);
                    }}
                >
                    <span className={selected ? "text-gray-900" : "text-gray-400"}>
                        {selected || (open ? "Select your business type" : "‎")}
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${open ? "rotate-180 text-[#4328ae]" : "text-gray-400"}`}
                    />
                </div>

                {/* Dropdown Menu */}
                {open && (
                    <div className="absolute mt-1 w-full max-h-48 overflow-y-auto rounded-md bg-white shadow-lg border border-gray-300 z-20">
                        {items.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    setSelected(item);
                                    setOpen(false);
                                    setFocused(true);
                                }}
                                className={`px-4 py-2 cursor-pointer hover:bg-[#f3f0fc] hover:text-[#4328ae] ${selected === item ? "bg-[#f3f0fc] text-[#4328ae] font-medium" : "text-gray-700"
                                    }`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };
