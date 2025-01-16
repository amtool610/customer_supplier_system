// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCysHx6eoQcljo8_B2wbg4mlv8nFHIYBKk",
    authDomain: "custandsupp.firebaseapp.com",
    projectId: "custandsupp",
    storageBucket: "custandsupp.firebasestorage.app",
    messagingSenderId: "1013364359143",
    appId: "1:1013364359143:web:a30acd373c506a619a0742"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const authContainer = document.getElementById('auth-container');
const mainApp = document.getElementById('main-app');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const authError = document.getElementById('auth-error');
const projectList = document.getElementById('project-list');
const addProjectForm = document.getElementById('add-project-form');
const customerNameInput = document.getElementById('customer-name');
const projectInfoInput = document.getElementById('project-info');
const supplierNameInput = document.getElementById('supplier-name');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

// Authentication state listener
onAuthStateChanged(auth, user => {
    if (user) {
        authContainer.style.display = 'none';
        mainApp.style.display = 'block';
        loadProjects();
    } else {
        authContainer.style.display = 'block';
        mainApp.style.display = 'none';
    }
});

// Login
loginBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = error.message;
    }
});

// Signup
signupBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError.textContent = error.message;
    }
});

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout error:", error);
    }
});

// Load projects from Firestore
async function loadProjects() {
    projectList.innerHTML = '';
    try {
        const querySnapshot = await getDocs(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        querySnapshot.forEach(doc => {
            const project = doc.data();
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');
            projectItem.innerHTML = `
                <h3>${project.customerName}</h3>
                <p><strong>Info:</strong> ${project.projectInfo}</p>
                <p><strong>Supplier:</strong> ${project.supplierName}</p>
                <p><strong>Status:</strong> ${project.status}</p>
                <button data-id="${doc.id}" class="edit-btn">Edit</button>
            `;
            projectList.appendChild(projectItem);
        });
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

// Add new project
addProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const customerName = customerNameInput.value;
    const projectInfo = projectInfoInput.value;
    const supplierName = supplierNameInput.value;
    try {
        await addDoc(collection(db, 'projects'), {
            customerName: customerName,
            projectInfo: projectInfo,
            supplierName: supplierName,
            status: 'request for a quote',
            createdAt: serverTimestamp()
        });
        addProjectForm.reset();
        loadProjects();
    } catch (error) {
        console.error("Error adding project:", error);
    }
});

// Project editing (basic implementation, needs modal/form)
projectList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-btn')) {
        const projectId = e.target.dataset.id;
        // Implement edit functionality (e.g., open a modal with a form)
        console.log("Edit project:", projectId);
    }
});

// Search functionality
searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';
    if (searchTerm) {
        try {
            const querySnapshot = await getDocs(collection(db, 'projects'));
            querySnapshot.forEach(doc => {
                const project = doc.data();
                if (project.customerName.toLowerCase().includes(searchTerm) ||
                    project.projectInfo.toLowerCase().includes(searchTerm) ||
                    project.supplierName.toLowerCase().includes(searchTerm)) {
                    const searchItem = document.createElement('div');
                    searchItem.innerHTML = `
                        <h3>${project.customerName}</h3>
                        <p><strong>Info:</strong> ${project.projectInfo}</p>
                        <p><strong>Supplier:</strong> ${project.supplierName}</p>
                        <p><strong>Status:</strong> ${project.status}</p>
                    `;
                    searchResults.appendChild(searchItem);
                }
            });
        } catch (error) {
            console.error("Error searching projects:", error);
        }
    }
});