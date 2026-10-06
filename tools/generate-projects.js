import {
    initializeApp
} from "firebase/app";

import {
    getFirestore,
    collection,
    getDocs
} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyC9wcdPN2o4gYLVUK4RKvINvN8Lqb7_eAQ",
    authDomain: "lawrence-portfolio-ea718.firebaseapp.com",
    projectId: "lawrence-portfolio-ea718",
    storageBucket: "lawrence-portfolio-ea718.firebasestorage.app",
    messagingSenderId: "784917883692",
    appId: "1:784917883692:web:b156d9c4d6529eab285a89"
};


const app =
    initializeApp(
        firebaseConfig
    );


const db =
    getFirestore(app);


import {
    writeFile,
    readFile,
    mkdir
} from "node:fs/promises";

import {
    fileURLToPath
} from "node:url";

import path from "node:path";


const currentFile =
    fileURLToPath(import.meta.url);

const toolsDirectory =
    path.dirname(currentFile);

const projectDirectory =
    path.resolve(
        toolsDirectory,
        "../projects"
    );

const dataDirectory =
    path.resolve(
        toolsDirectory,
        "../data"
    );


async function generateProjects() {

    console.log(
        "Reading projects from Firestore..."
    );


    const projectsSnapshot =
        await getDocs(
            collection(db, "projects")
        );


    const projects = [];


    projectsSnapshot.forEach(
        (projectDoc) => {

            projects.push(
                projectDoc.data()
            );

        }
    );


    console.log(
        `Found ${projects.length} project(s).`
    );


    await mkdir(
        projectDirectory,
        {
            recursive: true
        }
    );


    await mkdir(
        dataDirectory,
        {
            recursive: true
        }
    );


    await writeFile(
        path.join(
            dataDirectory,
            "projects.json"
        ),
        JSON.stringify(
            projects,
            null,
            4
        ),
        "utf8"
    );


    console.log(
        "Updated data/projects.json"
    );


    await createProjectsPage(
        projects
    );


    console.log(
        "Updated pages/projects.html"
    );


    await createHomePage(
        projects
    );


    console.log(
        "Updated index.html"
    );


    for (const project of projects) {

        if (!project.slug) {

            console.warn(
                "Skipping project without slug:",
                project.title || "Untitled project"
            );

            continue;
        }


        const html =
            createProjectPage(
                project
            );


        await writeFile(
            path.join(
                projectDirectory,
                `${project.slug}.html`
            ),
            html,
            "utf8"
        );


        console.log(
            `Generated projects/${project.slug}.html`
        );
    }


    console.log(
        "Project generation complete."
    );
}


function escapeHtml(value) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


async function createProjectsPage(projects) {

    const projectsMarkup =
        projects
            .filter(
                project =>
                    project.slug
            )
            .map(
                project => `

        <article class="project-item">

            <div class="project-item-content">

                <div class="project-item-heading">

                    <h2>
                        ${escapeHtml(project.title)}
                    </h2>

                    <span class="project-status">
                        ${escapeHtml(project.status)}
                    </span>

                </div>


                <p class="project-item-description">
                    ${escapeHtml(project.shortDescription)}
                </p>


                <p class="project-item-meta">
                    ${escapeHtml(project.technologies)}
                </p>

            </div>


            <a
                href="../projects/${escapeHtml(project.slug)}.html"
                class="project-item-link"
            >
                View Project →
            </a>

        </article>

            `
            )
            .join("");


    const projectsList =
        projectsMarkup ||
        `
            <p class="projects-loading">
                No projects available yet.
            </p>
        `;


    const html = `<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Projects | Lawrence Pro Mada</title>

    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/components.css">
    <link rel="stylesheet" href="../css/projects.css">

</head>


<body>

    <header class="site-header">

        <nav class="site-nav">

            <a href="../index.html" class="site-brand">
                LAWRENCE PRO MADA
            </a>

            <div class="nav-links">

                <a href="../index.html">
                    Home
                </a>

                <a href="projects.html" class="active">
                    Projects
                </a>

                <a href="about.html">
                    About
                </a>

                <a href="contact.html">
                    Contact
                </a>

            </div>

        </nav>

    </header>


    <main>

        <section class="projects-page">

            <div class="projects-page-header">

                <div class="projects-page-title">

                    <p class="section-eyebrow">
                        PROJECTS
                    </p>

                    <h1>
                        Things I've Built
                    </h1>

                </div>


                <div class="projects-page-intro">

                    <p>
                        A collection of digital projects I've built,
                        developed, tested, and explored while learning
                        and working with technology.
                    </p>

                </div>

            </div>


            <div class="projects-list" id="projects-list">

                ${projectsList}

            </div>

        </section>

    </main>


    <footer class="site-footer">

        <div class="site-footer-inner">

            <div class="site-footer-main">

                <div class="site-footer-brand">

                    <a href="../index.html" class="footer-brand">
                        LAWRENCE PRO MADA
                    </a>

                    <p>
                        Building practical digital solutions
                        and bringing ideas into existence.
                    </p>

                </div>


                <div class="site-footer-contact">

                    <p class="footer-label">
                        CONTACT
                    </p>

                    <a href="tel:+256753286080">
                        +256 753 286 080
                    </a>

                    <a
                        href="https://wa.me/256794472573"
                        target="_blank"
                    >
                        WhatsApp
                    </a>

                    <a href="../admin/login.html">
                        Admin Login →
                    </a>

                </div>


                <div class="site-footer-links">

                    <p class="footer-label">
                        CONNECT
                    </p>

                    <a
                        href="https://linkedin.com/in/madara-lawrence-aa08933b5"
                        target="_blank"
                    >
                        LinkedIn
                    </a>

                    <a
                        href="https://github.com/lawrencepromada"
                        target="_blank"
                    >
                        GitHub
                    </a>

                    <a
                        href="https://www.tiktok.com/@lawrencepro.mada"
                        target="_blank"
                    >
                        TikTok
                    </a>

                    <a
                        href="https://www.youtube.com/@LawrencePromada-p3c"
                        target="_blank"
                    >
                        YouTube
                    </a>

                </div>

            </div>


            <div class="site-footer-bottom">

                <p>
                    © 2026 Lawrence Pro Mada. All rights reserved.
                </p>

                <p>
                    Madara Lawrence
                </p>

            </div>

        </div>

    </footer>

</body>

</html>`;


    await writeFile(
        path.resolve(
            toolsDirectory,
            "../pages/projects.html"
        ),
        html,
        "utf8"
    );
}


