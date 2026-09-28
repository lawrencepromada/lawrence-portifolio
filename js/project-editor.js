console.log("PROJECT EDITOR JS IS RUNNING");
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";



import {
    app,
    db
} from "./firebase.js";


const auth = getAuth(app);

const projectForm =
    document.getElementById("project-form");

const projectMessage =
    document.getElementById("project-message");


let currentUser = null;

const params =
    new URLSearchParams(window.location.search);

const projectId =
    params.get("id");
    
    console.log("Project ID:", projectId);

async function loadProject() {

    if (!projectId) {
        return;
    }

    try {

        const projectReference =
            doc(db, "projects", projectId);

        const projectSnapshot =
            await getDoc(projectReference);

        if (!projectSnapshot.exists()) {

            projectMessage.textContent =
                "Project not found.";

            return;
        }

        const project =
            projectSnapshot.data();

        document.getElementById("title").value =
            project.title || "";

        document.getElementById("slug").value =
            project.slug || "";

        document.getElementById("status").value =
            project.status || "";

        document.getElementById("shortDescription").value =
            project.shortDescription || "";

        document.getElementById("description").value =
            project.description || "";

        document.getElementById("technologies").value =
            project.technologies || "";

        document.getElementById("features").value =
            project.features || "";

        document.getElementById("githubUrl").value =
            project.githubUrl || "";

        document.getElementById("demoUrl").value =
            project.demoUrl || "";

        document.getElementById("coverImage").value =
            project.coverImage || "";

        document.getElementById("images").value =
            project.images || "";

        document.getElementById("problem").value =
            project.problem || "";

        document.getElementById("solution").value =
            project.solution || "";

        document.getElementById("development").value =
            project.development || "";

        document.getElementById("result").value =
            project.result || "";

    } catch (error) {

        console.error(
            "Failed to load project:",
            error
        );

        projectMessage.textContent =
            "Unable to load project.";
    }
}


onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }

    currentUser = user;
});


projectForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentUser) {

            projectMessage.textContent =
                "You must be signed in.";

            return;
        }


        projectMessage.textContent =
            "Saving project...";


        const project = {

            title:
                document
                    .getElementById("title")
                    .value
                    .trim(),

            slug:
                document
                    .getElementById("slug")
                    .value
                    .trim(),

            status:
                document
                    .getElementById("status")
                    .value
                    .trim(),

            shortDescription:
                document
                    .getElementById("shortDescription")
                    .value
                    .trim(),

            description:
                document
                    .getElementById("description")
                    .value
                    .trim(),

            technologies:
                document
                    .getElementById("technologies")
                    .value
                    .trim(),

            features:
                document
                    .getElementById("features")
                    .value
                    .trim(),

            githubUrl:
                document
                    .getElementById("githubUrl")
                    .value
                    .trim(),

            demoUrl:
                document
                    .getElementById("demoUrl")
                    .value
                    .trim(),

            coverImage:
                document
                    .getElementById("coverImage")
                    .value
                    .trim(),

            images:
                document
                    .getElementById("images")
                    .value
                    .trim(),

            problem:
                document
                    .getElementById("problem")
                    .value
                    .trim(),

            solution:
                document
                    .getElementById("solution")
                    .value
                    .trim(),

            development:
                document
                    .getElementById("development")
                    .value
                    .trim(),

            result:
                document
                    .getElementById("result")
                    .value
                    .trim()
        };


        try {

            if (projectId) {

    const projectReference =
        doc(db, "projects", projectId);

    await updateDoc(
        projectReference,
        project
    );

    projectMessage.textContent =
        "Project updated successfully.";

} else {

    await addDoc(
        collection(db, "projects"),
        project
    );

    projectMessage.textContent =
        "Project saved successfully.";

    projectForm.reset();
}


        } catch (error) {

            console.error(
                "Failed to save project:",
                error
            );

            projectMessage.textContent =
                "Unable to save project.";
        }
    }
);

if (projectId) {
    loadProject();
}