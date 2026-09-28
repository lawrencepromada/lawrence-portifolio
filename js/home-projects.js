import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const projectsPreviewList =
    document.getElementById("projects-preview-list");


async function loadHomeProjects() {

    try {

        const projectsSnapshot =
            await getDocs(
                collection(db, "projects")
            );


        projectsPreviewList.innerHTML = "";


        if (projectsSnapshot.empty) {

            projectsPreviewList.innerHTML = `
                <p class="projects-loading">
                    No projects available yet.
                </p>
            `;

            return;
        }


        projectsSnapshot.forEach(
            (projectDoc) => {

                const project =
                    projectDoc.data();


                const article =
                    document.createElement("article");

                article.className =
                    "project-preview";


                const main =
                    document.createElement("div");

                main.className =
                    "project-preview-main";


                const heading =
                    document.createElement("div");

                heading.className =
                    "project-preview-heading";


                const title =
                    document.createElement("h3");

                title.textContent =
                    project.title || "";


                const status =
                    document.createElement("span");

                status.className =
                    "project-status";

                status.textContent =
                    project.status || "";


                heading.appendChild(title);
                heading.appendChild(status);


                const description =
                    document.createElement("p");

                description.textContent =
                    project.shortDescription || "";


                main.appendChild(heading);
                main.appendChild(description);


                const link =
                    document.createElement("a");

                link.href =
                    `pages/project.html?id=${encodeURIComponent(
                        project.slug
                    )}`;

                link.className =
                    "project-preview-link";

                link.textContent =
                    "View Project →";


                article.appendChild(main);
                article.appendChild(link);


                projectsPreviewList.appendChild(article);
            }
        );


    } catch (error) {

        console.error(
            "Failed to load homepage projects:",
            error
        );


        projectsPreviewList.innerHTML = `
            <p class="projects-loading">
                Unable to load projects.
            </p>
        `;
    }
}


loadHomeProjects();