async function createHomePage(projects) {

    const projectsMarkup =
        projects
            .filter(
                project =>
                    project.slug
            )
            .map(
                project => `

        <article class="project-preview">

            <div class="project-preview-main">

                <div class="project-preview-heading">

                    <h3>
                        ${escapeHtml(project.title)}
                    </h3>

                    <span class="project-status">
                        ${escapeHtml(project.status)}
                    </span>

                </div>


                <p>
                    ${escapeHtml(project.shortDescription)}
                </p>

            </div>


            <a
                href="projects/${escapeHtml(project.slug)}.html"
                class="project-preview-link"
            >
                View Project →
            </a>

        </article>

            `
            )
            .join("");


    const projectsList =
        projectsMarkup ||
        `
            <p class="projects-loading">
                No projects available yet.
            </p>
        `;


    const indexPath =
        path.resolve(
            toolsDirectory,
            "../index.html"
        );


    const currentIndex =
        await readFile(
            indexPath,
            "utf8"
        );


    const startMarker =
        "<!-- PROJECTS_PREVIEW_START -->";


    const endMarker =
        "<!-- PROJECTS_PREVIEW_END -->";


    const startIndex =
        currentIndex.indexOf(
            startMarker
        );


    if (startIndex === -1) {

        throw new Error(
            "Could not find homepage projects start marker."
        );

    }


    const contentStart =
        startIndex +
        startMarker.length;


    const endIndex =
        currentIndex.indexOf(
            endMarker,
            contentStart
        );


    if (endIndex === -1) {

        throw new Error(
            "Could not find homepage projects end marker."
        );

    }


    const updatedIndex =
        currentIndex.slice(
            0,
            contentStart
        ) +
        `

            ${projectsList}

        ` +
        currentIndex.slice(
            endIndex
        );


    await writeFile(
        indexPath,
        updatedIndex,
        "utf8"
    );
}


