export default function EmptyMessage({ message }) {
    return (
        <div className="flex justify-center items-center h-full w-full">
            <p className="text-teal-600 text-lg font-bold">{message}</p>
        </div>
    )
}