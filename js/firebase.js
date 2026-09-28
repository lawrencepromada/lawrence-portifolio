import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyC9wcdPN2o4gYLVUK4RKvINvN8Lqb7_eAQ",
 authDomain: "lawrence-portfolio-ea718.firebaseapp.com",
 projectId: "lawrence-portfolio-ea718",
 storageBucket: "lawrence-portfolio-ea718.firebasestorage.app",
 messagingSenderId: "784917883692",
 appId: "1:784917883692:web:b156d9c4d6529eab285a89"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
    app,
    db,
    collection,
    addDoc
};