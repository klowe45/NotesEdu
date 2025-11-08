import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentById } from "../../api/studentsApi";
import { uploadDocuments, getStudentDocuments, sendDocumentByEmail } from "../../api/documentsApi";

const UploadReports = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [emailForm, setEmailForm] = useState({
    recipientEmail: "",
    recipientName: "",
    message: "",
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [documentToDownload, setDocumentToDownload] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const docs = await getStudentDocuments(studentId);
      setDocuments(docs);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await getStudentById(studentId);
        setStudent(studentData);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError("Failed to load student data.");
      }
    };

    if (studentId) {
      fetchStudent();
      fetchDocuments();
    }
  }, [studentId]);

  const handleReturn = () => {
    navigate("/behavioral-reports");
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
    setError("");
    setSuccess("");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
    setError("");
    setSuccess("");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // Get teacher info for author field
      const teacherData = localStorage.getItem("teacher");
      const teacher = teacherData ? JSON.parse(teacherData) : null;
      const author = teacher ? `${teacher.first_name} ${teacher.last_name}` : "Unknown";

      // Upload documents to server
      await uploadDocuments(studentId, selectedFiles, author);

      setSuccess(`Successfully uploaded ${selectedFiles.length} file(s)!`);
      setSelectedFiles([]);

      // Refresh documents list
      await fetchDocuments();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleViewDocument = (documentId, event, filename) => {
    // Prevent triggering when clicking email button
    if (event.target.closest('.email-button')) {
      return;
    }

    // Show download confirmation modal
    setDocumentToDownload({ id: documentId, filename });
    setDownloadModalOpen(true);
  };

  const handleConfirmDownload = () => {
    if (documentToDownload) {
      // Open document in new tab
      const url = `http://localhost:4000/api/documents/download/${documentToDownload.id}`;
      window.open(url, '_blank');
      setDownloadModalOpen(false);
      setDocumentToDownload(null);
    }
  };

  const handleCancelDownload = () => {
    setDownloadModalOpen(false);
    setDocumentToDownload(null);
  };

  const handleOpenEmailModal = (doc, event) => {
    event.stopPropagation();
    setSelectedDocument(doc);
    setEmailModalOpen(true);
  };

  const handleCloseEmailModal = () => {
    setEmailModalOpen(false);
    setSelectedDocument(null);
    setEmailForm({
      recipientEmail: "",
      recipientName: "",
      message: "",
    });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();

    if (!emailForm.recipientEmail) {
      setError("Recipient email is required");
      return;
    }

    setSendingEmail(true);
    setError("");
    setSuccess("");

    try {
      const teacherData = localStorage.getItem("teacher");
      const teacher = teacherData ? JSON.parse(teacherData) : null;
      const senderName = teacher ? `${teacher.first_name} ${teacher.last_name}` : "Teacher";

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        const result = await sendDocumentByEmail(
          selectedDocument.id,
          emailForm.recipientEmail,
          emailForm.recipientName,
          emailForm.message,
          senderName
        );
        clearTimeout(timeoutId);

      // If it's a test email, show the preview URL
      if (result.isTestEmail && result.previewUrl) {
        setSuccess(
          <div>
            <p className="font-medium mb-2">Test email sent successfully!</p>
            <a
              href={result.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              Click here to view the email preview
            </a>
            <p className="text-xs text-gray-500 mt-2">
              (Using test email service - emails are not actually delivered)
            </p>
          </div>
        );
      } else {
        setSuccess("Email sent successfully!");
      }

        handleCloseEmailModal();

        setTimeout(() => setSuccess(""), 10000);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          setError("Request timed out. The email service may be slow. Please try again.");
        } else {
          throw fetchError;
        }
      }
    } catch (err) {
      console.error("Email error:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please make sure the backend server is running on port 4000.");
      } else {
        setError(err.message || "Failed to send email. Please try again.");
      }
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Return Button */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
              onClick={handleReturn}
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
              <span className="font-medium">Back to Reports</span>
            </button>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Upload Reports
          </h2>
          {student && (
            <p className="text-center text-gray-600 text-lg mt-2">
              for {student.first_name} {student.middle_name} {student.last_name}
            </p>
          )}
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800 text-sm">{success}</div>
            </div>
          )}

          {/* File Upload Area */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
            >
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload PDF, Word, Pages, images, or other report files
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.pages,.numbers,.key"
              />
              <label
                htmlFor="file-input"
                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
              >
                Select Files
              </label>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Selected Files ({selectedFiles.length})
                </h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center flex-1">
                        <svg
                          className="w-5 h-5 text-gray-500 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-4 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        aria-label="Remove file"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            )}
          </div>

          {/* Uploaded Reports List */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-8 border border-gray-200 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Uploaded Reports
                  </h3>
                  {documents.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {documents.length} {documents.length === 1 ? 'document' : 'documents'} available
                    </p>
                  )}
                </div>
              </div>
            </div>

            {loadingDocuments ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 font-medium">Loading documents...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <svg
                  className="w-20 h-20 mx-auto mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-600 text-lg font-medium mb-2">No documents uploaded yet</p>
                <p className="text-gray-400 text-sm">
                  Upload files above to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={(e) => handleViewDocument(doc.id, e, doc.filename)}
                    className="group relative bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                  >
                    {/* Hover gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                    <div className="relative p-5 flex items-center justify-between">
                      <div className="flex items-center flex-1 min-w-0">
                        {/* File icon with background */}
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4 shadow-md group-hover:scale-110 transition-transform duration-200">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-semibold text-gray-800 truncate mb-2">
                            {doc.filename}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(doc.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={(e) => handleOpenEmailModal(doc, e)}
                          className="email-button flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-all duration-200 hover:shadow-md"
                          title="Send via email"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="hidden sm:inline">Email</span>
                        </button>
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                          <span className="text-xs font-medium text-blue-700 hidden sm:inline">View</span>
                          <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email Modal */}
        {emailModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Send via Email</h3>
                <button
                  onClick={handleCloseEmailModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {selectedDocument && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>Document:</strong> {selectedDocument.filename}
                  </p>
                </div>
              )}

              <form onSubmit={handleSendEmail}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={emailForm.recipientEmail}
                      onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="recipient@example.com"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseEmailModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {sendingEmail ? "Sending..." : "Send Email"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Download Confirmation Modal */}
        {downloadModalOpen && documentToDownload && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-20 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Confirm Download</h3>
                <button
                  onClick={handleCancelDownload}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <svg
                    className="w-8 h-8 text-blue-600 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 mb-1">Download file:</p>
                    <p className="text-base font-semibold text-gray-900 truncate">
                      {documentToDownload.filename}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDownload}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDownload}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadReports;
