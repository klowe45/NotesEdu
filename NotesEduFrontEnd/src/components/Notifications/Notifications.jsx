import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getOrganizationNotifications,
  deleteNotification,
  createNotification,
  getWelcomeMessage,
  updateWelcomeMessage,
} from "../../api/notificationsApi";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [organization, setOrganization] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [savingWelcome, setSavingWelcome] = useState(false);
  const [welcomeSaved, setWelcomeSaved] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    display_time: "",
    remove_time: ""
  });
  const [creatingNotification, setCreatingNotification] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);

  useEffect(() => {
    // Get organization from localStorage
    const orgData = localStorage.getItem("organization");
    if (orgData) {
      const org = JSON.parse(orgData);
      setOrganization(org);
      fetchNotifications(org.id);
      fetchWelcomeMessage(org.id);
    } else {
      setError("No organization found. Please log in.");
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async (orgId) => {
    try {
      setLoading(true);
      const data = await getOrganizationNotifications(orgId);
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWelcomeMessage = async (orgId) => {
    try {
      const data = await getWelcomeMessage(orgId);
      setWelcomeMessage(data.welcome_message || "");
    } catch (err) {
      console.error("Error fetching welcome message:", err);
    }
  };

  const handleSaveWelcomeMessage = async () => {
    if (!organization) return;

    try {
      setSavingWelcome(true);
      setWelcomeSaved(false);
      await updateWelcomeMessage(organization.id, welcomeMessage);
      setWelcomeSaved(true);
      setTimeout(() => setWelcomeSaved(false), 3000);
    } catch (err) {
      console.error("Error saving welcome message:", err);
      alert("Failed to save welcome message");
    } finally {
      setSavingWelcome(false);
    }
  };

  const handleDeleteClick = (notification) => {
    setNotificationToDelete(notification);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setNotificationToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!notificationToDelete) return;

    try {
      await deleteNotification(notificationToDelete.id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationToDelete.id));
      setDeleteModalOpen(false);
      setNotificationToDelete(null);
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Failed to delete notification");
    }
  };

  const handleCreateNotification = async () => {
    if (!organization || !newNotification.title || !newNotification.message) {
      alert("Please fill in both title and message");
      return;
    }

    try {
      setCreatingNotification(true);
      const notification = await createNotification({
        org_id: organization.id,
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        display_time: newNotification.display_time || null,
        remove_time: newNotification.remove_time || null,
        created_by: null
      });

      setNotifications((prev) => [notification, ...prev]);
      setNewNotification({ title: "", message: "", type: "info", display_time: "", remove_time: "" });
    } catch (err) {
      console.error("Error creating notification:", err);
      alert("Failed to create notification");
    } finally {
      setCreatingNotification(false);
    }
  };

  const handleStartEdit = (notification) => {
    setEditingNotification({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      display_time: notification.display_time ? new Date(notification.display_time).toISOString().slice(0, 16) : "",
      remove_time: notification.remove_time ? new Date(notification.remove_time).toISOString().slice(0, 16) : ""
    });
  };

  const handleCancelEdit = () => {
    setEditingNotification(null);
  };

  const handleSaveEdit = async () => {
    if (!editingNotification.title || !editingNotification.message) {
      alert("Please fill in both title and message");
      return;
    }

    try {
      await deleteNotification(editingNotification.id);
      const notification = await createNotification({
        org_id: organization.id,
        title: editingNotification.title,
        message: editingNotification.message,
        type: editingNotification.type,
        display_time: editingNotification.display_time || null,
        remove_time: editingNotification.remove_time || null,
        created_by: null
      });

      setNotifications((prev) =>
        prev.map((n) => n.id === editingNotification.id ? notification : n)
      );
      setEditingNotification(null);
    } catch (err) {
      console.error("Error updating notification:", err);
      alert("Failed to update notification");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "error":
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="relative flex items-center">
            <button
              className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
              onClick={() => navigate("/")}
            >
              <svg
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>

            <h1 className="absolute left-1/2 -translate-x-1/2 text-4xl font-bold text-gray-900">
              Notifications
            </h1>
          </div>
        </div>

        {/* Create Notification */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-md p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">
                Create Notification
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Create a new notification that will appear for all staff members.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                  placeholder="Notification title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                  placeholder="Notification message..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newNotification.display_time}
                    onChange={(e) => setNewNotification({ ...newNotification, display_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    When to start showing
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remove Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newNotification.remove_time}
                    onChange={(e) => setNewNotification({ ...newNotification, remove_time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    When to stop showing
                  </p>
                </div>
              </div>

              <button
                onClick={handleCreateNotification}
                disabled={creatingNotification}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {creatingNotification ? "Creating..." : "Create Notification"}
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section Header */}
        <div className="max-w-4xl mx-auto mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600 text-sm mt-1">Manage all notifications for your organization</p>
        </div>

        {/* Notifications List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <p className="text-gray-600 text-lg">No notifications yet</p>
              <p className="text-gray-500 text-sm mt-2">
                You'll see notifications here when there are updates
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 transition-all duration-200"
              >
                {editingNotification?.id === notification.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editingNotification.title}
                        onChange={(e) => setEditingNotification({ ...editingNotification, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        value={editingNotification.message}
                        onChange={(e) => setEditingNotification({ ...editingNotification, message: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={editingNotification.type}
                        onChange={(e) => setEditingNotification({ ...editingNotification, type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Display Time (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={editingNotification.display_time}
                          onChange={(e) => setEditingNotification({ ...editingNotification, display_time: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Remove Time (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={editingNotification.remove_time}
                          onChange={(e) => setEditingNotification({ ...editingNotification, remove_time: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {notification.title}
                        </h3>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleStartEdit(notification)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(notification)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Welcome Message Editor */}
        <div className="max-w-4xl mx-auto mt-12 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900">
                Dashboard Welcome Message
              </h2>
            </div>
            <p className="text-gray-600 mb-4 text-sm">
              Customize the message that appears on the main dashboard for all staff members.
            </p>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              placeholder="Enter your custom welcome message here..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
            />
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleSaveWelcomeMessage}
                disabled={savingWelcome}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {savingWelcome ? "Saving..." : "Save Message"}
              </button>
              {welcomeSaved && (
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved successfully!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Notification
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to delete the notification "{notificationToDelete?.title}"? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
