import { FaCheck, FaTriangleExclamation, FaCircleInfo, FaXmark } from "react-icons/fa6";

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

export function LikertStep({ questions, values, onChange, errors }: LikertProps) {
    return (
        <div className="space-y-5">
            <p className="text-xs font-semibold text-green-700 flex items-center gap-1">
                <FaCircleInfo className="text-green-400" />
                Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree).
            </p>
            {questions.map(({ key, num, text }) => {
                const val = values[key];
                return (
                    <div
                        key={key}
                        className={`rounded-xl border p-4 transition-colors ${val ? 'border-green-200 bg-green-50/40' : 'border-gray-100 bg-white'}`}
                    >
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                            Question {num} of 10
                        </p>
                        <p className="text-sm font-medium text-gray-800 mb-3">{text}</p>

                        <div className="flex justify-between text-[10px] text-gray-400 mb-2 px-1">
                            <span>Strongly Disagree</span>
                            <span>Strongly Agree</span>
                        </div>

                        <div className="flex gap-2 justify-between">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => onChange(key, n)}
                                    className={`flex-1 h-9 rounded-lg text-sm font-bold border transition-all ${
                                        val === n
                                        ? 'bg-green-600 border-green-600 text-white shadow-md scale-105'
                                        : 'bg-white border-gray-200 text-gray-500 hover:border-green-400 hover:text-green-600'
                                    }`}
                                >
                                {n}
                                </button>
                            ))}
                        </div>

                        {errors[key] && (
                            <p className="mt-2 text-xs text-red-500">
                                <FaTriangleExclamation className="mr-1" />{errors[key]}
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

export function BoolStep({ question, value, onChange, error }: BoolProps) {
    return (
        <div className={`rounded-xl border p-4 transition-colors ${value !== null ? 'border-green-200 bg-green-50/40' : 'border-gray-100 bg-white'}`}>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Question 10 of 10
            </p>
            <p className="text-sm font-medium text-gray-800 mb-3">{question.text}</p>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => onChange(true)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                            value === true
                            ? 'bg-green-600 border-green-600 text-white shadow-md'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-600'
                        }`}
                    >
                        <FaCheck className="text-xs" /> Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange(false)}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                            value === false
                            ? 'bg-red-600 border-red-600 text-white shadow-md'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-600'
                        }`}
                    >
                        <FaXmark className="text-xs" /> No
                    </button>
                </div>
            {error && (
                <p className="mt-2 text-xs text-red-500">
                    <FaTriangleExclamation className="mr-1" />{error}
                </p>
            )}
        </div>
    );
}