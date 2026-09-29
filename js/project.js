import {
    db
} from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const projectStatus =
    document.getElementById("project-status");

const projectTitle =
    document.getElementById("project-title");

const projectShortDescription =
    document.getElementById("project-short-description");

const projectDescription =
    document.getElementById("project-description");

const projectProblem =
    document.getElementById("project-problem");

const projectSolution =
    document.getElementById("project-solution");

const projectFeatures =
    document.getElementById("project-features");

const projectTechnologies =
    document.getElementById("project-technologies");

const projectDevelopment =
    document.getElementById("project-development");

const projectResult =
    document.getElementById("project-result");

const projectGithub =
    document.getElementById("project-github");

const projectDemo =
    document.getElementById("project-demo");

const projectCoverImage =
    document.getElementById("project-cover-image");


const params =
    new URLSearchParams(
        window.location.search
    );


const projectSlug =
    params.get("id");


async function loadProject() {

    if (!projectSlug) {

        projectTitle.textContent =
            "Project not found.";

        return;
    }


    try {

        const projectsSnapshot =
            await getDocs(
                collection(db, "projects")
            );


        let project = null;


        projectsSnapshot.forEach(
            (projectDoc) => {

                const data =
                    projectDoc.data();


                if (
                    data.slug ===
                    projectSlug
                ) {

                    project = data;
                }
            }
        );


        if (!project) {

            projectTitle.textContent =
                "Project not found.";

            return;
        }


        /* ================================
           BASIC PROJECT INFORMATION
        ================================= */

        projectTitle.textContent =
            project.title || "";


        projectStatus.textContent =
            project.status || "";


        projectShortDescription.textContent =
            project.shortDescription || "";

if (project.coverImage) {
    projectCoverImage.src = project.coverImage;
    projectCoverImage.alt =
        `${project.title || "Project"} cover image`;
    } else {
    projectCoverImage.parentElement.style.display = "none";
}


        projectDescription.textContent =
            project.description || "";

if (project.coverImage) {
    projectCoverImage.src = project.coverImage;
    projectCoverImage.alt =
        `${project.title || "Project"} cover image`;
 } else {
    projectCoverImage.parentElement.style.display = "none";
}

        projectTechnologies.textContent =
            project.technologies || "";


        projectProblem.textContent =
            project.problem || "";


        projectSolution.textContent =
            project.solution || "";


        projectDevelopment.textContent =
            project.development || "";


        projectResult.textContent =
            project.result || "";


        /* ================================
           FEATURES
        ================================= */

        projectFeatures.innerHTML = "";


        if (project.features) {

            const features =
                project.features
                    .split(",")
                    .map(
                        feature =>
                            feature.trim()
                    )
                    .filter(
                        feature =>
                            feature
                    );


            features.forEach(
                (feature) => {

                    const item =
                        document.createElement(
                            "p"
                        );


                    item.className =
                        "project-feature";


                    item.textContent =
                        "→ " + feature;


                    projectFeatures.appendChild(
                        item
                    );
                }
            );
        }


        /* ================================
           GITHUB LINK
        ================================= */

        if (project.githubUrl) {

            projectGithub.href =
                project.githubUrl;

        } else {

            projectGithub.style.display =
                "none";
        }


        /* ================================
           DEMO LINK
        ================================= */

        if (project.demoUrl) {

            projectDemo.href =
                project.demoUrl;

        } else {

            projectDemo.style.display =
                "none";
        }


        /* ================================
           PAGE TITLE
        ================================= */

        document.title =
            `${project.title} | Lawrence Pro Mada`;


    } catch (error) {

        console.error(
            "Failed to load project:",
            error
        );


        projectTitle.textContent =
            "Unable to load project.";
    }
}


loadProject();