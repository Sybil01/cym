
```dataviewjs
const tagTarget = "dss/case/instruments"; // Target tag for filtering
const propertiesShow = ["year", "person"]; // YAML fields to display
const descriptionWordLimit = 200; // Word limit for tall layout description
const shortDescriptionWordLimit = 100; // Word limit for compact layout description
const sortBy = "year"; // Property to sort by
const sortDirection = "ASC"; // Sorting direction: ASC or DESC
const thumbSize = 200; // Thumbnail size in pixels

const pages = dv.pages()
    .where(p =>
        p.tags &&
        (Array.isArray(p.tags)
            ? p.tags.some(tag => typeof tag === "string" && tag.startsWith(tagTarget))
            : typeof p.tags === "string" && p.tags.startsWith(tagTarget))
        && !/^t-.*/.test(p.file.name)) // Filter notes
    .sort(p => p[sortBy], sortDirection === "ASC" ? "asc" : "desc"); // Sort by specified property

if (pages.length > 0) {
    const extractImage = async (page) => {
        if (page.img && typeof page.img === "string" && page.img.trim()) {
            return page.img.startsWith("http") ? page.img : dv.io.normalizePath(page.img);
        }
        const fileContent = await app.vault.read(app.vault.getAbstractFileByPath(page.file.path));
        const match = fileContent.match(/!\[.*?\]\((.*?)\)/);
        return match ? match[1] : null;
    };

    const renderItem = async (page, isCompact) => {
        const imgSrc = await extractImage(page);
        const name = page.file.name.replace(/\.md$/, "");

        const renderedFields = propertiesShow.map(property => `
            <div style="margin: 3px 0; color: #BDD5FC;">
                ${
                    property === "person"
                        ? `<a href="#" class="person-link" data-field="${property}" data-value="${page[property]}" style="text-decoration: none; color: #ABABAB;">${page[property] || ""}</a>`
                        : `${page[property] || ""}`
                }
            </div>
        `).join("");

        const fileContent = await app.vault.read(app.vault.getAbstractFileByPath(page.file.path));
        const contentParts = fileContent.split("---");
        const descriptionContent = contentParts.length > 2 ? contentParts[2] : fileContent;
        const cleanContent = descriptionContent.replace(/!\[.*?\]\(.*?\)/g, ""); // Remove image markdown
        const words = cleanContent.split(/\s+/).slice(0, isCompact ? shortDescriptionWordLimit : descriptionWordLimit);
        const description = `
            <div style="
                color: var(--text-normal); 
                font-size: 0.9em;
                display: -webkit-box; 
                -webkit-line-clamp: 4; 
                -webkit-box-orient: vertical; 
                overflow: hidden; 
                text-overflow: ellipsis;">
                ${words.join(" ")}...
            </div>`;

        const layoutStyles = isCompact
            ? "display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;"
            : "display: flex; flex-direction: row; align-items: flex-start; gap: 10px;";

        // Strict square thumbnail styles
        const imageStyles = `width: ${thumbSize}px; height: ${thumbSize}px; object-fit: cover; object-position: center; border-radius: 5px; cursor: pointer; background-color: var(--background-secondary); display: block;`;

        return `
            <div class="timeline-item" style="padding: 10px; background-color: var(--background-primary); border-radius: 8px; margin: 10px 0; ${layoutStyles}">
                <a href="#" class="image-link" data-path="${page.file.path}" style="display: block; width: ${thumbSize}px; height: ${thumbSize}px; overflow: hidden; flex-shrink: 0;">
                    ${imgSrc
                        ? `<img src="${imgSrc}" alt="${name}" style="${imageStyles}">`
                        : `<div style="${imageStyles}; border-radius: 5px;"></div>`
                    }
                </a>
                <div style="flex: 1;">
                    <h3 style="margin: 5px 0; color: #ABABAB; font-size: 1.2em;">
                        <a href="#" class="name-link" data-path="${page.file.path}" style="text-decoration: none; color: #ABABAB;">${name}</a>
                    </h3>
                    ${renderedFields}
                    ${description}
                </div>
            </div>
        `;
    };

    const updateLayout = async () => {
        const isCompact = window.innerWidth < 300; // Updated to 300px for compact layout
        const items = await Promise.all(pages.map(page => renderItem(page, isCompact)));
        dv.container.innerHTML = `
            <div class="timeline-container" style="display: flex; flex-direction: column; gap: 10px;">
                ${items.join("")}
            </div>
        `;

        // Add click listeners for name links and image links
        document.querySelectorAll(".name-link, .image-link").forEach(link => {
            link.addEventListener("click", async (e) => {
                e.preventDefault();
                const path = link.dataset.path;
                if (path) {
                    const leaf = app.workspace.splitActiveLeaf();
                    leaf.openFile(app.vault.getAbstractFileByPath(path), { state: { mode: "preview" } });
                }
            });
        });

        // Add click listeners for person links
        document.querySelectorAll(".person-link").forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const field = link.dataset.field;
                const value = link.dataset.value;
                new Notice(`Clicked on ${field}: ${value}`);
            });
        });
    };

    updateLayout(); // Initial rendering

    // Attach a listener for resizing
    window.addEventListener("resize", updateLayout);
} else {
    dv.paragraph("No notes found matching the criteria.");
}
```
