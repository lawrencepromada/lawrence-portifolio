import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    collection,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
    app,
    db
} from "./firebase.js";


const auth =
    getAuth(app);


const adminEmail =
    document.getElementById("admin-email");


const logoutButton =
    document.getElementById("logout-button");


const projectList =
    document.getElementById("admin-project-list");


onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        adminEmail.textContent =
            `Signed in as ${user.email}`;


        await loadProjects();
    }
);


async function loadProjects() {

    try {

        const projectsSnapshot =
            await getDocs(
                collection(db, "projects")
            );


        projectList.innerHTML =
            "";


        if (projectsSnapshot.empty) {

            projectList.textContent =
                "No projects found.";

            return;
        }


        projectsSnapshot.forEach(
            (projectDoc) => {

                const project =
                    projectDoc.data();


                const row =
                    document.createElement("div");

                row.className =
                    "admin-project-row";


                const content =
                    document.createElement("div");


                const title =
                    document.createElement("h3");

                title.textContent =
                    project.title ||
                    "Untitled Project";


                const status =
                    document.createElement("p");

                status.textContent =
                    project.status ||
                    "";


                content.appendChild(title);
                content.appendChild(status);


                const actions =
                    document.createElement("div");

                actions.className =
                    "admin-project-actions";


                const editLink =
                    document.createElement("a");

                editLink.href =
                    `project-editor.html?id=${encodeURIComponent(
                        projectDoc.id
                    )}`;

                editLink.className =
                    "admin-secondary-button";

                editLink.textContent =
                    "Edit";


                const deleteButton =
                    document.createElement("button");

                deleteButton.type =
                    "button";

                deleteButton.className =
                    "admin-delete-button";

                deleteButton.textContent =
                    "Delete";


                deleteButton.addEventListener(
                    "click",
                    async () => {

                        const confirmed =
                            confirm(
                                `Delete "${project.title || "this project"}"?`
                            );


                        if (!confirmed) {

                            return;
                        }


                        deleteButton.disabled =
                            true;

                        deleteButton.textContent =
                            "Deleting...";


                        try {

                            await deleteDoc(
                                doc(
                                    db,
                                    "projects",
                                    projectDoc.id
                                )
                            );


                            row.remove();


                        } catch (error) {

                            console.error(
                                "Failed to delete project:",
                                error
                            );


                            deleteButton.disabled =
                                false;

                            deleteButton.textContent =
                                "Delete";


                            alert(
                                "Unable to delete project."
                            );
                        }
                    }
                );


                actions.appendChild(editLink);
                actions.appendChild(deleteButton);


                row.appendChild(content);
                row.appendChild(actions);


                projectList.appendChild(row);
            }
        );


    } catch (error) {

        console.error(
            "Failed to load projects:",
            error
        );


        projectList.textContent =
            "Unable to load projects.";
    }
}


logoutButton.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            window.location.href =
                "login.html";


        } catch (error) {

            console.error(
                "Logout failed:",
                error
            );
        }
    }
);