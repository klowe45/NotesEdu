import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const [teacher, setTeacher] = useState(null);
  const [organization, setOrganization] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get teacher from localStorage
    const teacherData = localStorage.getItem("teacher");
    if (teacherData) {
      try {
        setTeacher(JSON.parse(teacherData));
      } catch (err) {
        console.error("Error parsing teacher data:", err);
      }
    }

    // Get organization from localStorage
    const organizationData = localStorage.getItem("organization");
    if (organizationData) {
      try {
        setOrganization(JSON.parse(organizationData));
      } catch (err) {
        console.error("Error parsing organization data:", err);
      }
    }
  }, []);

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {organization ? (
          <p className="footer-teacher-name">
            {organization.name}
          </p>
        ) : teacher ? (
          <p className="footer-teacher-name">
            Owner: {teacher.first_name} {teacher.last_name}
          </p>
        ) : null}
        <div className="footer-right-section">
          <button
            onClick={handleHomeClick}
            className="footer-home-button"
            title="Go to home"
          >
            <svg
              className="footer-home-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="footer-home-text">Home</span>
          </button>
          <p className="footer-brand-text">NeuroNotes</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
