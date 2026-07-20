import { useEffect, useRef, useState } from "react";
import { updateContact } from "../services/contact.service";

const STATUS_OPTIONS = ["New", "Important", "Resolved"];

function StatusBadge({ status }) {
  const safeStatus = status || "New";
  return <span className={`status-badge status-${safeStatus.toLowerCase()}`}>{safeStatus}</span>;
}

function ContactModal({ contact, initialMode = "view", onClose, onSaved, onToast }) {
  const [mode, setMode] = useState(initialMode);

  const [formData, setFormData] = useState({
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    message: contact.message,
    status: contact.status || "New",
  });

  const [errors, setErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const dialogRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const getFieldError = (field) =>
    errors.find((error) => error.field === field)?.message;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => prev.filter((error) => error.field !== name));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setSaving(true);
    setErrors([]);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        status: formData.status,
      };

      const response = await updateContact(contact._id, payload);

      onToast(response.message || "Contact updated successfully.", "success");
      onSaved(response.data);
      setMode("view");
    } catch (error) {
      if (error.errors) setErrors(error.errors);

      onToast(error.message || "Failed to update contact.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  const isEditing = mode === "edit";

  return (
    <div className="modal-overlay" onMouseDown={handleOverlayClick}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="contact-modal-title">
            {isEditing ? "Edit Contact" : "Contact Details"}
          </h2>

          <button
            type="button"
            className="modal-close-btn"
            aria-label="Close dialog"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <div className="modal-fields">
            <div className="form-group">
              <label htmlFor="modal-name">Name</label>

              {isEditing ? (
                <>
                  <input
                    id="modal-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {getFieldError("name") && (
                    <small className="error-text">{getFieldError("name")}</small>
                  )}
                </>
              ) : (
                <p className="modal-static-value">{contact.name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="modal-email">Email</label>

              {isEditing ? (
                <>
                  <input
                    id="modal-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {getFieldError("email") && (
                    <small className="error-text">{getFieldError("email")}</small>
                  )}
                </>
              ) : (
                <p className="modal-static-value">{contact.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="modal-subject">Subject</label>

              {isEditing ? (
                <>
                  <input
                    id="modal-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                  {getFieldError("subject") && (
                    <small className="error-text">{getFieldError("subject")}</small>
                  )}
                </>
              ) : (
                <p className="modal-static-value">{contact.subject}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="modal-message">Message</label>

              {isEditing ? (
                <>
                  <textarea
                    id="modal-message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                  />
                  {getFieldError("message") && (
                    <small className="error-text">{getFieldError("message")}</small>
                  )}
                </>
              ) : (
                <p className="modal-static-value modal-message-text">{contact.message}</p>
              )}
            </div>

            <div className="modal-meta-row">
              <div className="form-group">
                <label htmlFor="modal-status">Status</label>

                {isEditing ? (
                  <select
                    id="modal-status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <StatusBadge status={contact.status} />
                )}
              </div>

              <div className="form-group">
                <label>Date Submitted</label>
                <p className="modal-static-value">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="modal-btn modal-btn-ghost"
                  onClick={() => {
                    setMode("view");
                    setErrors([]);
                    setFormData({
                      name: contact.name,
                      email: contact.email,
                      subject: contact.subject,
                      message: contact.message,
                      status: contact.status || "New",
                    });
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-btn modal-btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="modal-btn modal-btn-ghost"
                  onClick={onClose}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="modal-btn modal-btn-primary"
                  onClick={() => setMode("edit")}
                >
                  Edit Contact
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
