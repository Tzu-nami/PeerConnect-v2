import { useState } from 'react';
import { FaCheck, FaTriangleExclamation, FaCircleInfo, FaXmark, FaStar } from "react-icons/fa6";
import { MdStarRate } from 'react-icons/md';

interface LikertQuestion {
    key: string;
    num: number;
    text: string;
}

interface BooleanQuestion {
    key: 'q10';
    text: string;
}

interface LikertProps {
    questions: LikertQuestion[];
    values: Record<string, number | null>;
    onChange: (key: string, value: number) => void;
    errors: Record<string, string>;
}

function StarRating({ value, onChange }: { value: number | null, onChange: (val: number) => void }) {

    return (
        <div className="flex justify-between px-2">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = ( value || 0) >= star;
                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        className={`transition-all focus:outline-none flex-1 flex justify-center cursor-pointer text-white-border ${
                            isFilled 
                            ? 'text-yellow-400 scale-110' 
                            : 'text-white-border'
                        }`}
                    >
                        <MdStarRate className="text-4xl sm:text-4xl" />
                    </button>
                );
            })}
        </div>
    );
}

function StepHeader({ n, label }: { n: number; label: React.ReactNode }) {
    return (
        <div className="flex items-center mb-4">
            <span className="w-5 h-5 rounded-full bg-up-maroon text-white text-xs flex items-center justify-center">
                {n}
            </span>
            <p className="text-sm font-semibold pl-2.5 flex items-center gap-2">
                {label}
            </p>
        </div>
    );
}

export function LikertStep({ questions, values, onChange, errors }: LikertProps) {
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold text-blue-700 mb-3 leading-tight flex items-center gap-1">
                <FaCircleInfo className="text-blue-700" />
                Rate each statement from 1 star (Strongly Disagree) to 5 stars (Strongly Agree).
            </p>
            
            {questions.map(({ key, num, text }) => {
                const val = values[key];
                return (
                    <div
                        key={key}
                        className="rounded-xl border p-4 border-white-border bg-white"
                    >
                        <StepHeader n={num} label={text} />

                        <div className="flex justify-between text-[10px] text-text-muted mb-5 px-1">
                            <span>Strongly Disagree</span>
                            <span>Strongly Agree</span>
                        </div>

                        <StarRating 
                            value={val} 
                            onChange={(n) => onChange(key, n)} 
                        />

                        {errors[key] && (
                            <p className="mt-2 text-xs text-red-500">
                                <FaTriangleExclamation className="mr-1 inline-block" />{errors[key]}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

interface BoolProps {
    question: BooleanQuestion;
    value: boolean | null;
    onChange: (value: boolean) => void;
    error?: string;
}

export function BoolStep({ value, onChange, error }: BoolProps) {
    return (
        <div className="rounded-xl border p-4 border-white-border bg-white">
            <StepHeader n={10} label="The peer mentor started the session on time." />
            
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => onChange(false)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                        value === false
                        ? 'bg-white-complement text-text-primary border-white-border'
                        : 'bg-white text-text-primary border-white-border hover:bg-white-hover disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                    }`}
                >
                    <FaXmark className="text-sm" /> No
                </button>
                <button
                    type="button"
                    onClick={() => onChange(true)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                        value === true
                        ? 'bg-white-complement text-text-primary border-white-border'
                        : 'bg-white text-text-primary border-white-border hover:bg-white-hover disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed'
                    }`}
                >
                    <FaCheck className="text-sm" /> Yes
                </button>
            </div>
            
            {error && (
                <p className="mt-2 text-xs text-red-500">
                    <FaTriangleExclamation className="mr-1 inline-block" />{error}
                </p>
            )}
        </div>
    );
}