function createProjectPage(project) {

    const features =
        String(
            project.features || ""
        )
            .split(",")
            .map(
                feature =>
                    feature.trim()
            )
            .filter(
                feature =>
                    feature
            );


    const featureMarkup =
        features
            .map(
                feature => `
                    <p class="project-feature">
                        → ${escapeHtml(feature)}
                    </p>
                `
            )
            .join("");


    const coverImageMarkup =
        project.coverImage
            ? `
                <div class="project-cover">
                    <img
                        src="${escapeHtml(project.coverImage)}"
                        alt="${escapeHtml(
                            project.title || "Project"
                        )} cover image"
                    >
                </div>
            `
            : "";


    const githubMarkup =
        project.githubUrl
            ? `
                <a
                    href="${escapeHtml(project.githubUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on GitHub →
                </a>
            `
            : "";


    const demoMarkup =
        project.demoUrl
            ? `
                <a
                    href="${escapeHtml(project.demoUrl)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Live Project →
                </a>
            `
            : "";


    return `<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${escapeHtml(project.title || "Project")}
        | Lawrence Pro Mada
    </title>

    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/components.css">
    <link rel="stylesheet" href="../css/project.css">

</head>


<body>

    <header class="site-header">

        <nav class="site-nav">

            <a href="../index.html" class="site-brand">
                LAWRENCE PRO MADA
            </a>

            <div class="nav-links">

                <a href="../index.html">
                    Home
                </a>

                <a href="../pages/projects.html" class="active">
                    Projects
                </a>

                <a href="../pages/about.html">
                    About
                </a>

                <a href="../pages/contact.html">
                    Contact
                </a>

            </div>

        </nav>

    </header>


    <main>

        <section class="project-page">

            <div class="project-page-header">

                <div class="project-page-title">

                    <p class="section-eyebrow">
                        ${escapeHtml(project.status)}
                    </p>

                    <h1>
                        ${escapeHtml(project.title)}
                    </h1>

                </div>


                <div class="project-page-intro">

                    <p>
                        ${escapeHtml(project.shortDescription)}
                    </p>

                    <p>
                        ${escapeHtml(project.technologies)}
                    </p>

                </div>

            </div>


            ${coverImageMarkup}


            <section class="project-section">

                <div class="project-section-label">

                    <p class="section-eyebrow">
                        OVERVIEW
                    </p>

                </div>


                <div class="project-section-content">

                    <p>
                        ${escapeHtml(project.description)}
                    </p>

                </div>

            </section>


            <section class="project-section">

                <div class="project-section-label">

                    <p class="section-eyebrow">
                        THE PROBLEM
                    </p>

                </div>


                <div class="project-section-content">

                    <p>
                        ${escapeHtml(project.problem)}
                    </p>

                </div>

            </section>


            <section class="project-section">

                <div class="project-section-label">

                    <p class="section-eyebrow">
                        THE SOLUTION
                    </p>

                </div>


                <div class="project-section-content">

                    <p>
                        ${escapeHtml(project.solution)}
                    </p>

                </div>

            </section>


            <section class="project-section">

                <div class="project-section-label">

                    <p class="section-eyebrow">
                        FEATURES
                    </p>

                </div>


                <div class="project-section-content project-features">

                    ${featureMarkup}

                </div>

            </section>


            <section class="project-section">

                <div class="project-section-label">

                    <p class="section-eyebrow">
                        DEVELOPMENT
                    </p>

                </div>


                <div class="project-section-content">

                    <p>
                        ${escapeHtml(project.development)}
                    </p>

                </div>

            </section>


            <section class="project-section">

                <div class="project-section-label">

                    <p class="section-eyebrow">
                        RESULT
                    </p>

                </div>


                <div class="project-section-content">

                    <p>
                        ${escapeHtml(project.result)}
                    </p>

                </div>

            </section>


            <section class="project-links-section">

                <div class="project-links">

                    ${githubMarkup}

                    ${demoMarkup}

                </div>

            </section>

        </section>

    </main>


    <footer class="site-footer">

        <div class="site-footer-inner">

            <div class="site-footer-main">

                <div class="site-footer-brand">

                    <a
                        href="../index.html"
                        class="footer-brand"
                    >
                        LAWRENCE PRO MADA
                    </a>

                    <p>
                        Building practical digital solutions
                        and bringing ideas into existence.
                    </p>

                </div>


                <div class="site-footer-contact">

                    <p class="footer-label">
                        CONTACT
                    </p>

                    <a href="tel:+256753286080">
                        +256 753 286 080
                    </a>

                    <a
                        href="https://wa.me/256794472573"
                        target="_blank"
                    >
                        WhatsApp
                    </a>

                    <a href="../admin/login.html">
                        Admin Login →
                    </a>

                </div>


                <div class="site-footer-links">

                    <p class="footer-label">
                        CONNECT
                    </p>

                    <a
                        href="https://linkedin.com/in/madara-lawrence-aa08933b5"
                        target="_blank"
                    >
                        LinkedIn
                    </a>

                    <a
                        href="https://github.com/lawrencepromada"
                        target="_blank"
                    >
                        GitHub
                    </a>

                    <a
                        href="https://www.tiktok.com/@lawrencepro.mada"
                        target="_blank"
                    >
                        TikTok
                    </a>

                    <a
                        href="https://www.youtube.com/@LawrencePromada-p3c"
                        target="_blank"
                    >
                        YouTube
                    </a>

                </div>

            </div>


            <div class="site-footer-bottom">

                <p>
                    © 2026 Lawrence Pro Mada. All rights reserved.
                </p>

                <p>
                    Madara Lawrence
                </p>

            </div>

        </div>

    </footer>

</body>

</html>`;
}


generateProjects().catch(
    (error) => {

        console.error(
            "Project generation failed:",
            error
        );

        process.exit(1);
    }
);