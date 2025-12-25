import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormSample from "../FormSample/FormSample";
import { createClient } from "../../api/clientsApi";

const CreateStudent = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [guardianFirstName, setGuardianFirstName] = useState("");
  const [guardianLastName, setGuardianLastName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianEmail, setGuardianEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }

    // Get organization and staff member from localStorage
    let orgId = null;
    let staffId = null;

    const organizationData = localStorage.getItem("organization");
    const staffData = localStorage.getItem("staff");

    if (organizationData) {
      try {
        const organization = JSON.parse(organizationData);
        orgId = organization.id;
      } catch (err) {
        console.error("Error parsing organization data:", err);
      }
    }

    if (staffData) {
      try {
        const staff = JSON.parse(staffData);
        staffId = staff.id;
        // If staff member is logged in, use their org_id
        if (staff.org_id) {
          orgId = staff.org_id;
        }
      } catch (err) {
        console.error("Error parsing staff data:", err);
      }
    }

    setIsSubmitting(true);

    try {
      const clientData = {
        first_name: firstName.trim(),
        middle_name: middleName.trim() || null,
        last_name: lastName.trim(),
        address: address.trim() || null,
        phone: phone.trim() || null,
        birthday: birthday || null,
        guardian_first_name: guardianFirstName.trim() || null,
        guardian_last_name: guardianLastName.trim() || null,
        guardian_phone: guardianPhone.trim() || null,
        guardian_email: guardianEmail.trim() || null,
        org_id: orgId,
        staff_id: staffId,
      };

      const result = await createClient(clientData);
      console.log("Client created:", result);

      navigate("/clients");
    } catch (error) {
      console.error("Error creating client:", error);
      setError(
        error.message || "Failed to create client. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white-50 p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <button
            className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group mb-4 lg:mb-0"
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
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="text-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Client
            </h1>
          </div>
        </div>
        <p className="text-lg text-gray-600 text-center">
          Add a new client to your dashboard
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        <FormSample
          title="Client Information"
          submitText={isSubmitting ? "Creating..." : "Create Client"}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="middlename"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle Name
                </label>
                <input
                  id="middlename"
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter middle name (optional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-gray-700"
              >
                Birthday
              </label>
              <input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter address (optional)"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter phone (optional)"
                />
              </div>
            </div>

            {/* Guardian Information Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Guardian Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="guardianFirstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Guardian First Name
                    </label>
                    <input
                      id="guardianFirstName"
                      type="text"
                      value={guardianFirstName}
                      onChange={(e) => setGuardianFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Enter guardian first name (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="guardianLastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Guardian Last Name
                    </label>
                    <input
                      id="guardianLastName"
                      type="text"
                      value={guardianLastName}
                      onChange={(e) => setGuardianLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Enter guardian last name (optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="guardianPhone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Guardian Phone
                    </label>
                    <input
                      id="guardianPhone"
                      type="tel"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Enter guardian phone (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="guardianEmail"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Guardian Email
                    </label>
                    <input
                      id="guardianEmail"
                      type="email"
                      value={guardianEmail}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                      placeholder="Enter guardian email (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormSample>
      </div>
    </div>
  );
};

export default CreateStudent;
