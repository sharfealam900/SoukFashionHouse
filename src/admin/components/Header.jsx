export default function Header() {
    return (
        <header className="admin-header">

            <div>
                <h4 className="mb-0 fw-bold">
                    Admin Dashboard
                </h4>
            </div>

            <div className="d-flex align-items-center gap-3">

                <span className="fw-semibold">
                    Welcome, Admin
                </span>

                <img
                    src="https://ui-avatars.com/api/?name=Admin"
                    alt="admin"
                    width="42"
                    height="42"
                    className="rounded-circle"
                />

            </div>

        </header>
    );
}