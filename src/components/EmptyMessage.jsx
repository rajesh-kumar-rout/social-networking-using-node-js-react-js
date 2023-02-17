export default function EmptyMessage({ message }) {
    return (
        <div className="card card-body">
            <p className="card-title" style={{ textAlign: "center", fontSize: 18 }}>{message}</p>
        </div>
    )
}