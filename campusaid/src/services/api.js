const API_BASE = process.env.NODE_ENV === "production" 
  ? "https://campusaidproject.onrender.com/api" 
  : "http://localhost:8000/api";

const api = {
  auth: {
    login: async (data) => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    register: async (data) => {
      return { message: "Registration is disabled" };
    },
    getProfile: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    updateProfile: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },
  password: {
    change: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/password/change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    forgot: async (email) => {
      const response = await fetch(`${API_BASE}/password/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return response.json();
    },
    reset: async (data) => {
      const response = await fetch(`${API_BASE}/password/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
  },
  notes: {
    getNotes: async (department) => {
      const token = localStorage.getItem("token");
      const dept = department || localStorage.getItem("userDepartment") || '';
      let url = `${API_BASE}/notes`;
      if (dept) url += `?department=${dept}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    upload: async (formData) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/notes/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return response.json();
    },
    delete: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/notes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },
  quiz: {
    getSubjects: async (department) => {
      const token = localStorage.getItem("token");
      const dept = department || localStorage.getItem("userDepartment") || 'CS';
      const response = await fetch(`${API_BASE}/quiz/subjects?department=${dept}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    getQuiz: async (subject, department) => {
      const token = localStorage.getItem("token");
      const dept = department || localStorage.getItem("userDepartment") || 'CS';
      const response = await fetch(
        `${API_BASE}/quiz/${encodeURIComponent(subject)}?department=${dept}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.json();
    },
    submit: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getScores: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/quiz/scores/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },
  lostfound: {
    getPosts: async (type = "", search = "") => {
      const token = localStorage.getItem("token");
      let url = `${API_BASE}/lostfound?`;
      if (type) url += `type=${type}&`;
      if (search) url += `search=${search}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    create: async (formData) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/lostfound/create`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return response.json();
    },
    delete: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/lostfound/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    forget: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/lostfound/${id}/forget`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },
  chatbot: {
    sendMessage: async (message) => {
      const response = await fetch(`${API_BASE}/chatbot/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      return response.json();
    },
  },
  railway: {
    apply: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/railway/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getMyApplications: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/railway/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    cancel: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/railway/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },
  issues: {
    report: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getMyIssues: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/issues/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },
  announcements: {
    getAll: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
  },
  admin: {
    getAllStudents: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/students`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    getStudentById: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    createStudent: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    updateStudent: async (id, data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    deleteStudent: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/students/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    // Railway
    getRailwayApplications: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/railway`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    updateRailwayStatus: async (id, status, remarks) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/railway/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, remarks }),
      });
      return response.json();
    },
    // Lost & Found
    getLostFound: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/lostfound`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    deleteLostFound: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/lostfound/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    // Issues
    getAllIssues: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    updateIssue: async (id, data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/issues/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    // Announcements
    getAnnouncements: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    createAnnouncement: async (data) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    deleteAnnouncement: async (id) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/announcements/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    // Quiz Analytics
    getQuizAnalytics: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/admin/quiz/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.json();
    },
    getStudentQuizScores: async (studentId) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE}/admin/quiz/analytics/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.json();
    },
  },
};

export default api;
