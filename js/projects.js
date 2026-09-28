import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const projectsList =
    document.getElementById("projects-list");


async function loadProjects() {

    try {

        const projectsSnapshot =
            await getDocs(
                collection(db, "projects")
            );


        projectsList.innerHTML = "";


        if (projectsSnapshot.empty) {

            projectsList.innerHTML = `
                <p class="projects-loading">
                    No projects available yet.
                </p>
            `;

            return;
        }


        projectsSnapshot.forEach((doc) => {

            const project =
                doc.data();


            const article =
                document.createElement("article");

            article.className =
                "project-item";


            article.innerHTML = `

                <div class="project-item-content">

                    <div class="project-item-heading">

                        <h2>
                            ${project.title || ""}
                        </h2>

                        <span class="project-status">
                            ${project.status || ""}
                        </span>

                    </div>

                    <p class="project-item-description">
                        ${project.shortDescription || ""}
                    </p>

                    <p class="project-item-meta">
                        ${project.technologies || ""}
                    </p>

                </div>

                <a
                    href="project.html?id=${encodeURIComponent(project.slug)}"
                    class="project-item-link"
                >
                    View Project →
                </a>

            `;


            projectsList.appendChild(article);

        });


    } catch (error) {

        console.error(
            "Failed to load projects:",
            error
        );

        projectsList.innerHTML = `
            <p class="projects-loading">
                Unable to load projects.
            </p>
        `;

    }

}


loadProjects();