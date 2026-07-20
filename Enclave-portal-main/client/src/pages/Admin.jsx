import { useEffect, useState } from "react";

import {
  getContacts,
  deleteContact,
  updateContactStatus,
} from "../services/contact.service";

import ContactTable from "../components/ContactTable";
import ContactModal from "../components/ContactModal";
import ConfirmDialog from "../components/ConfirmDialog";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

function Admin() {
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [activeContact, setActiveContact] = useState(null);
  const [modalMode, setModalMode] = useState("view");

  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const { toasts, showToast, dismissToast } = useToast();

  const fetchContacts = async () => {
    try {
      setLoading(true);

      const response = await getContacts();

      setContacts(response.data);

      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleView = (contact) => {
    setActiveContact(contact);
    setModalMode("view");
  };

  const handleEdit = (contact) => {
    setActiveContact(contact);
    setModalMode("edit");
  };

  const handleModalSaved = (updatedContact) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact._id === updatedContact._id ? updatedContact : contact
      )
    );
    setActiveContact(updatedContact);
  };

  const handleStatusChange = async (id, status) => {
    setBusyId(id);

    try {
      const response = await updateContactStatus(id, status);

      setContacts((prev) =>
        prev.map((contact) =>
          contact._id === id ? response.data : contact
        )
      );

      showToast(response.message || `Marked as ${status}.`, "success");
    } catch (error) {
      showToast(error.message || "Failed to update status.", "error");
    } finally {
      setBusyId(null);
    }
  };

  const requestDelete = (id) => {
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    const id = pendingDeleteId;

    setPendingDeleteId(null);
    setBusyId(id);

    try {
      await deleteContact(id);

      setContacts((prev) =>
        prev.filter((contact) => contact._id !== id)
      );

      showToast("Contact deleted successfully.", "success");
    } catch (error) {
      showToast(error.message || "Failed to delete contact.", "error");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="contact-card">
        <h2>Loading contacts...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-card">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="contact-card">

      <h2>Admin Dashboard</h2>

      <p className="form-description">
        Total Contacts : <strong>{contacts.length}</strong>
      </p>

      <ContactTable
        contacts={contacts}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={requestDelete}
        onMarkImportant={(id) => handleStatusChange(id, "Important")}
        onMarkResolved={(id) => handleStatusChange(id, "Resolved")}
        busyId={busyId}
      />

      {activeContact && (
        <ContactModal
          contact={activeContact}
          initialMode={modalMode}
          onClose={() => setActiveContact(null)}
          onSaved={handleModalSaved}
          onToast={showToast}
        />
      )}

      {pendingDeleteId && (
        <ConfirmDialog
          title="Delete Contact"
          message="This will permanently remove this contact and its attached image. This action cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}

      <Toast toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}

export default Admin;
