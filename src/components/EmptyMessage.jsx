export default function EmptyMessage({ message }) {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <p className="text-indigo-600 text-xl font-bold">{message}</p>
        </div>
    )
}