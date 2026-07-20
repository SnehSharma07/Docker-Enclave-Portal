function StatusBadge({ status }) {
  const safeStatus = status || "New";
  return <span className={`status-badge status-${safeStatus.toLowerCase()}`}>{safeStatus}</span>;
}

function ContactTable({
  contacts,
  onView,
  onEdit,
  onDelete,
  onMarkImportant,
  onMarkResolved,
  busyId,
}) {
  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Contacts Found</h3>

        <p>
          No users have submitted the contact
          form yet.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">

      <table className="contact-table">

        <thead>

          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {contacts.map((contact) => {
            const isBusy = busyId === contact._id;

            return (
              <tr key={contact._id} className={isBusy ? "row-busy" : ""}>

                <td>{contact.name}</td>

                <td>{contact.email}</td>

                <td>{contact.subject}</td>

                <td>
                  <StatusBadge status={contact.status} />
                </td>

                <td>
                  {new Date(
                    contact.createdAt
                  ).toLocaleDateString()}
                </td>

                <td>

                  <div className="action-group">

                    <button
                      type="button"
                      className="icon-btn icon-btn-view"
                      data-tooltip="View Details"
                      aria-label="View Details"
                      onClick={() => onView(contact)}
                      disabled={isBusy}
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="icon-btn icon-btn-edit"
                      data-tooltip="Edit Contact"
                      aria-label="Edit Contact"
                      onClick={() => onEdit(contact)}
                      disabled={isBusy}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="icon-btn icon-btn-important"
                      data-tooltip="Mark as Important"
                      aria-label="Mark as Important"
                      onClick={() => onMarkImportant(contact._id)}
                      disabled={isBusy || contact.status === "Important"}
                    >
                      ★
                    </button>

                    <button
                      type="button"
                      className="icon-btn icon-btn-resolved"
                      data-tooltip="Mark as Resolved"
                      aria-label="Mark as Resolved"
                      onClick={() => onMarkResolved(contact._id)}
                      disabled={isBusy || contact.status === "Resolved"}
                    >
                      ✓
                    </button>

                    <button
                      className="delete-btn"
                      data-tooltip="Delete Contact"
                      onClick={() =>
                        onDelete(contact._id)
                      }
                      disabled={isBusy}
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </div>
  );
}

export default ContactTable;
