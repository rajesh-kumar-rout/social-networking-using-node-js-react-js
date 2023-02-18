export default function EmptyMessage({ message }) {
    return (
        <div className="card card-body">
            <p className="card-title" style={{ textAlign: "center" }}>{message}</p>
        </div>
    )
}