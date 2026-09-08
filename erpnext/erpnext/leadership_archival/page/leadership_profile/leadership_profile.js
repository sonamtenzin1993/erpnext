
// frappe.pages["leadership-profile"].on_page_load = function (wrapper) {

//     // =========================================================
//     // CREATE FRAPPE PAGE
//     // =========================================================

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: "Profile",
//         single_column: true
//     });


//     // =========================================================
//     // REMOVE DEFAULT FRAPPE SPACING
//     // =========================================================

//     $(wrapper).find(".layout-main-section").css({
//         "padding": "0",
//         "background": "#f7f8fa",
//         "width": "100%"
//     });


//     // =========================================================
//     // GET PROFILE FROM ROUTE
//     // =========================================================

//     let route = frappe.get_route();
//     let profile = route[1];

//     if (!profile) {

//         $(wrapper).find(".layout-main-section").html(`
//             <div class="leadership-profile-page">
//                 <div class="alert alert-warning">
//                     No profile selected.
//                 </div>
//             </div>
//         `);

//         return;
//     }


//     // =========================================================
//     // GET KEY PERSON REGISTRY
//     // =========================================================

//     frappe.call({

//         method: "frappe.client.get",

//         args: {
//             doctype: "Key Person Registry",
//             name: profile
//         },

//         callback: function (r) {

//             // =====================================================
//             // CHECK RESPONSE
//             // =====================================================

//             if (!r || !r.message) {

//                 $(wrapper).find(".layout-main-section").html(`
//                     <div class="leadership-profile-page">
//                         <div class="alert alert-danger">
//                             Leadership profile not found.
//                         </div>
//                     </div>
//                 `);

//                 return;
//             }


//             // =====================================================
//             // PERSON DATA
//             // =====================================================

//             let person = r.message;


//             // =====================================================
//             // CHILD TABLE DATA
//             // =====================================================

//             let professional_information =
//                 person.professional_information || [];

//             let award_recognition =
//                 person.award_recognition || [];


//             // =====================================================
//             // SERVICE JOURNEY
//             // =====================================================

//             let timeline_html = [...professional_information]
//                 .sort((a, b) => {

//                     let yearA =
//                         parseInt(
//                             a.start_term?.split("-")[0]
//                         ) || 0;

//                     let yearB =
//                         parseInt(
//                             b.start_term?.split("-")[0]
//                         ) || 0;

//                     return yearA - yearB;

//                 })
//                 .map((row) => {

//                     let year = "";

//                     if (row.start_term) {
//                         year = row.start_term.split("-")[0];
//                     }

//                     return `
//                         <div class="timeline-item">

//                             <div class="timeline-dot"></div>

//                             <strong>
//                                 ${year}
//                             </strong>

//                             <span>
//                                 ${row.position || ""}
//                             </span>

//                         </div>
//                     `;

//                 })
//                 .join("");


//             // =====================================================
//             // KEY POSITIONS
//             // =====================================================

//             let positions_html = [...professional_information]
//                 .sort((a, b) => {

//                     let dateA = a.start_term
//                         ? new Date(a.start_term)
//                         : new Date(0);

//                     let dateB = b.start_term
//                         ? new Date(b.start_term)
//                         : new Date(0);

//                     return dateA - dateB;

//                 })
//                 .map((row) => {

//                     return `
//                         <li>

//                             <span class="position-name">
//                                 ${row.position || ""}
//                             </span>

//                             <small>
//                                 ${row.start_term || ""}
//                                 -
//                                 ${row.end_term || ""}
//                             </small>

//                         </li>
//                     `;

//                 })
//                 .join("");


//             // =====================================================
//             // GET ATTACHMENTS / GALLERY
//             // =====================================================

//             frappe.db.get_list("File", {

//                 filters: {
//                     attached_to_doctype: "Key Person Registry",
//                     attached_to_name: profile
//                 },

//                 fields: [
//                     "name",
//                     "file_name",
//                     "file_url",
//                     "file_type",
//                     "is_private"
//                 ],

//                 limit: 100

//             }).then(files => {

//                 console.log(
//                     "[Leadership Profile] All attachments:",
//                     files
//                 );


//                 // =================================================
//                 // FILTER IMAGE FILES
//                 // =================================================

//                 let image_files = files.filter(file => {

//                     let file_name =
//                         file.file_name || "";

//                     let file_url =
//                         file.file_url || "";

//                     return (
//                         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file_name)
//                         ||
//                         /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(file_url)
//                     );

//                 });

//                 // =================================================
//                 // CREATE GALLERY HTML
//                 // =================================================

//                 let gallery_html = "";

//                 if (image_files.length) {

//                     // gallery_html = image_files
//                     //     .map((file) => {

//                     //         return `
//                     //             <div
//                     //                 class="gallery-item"
//                     //                 data-image-url="${file.file_url}"
//                     //             >

//                     //                 <img
//                     //                     src="${file.file_url}"
//                     //                     class="gallery-image"
//                     //                     alt="${file.file_name || "Gallery Image"}"
//                     //                     loading="lazy"
//                     //                 >

//                     //             </div>
//                     //         `;

//                     //     })
//                     //     .join("");

//                     // gallery_html = image_files
//                     // .map((file) => {

//                     //     return `
//                     //         <div
//                     //             class="gallery-item"
//                     //             data-image-url="${file.file_url}"
//                     //         >

//                     //             <img
//                     //                 src="${file.file_url}"
//                     //                 class="gallery-image"
//                     //                 alt="${file.file_name || "Gallery Image"}"
//                     //                 loading="lazy"
//                     //             >

//                     //         </div>
//                     //     `;

//                     // })
//                     // .join("");

//                     // gallery_html = image_files
//                     //     .map((file) => {
//                     //         return `
//                     //             <div class="photo-placeholder">

//                     //                 <a href="${file.file_url}" target="_blank">
//                     //                     <img
//                     //                         src="${file.file_url}"
//                     //                         alt="${file.file_name || "Gallery Image"}"
//                     //                         loading="lazy"
//                     //                     >
//                     //                 </a>

//                     //             </div>
//                     //         `;
//                     //     })
//                     //     .join("");

//                     gallery_html = image_files
//                     .map((file) => {

//                         return `
//                             <div
//                                 class="gallery-item"
//                                 data-image-url="${file.file_url}"
//                             >

//                                 <a
//                                     href="${file.file_url}"
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                 >
//                                     <img
//                                         src="${file.file_url}"
//                                         class="gallery-image"
//                                         alt="${file.file_name || "Gallery Image"}"
//                                         loading="lazy"
//                                     >
//                                 </a>

//                             </div>
//                         `;

//                     })
//                     .join("");

//                 } else {

//                     gallery_html = `
//                         <div class="gallery-empty">

//                             <i class="fa fa-image"></i>

//                             <span>
//                                 No gallery images available
//                             </span>

//                         </div>
//                     `;

//                 }


//                 // =================================================
//                 // GET ACHIEVEMENTS / KASHO DETAILS
//                 // =================================================

//                 frappe.call({

//                     method:
//                         "erpnext.api_setting.get_kasho_detail_by_cid",

//                     args: {
//                         cid: person.cid
//                     },

//                     callback: function (response) {

//                         // =========================================
//                         // ACHIEVEMENT DATA
//                         // =========================================

//                         let data =
//                             response.message || [];


//                         // =========================================
//                         // CREATE ACHIEVEMENT HTML
//                         // =========================================

//                         let achievements_html = data
//                             .map((row) => {

//                                 let parent =
//                                     row.parent || {};

//                                 let child =
//                                     row.child || {};

//                                 let achievement_title =
//                                     child.title || "";

//                                 let achievement_year = "";

//                                 if (parent.issue_date) {

//                                     achievement_year =
//                                         parent.issue_date
//                                             .split("-")[0];
//                                 }


//                                 let conferred_by =
//                                     child.conferred_by || "";


//                                 return `
//                                     <div class="achievement">

//                                         <div class="medal">
//                                             <i class="fa fa-trophy"></i>
//                                         </div>

//                                         <div class="achievement-content">

//                                             <strong>
//                                                 ${achievement_title}
//                                                 ${
//                                                     achievement_year
//                                                         ? `, ${achievement_year}`
//                                                         : ""
//                                                 }
//                                             </strong>

//                                             <small>
//                                                 Conferred by
//                                                 ${conferred_by}
//                                             </small>

//                                         </div>

//                                     </div>
//                                 `;

//                             })
//                             .join("");


//                         // =========================================
//                         // IF NO ACHIEVEMENTS
//                         // =========================================

//                         if (!achievements_html) {

//                             achievements_html = `
//                                 <div class="no-achievements">

//                                     <i class="fa fa-info-circle"></i>

//                                     <span>
//                                         No achievements or honors found.
//                                     </span>

//                                 </div>
//                             `;

//                         }


//                         // =========================================
//                         // MAIN PAGE
//                         // =========================================

//                         render_profile_page(
//                             wrapper,
//                             person,
//                             timeline_html,
//                             positions_html,
//                             achievements_html,
//                             gallery_html
//                         );

//                     },

//                     error: function (error) {

//                         console.error(
//                             "Failed to load Kasho details:",
//                             error
//                         );


//                         // =========================================
//                         // ACHIEVEMENT ERROR
//                         // =========================================

//                         let achievements_html = `
//                             <div class="no-achievements">

//                                 <i class="fa fa-exclamation-circle"></i>

//                                 <span>
//                                     Unable to load achievements.
//                                 </span>

//                             </div>
//                         `;


//                         // =========================================
//                         // STILL RENDER PROFILE + GALLERY
//                         // =========================================

//                         render_profile_page(
//                             wrapper,
//                             person,
//                             timeline_html,
//                             positions_html,
//                             achievements_html,
//                             gallery_html
//                         );

//                     }

//                 });

//             }).catch(error => {

//                 console.error(
//                     "[Leadership Profile] Failed to load attachments:",
//                     error
//                 );


//                 // =============================================
//                 // FALLBACK GALLERY
//                 // =============================================

//                 let gallery_html = `
//                     <div class="gallery-empty">

//                         <i class="fa fa-image"></i>

//                         <span>
//                             Unable to load gallery images.
//                         </span>

//                     </div>
//                 `;


//                 // =============================================
//                 // STILL GET ACHIEVEMENTS
//                 // =============================================

//                 frappe.call({

//                     method:
//                         "erpnext.api_setting.get_kasho_detail_by_cid",

//                     args: {
//                         cid: person.cid
//                     },

//                     callback: function (response) {

//                         let data =
//                             response.message || [];


//                         let achievements_html = data
//                             .map((row) => {

//                                 let parent =
//                                     row.parent || {};

//                                 let child =
//                                     row.child || {};

//                                 let achievement_title =
//                                     child.title || "";

//                                 let achievement_year = "";

//                                 if (parent.issue_date) {

//                                     achievement_year =
//                                         parent.issue_date
//                                             .split("-")[0];

//                                 }

//                                 let conferred_by =
//                                     child.conferred_by || "";


//                                 return `
//                                     <div class="achievement">

//                                         <div class="medal">
//                                             <i class="fa fa-trophy"></i>
//                                         </div>

//                                         <div class="achievement-content">

//                                             <strong>
//                                                 ${achievement_title}
//                                                 ${
//                                                     achievement_year
//                                                         ? `, ${achievement_year}`
//                                                         : ""
//                                                 }
//                                             </strong>

//                                             <small>
//                                                 Conferred by
//                                                 ${conferred_by}
//                                             </small>

//                                         </div>

//                                     </div>
//                                 `;

//                             })
//                             .join("");


//                         if (!achievements_html) {

//                             achievements_html = `
//                                 <div class="no-achievements">

//                                     <i class="fa fa-info-circle"></i>

//                                     <span>
//                                         No achievements or honors found.
//                                     </span>

//                                 </div>
//                             `;

//                         }


//                         render_profile_page(
//                             wrapper,
//                             person,
//                             timeline_html,
//                             positions_html,
//                             achievements_html,
//                             gallery_html
//                         );

//                     },

//                     error: function () {

//                         render_profile_page(
//                             wrapper,
//                             person,
//                             timeline_html,
//                             positions_html,
//                             `
//                                 <div class="no-achievements">

//                                     <i class="fa fa-exclamation-circle"></i>

//                                     <span>
//                                         Unable to load achievements.
//                                     </span>

//                                 </div>
//                             `,
//                             gallery_html
//                         );

//                     }

//                 });

//             });

//         }

//     });


//     // =========================================================
//     // RENDER PROFILE PAGE
//     // =========================================================

//     function render_profile_page(
//         wrapper,
//         person,
//         timeline_html,
//         positions_html,
//         achievements_html,
//         gallery_html
//     ) {

//         $(wrapper)
//             .find(".layout-main-section")
//             .html(`

//                 <div class="leadership-profile-page">

//                     <!-- =======================================
//                          THREE COLUMN LAYOUT
//                     ======================================== -->

//                     <div class="profile-grid">


//                         <!-- ===================================
//                              LEFT COLUMN
//                         ==================================== -->

//                         <aside class="profile-left">


//                             <!-- =================================
//                                  PROFILE CARD
//                             ================================== -->

//                             <div class="profile-card">


//                                 <!-- PROFILE PHOTO -->

//                                 <div class="profile-photo-wrapper">

//                                     ${
//                                         person.profile_photo
//                                         ?

//                                         `
//                                         <img
//                                             src="${person.profile_photo}"
//                                             class="profile-photo"
//                                             alt="${
//                                                 person.registry_name
//                                                 || "Profile Photo"
//                                             }"
//                                         >
//                                         `

//                                         :

//                                         `
//                                         <div class="profile-photo-placeholder">

//                                             <i class="fa fa-user"></i>

//                                         </div>
//                                         `
//                                     }

//                                 </div>


//                                 <!-- NAME -->

//                                 <h3>
//                                     ${person.registry_name || ""}
//                                 </h3>


//                                 <!-- DESIGNATION -->

//                                 <p class="muted">
//                                     ${person.designation || ""}
//                                 </p>


//                                 <!-- DIVIDER -->

//                                 <div class="profile-divider"></div>


//                                 <!-- CID -->

//                                 <div class="info-item">

//                                     <span class="info-label">
//                                         CID
//                                     </span>

//                                     <span class="info-value">
//                                         ${person.cid || "-"}
//                                     </span>

//                                 </div>


//                                 <!-- DATE OF BIRTH -->

//                                 <div class="info-item">

//                                     <span class="info-label">
//                                         Date of Birth
//                                     </span>

//                                     <span class="info-value">
//                                         ${person.dob || "-"}
//                                     </span>

//                                 </div>


//                                 <!-- DZONGKHAG -->

//                                 <div class="info-item">

//                                     <span class="info-label">
//                                         Dzongkhag
//                                     </span>

//                                     <span class="info-value">
//                                         ${person.dzongkhag || "-"}
//                                     </span>

//                                 </div>


//                                 <!-- GEWOG -->

//                                 <div class="info-item">

//                                     <span class="info-label">
//                                         Gewog
//                                     </span>

//                                     <span class="info-value">
//                                         ${person.gewog || "-"}
//                                     </span>

//                                 </div>


//                                 <!-- VILLAGE -->

//                                 <div class="info-item">

//                                     <span class="info-label">
//                                         Village
//                                     </span>

//                                     <span class="info-value">
//                                         ${person.village || "-"}
//                                     </span>

//                                 </div>


//                             </div>


//                             <!-- =================================
//                                  GALLERY
//                             ================================== -->

//                             <div class="profile-card profile-gallery">

//                                 <div class="card-title">

//                                     <i class="fa fa-picture-o"></i>

//                                     Gallery

//                                 </div>


//                                 <div class="photo-grid">

//                                     ${gallery_html}

//                                 </div>

//                             </div>


//                         </aside>


//                         <!-- ===================================
//                              MIDDLE COLUMN
//                         ==================================== -->

//                         <main class="profile-middle">


//                             <!-- =================================
//                                  SERVICE JOURNEY
//                             ================================== -->

//                             <section class="profile-card">

//                                 <div class="card-title">
//                                     Service Journey
//                                 </div>


//                                 <div class="timeline">

//                                     <!-- TIMELINE LINE -->

//                                     <div class="timeline-line"></div>


//                                     <!-- TIMELINE ITEMS -->

//                                     ${timeline_html}

//                                 </div>

//                             </section>


//                             <!-- =================================
//                                  KEY POSITIONS
//                             ================================== -->

//                             <section class="profile-card">

//                                 <div class="card-title">
//                                     Key Positions Held
//                                 </div>


//                                 <ul class="position-list">

//                                     ${positions_html}

//                                 </ul>

//                             </section>


//                             <!-- =================================
//                                  ACHIEVEMENTS
//                             ================================== -->

//                             <section class="profile-card">

//                                 <div class="card-title">
//                                     Achievements & Honors
//                                 </div>


//                                 <div class="achievements-list">

//                                     ${achievements_html}

//                                 </div>

//                             </section>


//                             <!-- =================================
//                                  DOCUMENTS
//                             ================================== -->

//                             <section class="profile-card">

//                                 <div class="card-title">
//                                     Documents & Media
//                                 </div>


//                                 <div class="document-grid">


//                                     <!-- CERTIFICATE -->

//                                     <div class="document">

//                                         <div class="document-icon">

//                                             <i class="fa fa-file-text"></i>

//                                         </div>

//                                         <span>
//                                             Certificate
//                                         </span>

//                                     </div>


//                                     <!-- SERVICE RECORD -->

//                                     <div class="document">

//                                         <div class="document-icon">

//                                             <i class="fa fa-book"></i>

//                                         </div>

//                                         <span>
//                                             Service Record
//                                         </span>

//                                     </div>


//                                     <!-- REPORT -->

//                                     <div class="document">

//                                         <div class="document-icon">

//                                             <i class="fa fa-file"></i>

//                                         </div>

//                                         <span>
//                                             Report
//                                         </span>

//                                     </div>


//                                 </div>

//                             </section>


//                         </main>


//                         <!-- ===================================
//                              RIGHT COLUMN
//                         ==================================== -->

//                         <aside class="profile-right">


//                             <!-- =================================
//                                  RELATED KASHO RECORDS
//                             ================================== -->

//                             <div class="profile-card">

//                                 <div class="card-title">
//                                     Related Kasho
//                                 </div>


//                                 <!-- RELATED PERSON 1 -->

//                                 <div class="related-record">

//                                     <i class="fa fa-user"></i>

//                                     <span>
//                                         Related Person 1
//                                     </span>

//                                     <i class="fa fa-external-link"></i>

//                                 </div>


//                                 <!-- RELATED PERSON 2 -->

//                                 <div class="related-record">

//                                     <i class="fa fa-user"></i>

//                                     <span>
//                                         Related Person 2
//                                     </span>

//                                     <i class="fa fa-external-link"></i>

//                                 </div>


//                                 <!-- RELATED DOCUMENT -->

//                                 <div class="related-record">

//                                     <i class="fa fa-file"></i>

//                                     <span>
//                                         Related Document
//                                     </span>

//                                     <i class="fa fa-external-link"></i>

//                                 </div>


//                             </div>


//                         </aside>


//                     </div>

//                 </div>

//             `);


//         // // =====================================================
//         // // GALLERY CLICK
//         // // =====================================================

//         // $(wrapper)
//         //     .find(".gallery-item")
//         //     .on("click", function () {

//         //         let image_url =
//         //             $(this).attr("data-image-url");

//         //         if (!image_url) {
//         //             return;
//         //         }


//         //         // Simple full-screen image preview

//         //         let overlay = $(`
//         //             <div class="gallery-lightbox">

//         //                 <div class="gallery-lightbox-close">
//         //                     <i class="fa fa-times"></i>
//         //                 </div>

//         //                 <img
//         //                     src="${image_url}"
//         //                     class="gallery-lightbox-image"
//         //                 >

//         //             </div>
//         //         `);


//         //         $("body").append(overlay);


//         //         overlay.on("click", function (e) {

//         //             if (
//         //                 $(e.target).hasClass(
//         //                     "gallery-lightbox"
//         //                 )
//         //                 ||
//         //                 $(e.target).closest(
//         //                     ".gallery-lightbox-close"
//         //                 ).length
//         //             ) {

//         //                 overlay.remove();

//         //             }

//         //         });

//         //     });

// }

// };

frappe.pages["leadership-profile"].on_page_load = function (wrapper) {

    // =========================================================
    // CREATE FRAPPE PAGE
    // =========================================================

    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "Profile",
        single_column: true
    });


    // =========================================================
    // REMOVE DEFAULT FRAPPE SPACING
    // =========================================================

    $(wrapper).find(".layout-main-section").css({
        "padding": "0",
        "background": "#f7f8fa",
        "width": "100%"
    });


    // =========================================================
    // GET PROFILE FROM ROUTE
    // =========================================================

    let route = frappe.get_route();
    let profile = route[1];

    if (!profile) {

        $(wrapper).find(".layout-main-section").html(`
            <div class="leadership-profile-page">
                <div class="alert alert-warning">
                    No profile selected.
                </div>
            </div>
        `);

        return;
    }


    // =========================================================
    // GET KEY PERSON REGISTRY
    // =========================================================

    frappe.call({

        method: "frappe.client.get",

        args: {
            doctype: "Key Person Registry",
            name: profile
        },

        callback: function (r) {

            // =====================================================
            // CHECK RESPONSE
            // =====================================================

            if (!r || !r.message) {

                $(wrapper).find(".layout-main-section").html(`
                    <div class="leadership-profile-page">
                        <div class="alert alert-danger">
                            Leadership profile not found.
                        </div>
                    </div>
                `);

                return;
            }


            // =====================================================
            // PERSON DATA
            // =====================================================

            let person = r.message;
            // =====================================================
            // CHILD TABLE DATA
            // =====================================================

            let professional_information =
                person.professional_information || [];

            let award_recognition =
                person.award_recognition || [];


            // =====================================================
            // SERVICE JOURNEY
            // =====================================================

            let timeline_html = [...professional_information]
                .sort((a, b) => {

                    let yearA =
                        parseInt(
                            a.start_term?.split("-")[0]
                        ) || 0;

                    let yearB =
                        parseInt(
                            b.start_term?.split("-")[0]
                        ) || 0;

                    return yearA - yearB;

                })
                .map((row) => {

                    let year = "";

                    if (row.start_term) {
                        year =
                            row.start_term.split("-")[0];
                    }

                    return `
                        <div class="timeline-item">

                            <div class="timeline-dot"></div>

                            <strong>
                                ${row.start_term
                                    ? row.start_term.split("-")[0]
                                    : ""}
                            </strong>

                            <span>
                                ${row.position || ""}
                            </span>

                        </div>
                    `;

                })
                .join("");


            // =====================================================
            // KEY POSITIONS
            // =====================================================

            let positions_html = [...professional_information]
                .sort((a, b) => {

                    let dateA = a.start_term
                        ? new Date(a.start_term)
                        : new Date(0);

                    let dateB = b.start_term
                        ? new Date(b.start_term)
                        : new Date(0);

                    return dateA - dateB;

                })
                .map((row) => {

                    return `
                        <li>

                            <span class="position-name">
                                ${row.position || ""}
                            </span>

                            <small>
                                ${row.start_term || ""}
                                -
                                ${row.end_term || ""}
                            </small>

                        </li>
                    `;

                })
                .join("");


            // =====================================================
            // GET ATTACHMENTS / GALLERY
            // =====================================================

            frappe.db.get_list("File", {

                filters: {
                    attached_to_doctype: "Key Person Registry",
                    attached_to_name: profile
                },

                fields: [
                    "name",
                    "file_name",
                    "file_url",
                    "file_type",
                    "is_private"
                ],

                limit: 100

            }).then(files => {
                // =================================================
                // FILTER IMAGE FILES
                // =================================================

                let image_files = files.filter(file => {

                    let file_name =
                        file.file_name || "";

                    let file_url =
                        file.file_url || "";

                    return (
                        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file_name)
                        ||
                        /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(file_url)
                    );

                });


                // =================================================
                // CREATE GALLERY HTML
                // =================================================

                let gallery_html = "";

                if (image_files.length) {

                    gallery_html = image_files
                        .map((file) => {

                            return `
                                <div
                                    class="gallery-item"
                                    data-image-url="${file.file_url}"
                                >

                                    <a
                                        href="${file.file_url}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src="${file.file_url}"
                                            class="gallery-image"
                                            alt="${file.file_name || "Gallery Image"}"
                                            loading="lazy"
                                        >
                                    </a>

                                </div>
                            `;

                        })
                        .join("");

                } else {

                    gallery_html = `
                        <div class="gallery-empty">

                            <i class="fa fa-image"></i>

                            <span>
                                No gallery images available
                            </span>

                        </div>
                    `;

                }


                // =================================================
                // GET ACHIEVEMENTS
                // =================================================

                frappe.call({

                    method:
                        "erpnext.api_setting.get_kasho_detail_by_cid",

                    args: {
                        cid: person.cid
                    },

                    callback: function (response) {

                        // =========================================
                        // ACHIEVEMENT DATA
                        // =========================================

                        let data =
                            response.message || [];


                        // =========================================
                        // CREATE ACHIEVEMENT HTML
                        // =========================================

                        let achievements_html = data
                            .map((row) => {

                                let parent =
                                    row.parent || {};

                                let child =
                                    row.child || {};

                                let achievement_title =
                                    child.title || "";

                                let achievement_year = "";

                                if (parent.issue_date) {

                                    achievement_year =
                                        parent.issue_date
                                            .split("-")[0];

                                }

                                let conferred_by =
                                    child.conferred_by || "";


                                return `
                                    <div class="achievement">

                                        <div class="medal">
                                            <i class="fa fa-trophy"></i>
                                        </div>

                                        <div class="achievement-content">

                                            <strong>
                                                ${achievement_title}

                                                ${
                                                    achievement_year
                                                        ? `, ${achievement_year}`
                                                        : ""
                                                }
                                            </strong>

                                            <small>
                                                Conferred by
                                                ${conferred_by}
                                            </small>

                                        </div>

                                    </div>
                                `;

                            })
                            .join("");


                        // =========================================
                        // IF NO ACHIEVEMENTS
                        // =========================================

                        if (!achievements_html) {

                            achievements_html = `
                                <div class="no-achievements">

                                    <i class="fa fa-info-circle"></i>

                                    <span>
                                        No achievements or honors found.
                                    </span>

                                </div>
                            `;

                        }


                        // =================================================
                        // NOW GET RELATED KASHO
                        // =================================================

                        get_related_kasho(
                            person.cid,
                            function (related_kasho_html) {

                                render_profile_page(
                                    wrapper,
                                    person,
                                    timeline_html,
                                    positions_html,
                                    achievements_html,
                                    gallery_html,
                                    related_kasho_html
                                );

                            }
                        );

                    },

                    error: function (error) {

                        console.error(
                            "Failed to load Kasho details:",
                            error
                        );


                        // =========================================
                        // ACHIEVEMENT ERROR
                        // =========================================

                        let achievements_html = `
                            <div class="no-achievements">

                                <i class="fa fa-exclamation-circle"></i>

                                <span>
                                    Unable to load achievements.
                                </span>

                            </div>
                        `;


                        // =========================================
                        // STILL LOAD RELATED KASHO
                        // =========================================

                        get_related_kasho(
                            person.cid,
                            function (related_kasho_html) {

                                render_profile_page(
                                    wrapper,
                                    person,
                                    timeline_html,
                                    positions_html,
                                    achievements_html,
                                    gallery_html,
                                    related_kasho_html
                                );

                            }
                        );

                    }

                });

            }).catch(error => {

                console.error(
                    "[Leadership Profile] Failed to load attachments:",
                    error
                );


                // =============================================
                // FALLBACK GALLERY
                // =============================================

                let gallery_html = `
                    <div class="gallery-empty">

                        <i class="fa fa-image"></i>

                        <span>
                            Unable to load gallery images.
                        </span>

                    </div>
                `;


                // =============================================
                // GET ACHIEVEMENTS
                // =============================================

                frappe.call({

                    method:
                        "erpnext.api_setting.get_kasho_detail_by_cid",

                    args: {
                        cid: person.cid
                    },

                    callback: function (response) {

                        let data =
                            response.message || [];


                        let achievements_html = data
                            .map((row) => {

                                let parent =
                                    row.parent || {};

                                let child =
                                    row.child || {};

                                let achievement_title =
                                    child.title || "";

                                let achievement_year = "";

                                if (parent.issue_date) {

                                    achievement_year =
                                        parent.issue_date
                                            .split("-")[0];

                                }

                                let conferred_by =
                                    child.conferred_by || "";


                                return `
                                    <div class="achievement">

                                        <div class="medal">
                                            <i class="fa fa-trophy"></i>
                                        </div>

                                        <div class="achievement-content">

                                            <strong>
                                                ${achievement_title}

                                                ${
                                                    achievement_year
                                                        ? `, ${achievement_year}`
                                                        : ""
                                                }
                                            </strong>

                                            <small>
                                                Conferred by
                                                ${conferred_by}
                                            </small>

                                        </div>

                                    </div>
                                `;

                            })
                            .join("");


                        if (!achievements_html) {

                            achievements_html = `
                                <div class="no-achievements">

                                    <i class="fa fa-info-circle"></i>

                                    <span>
                                        No achievements or honors found.
                                    </span>

                                </div>
                            `;

                        }


                        // =============================================
                        // GET RELATED KASHO
                        // =============================================

                        get_related_kasho(
                            person.cid,
                            function (related_kasho_html) {

                                render_profile_page(
                                    wrapper,
                                    person,
                                    timeline_html,
                                    positions_html,
                                    achievements_html,
                                    gallery_html,
                                    related_kasho_html
                                );

                            }
                        );

                    },

                    error: function () {

                        get_related_kasho(
                            person.cid,
                            function (related_kasho_html) {

                                render_profile_page(
                                    wrapper,
                                    person,
                                    timeline_html,
                                    positions_html,
                                    `
                                        <div class="no-achievements">

                                            <i class="fa fa-exclamation-circle"></i>

                                            <span>
                                                Unable to load achievements.
                                            </span>

                                        </div>
                                    `,
                                    gallery_html,
                                    related_kasho_html
                                );

                            }
                        );

                    }

                });

            });

        }

    });


    // =========================================================
    // GET RELATED KASHO
    // =========================================================

    function get_related_kasho(cid, callback) {

        // -------------------------------------------------------
        // No CID
        // -------------------------------------------------------

        if (!cid) {

            callback(`
                <div class="related-record">

                    <i class="fa fa-info-circle"></i>

                    <span>
                        No related Kasho found.
                    </span>

                </div>
            `);

            return;
        }
        frappe.call({

            method:
                "erpnext.api_setting.get_recognition_by_cid",

            args: {
                cid: cid
            },

            callback: function (response) {
                let data =
                    response.message || [];


                // =================================================
                // CREATE RELATED KASHO HTML
                // =================================================

                let related_kasho_html = data
                    .filter(row => {

                        return (
                            row &&
                            row.parent &&
                            row.kasho
                        );

                    })
                    .map(row => {

                        // ------------------------------------------------
                        // Escape displayed Kasho name
                        // ------------------------------------------------

                        let parent =
                            frappe.utils.escape_html(
                                row.parent
                            );


                        // ------------------------------------------------
                        // File URL
                        // ------------------------------------------------

                        let kasho_url =
                            encodeURI(
                                row.kasho
                            );


                        return `
                            <a
                                href="${kasho_url}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="related-record"
                                title="Open ${parent}"
                            >

                                <i class="fa fa-file"></i>

                                <span>
                                    ${parent}
                                </span>

                                <i class="fa fa-external-link"></i>

                            </a>
                        `;

                    })
                    .join("");


                // =================================================
                // NO RELATED KASHO
                // =================================================

                if (!related_kasho_html) {

                    related_kasho_html = `
                        <div class="related-record">

                            <i class="fa fa-info-circle"></i>

                            <span>
                                No related Kasho found.
                            </span>

                        </div>
                    `;

                }


                callback(
                    related_kasho_html
                );

            },

            error: function (error) {

                console.error(
                    "[Leadership Profile] Failed to load Related Kasho:",
                    error
                );


                callback(`
                    <div class="related-record">

                        <i class="fa fa-exclamation-circle"></i>

                        <span>
                            Unable to load related Kasho.
                        </span>

                    </div>
                `);

            }

        });

    }


    // =========================================================
    // RENDER PROFILE PAGE
    // =========================================================

    function render_profile_page(
        wrapper,
        person,
        timeline_html,
        positions_html,
        achievements_html,
        gallery_html,
        related_kasho_html
    ) {

        $(wrapper)
            .find(".layout-main-section")
            .html(`

                <div class="leadership-profile-page">

                    <!-- =======================================
                         THREE COLUMN LAYOUT
                    ======================================== -->

                    <div class="profile-grid">


                        <!-- ===================================
                             LEFT COLUMN
                        ==================================== -->

                        <aside class="profile-left">


                            <!-- =================================
                                 PROFILE CARD
                            ================================== -->

                            <div class="profile-card">


                                <!-- PROFILE PHOTO -->

                                <div class="profile-photo-wrapper">

                                    ${
                                        person.profile_photo
                                        ?

                                        `
                                        <img
                                            src="${person.profile_photo}"
                                            class="profile-photo"
                                            alt="${
                                                person.registry_name
                                                || "Profile Photo"
                                            }"
                                        >
                                        `

                                        :

                                        `
                                        <div class="profile-photo-placeholder">

                                            <i class="fa fa-user"></i>

                                        </div>
                                        `
                                    }

                                </div>


                                <!-- NAME -->

                                <h3>
                                    ${person.registry_name || ""}
                                </h3>


                                <!-- DESIGNATION -->

                                <p class="muted">
                                    ${person.designation || ""}
                                </p>


                                <!-- DIVIDER -->

                                <div class="profile-divider"></div>


                                <!-- CID -->

                                <div class="info-item">

                                    <span class="info-label">
                                        CID
                                    </span>

                                    <span class="info-value">
                                        ${person.cid || "-"}
                                    </span>

                                </div>


                                <!-- DATE OF BIRTH -->

                                <div class="info-item">

                                    <span class="info-label">
                                        Date of Birth
                                    </span>

                                    <span class="info-value">
                                        ${person.dob || "-"}
                                    </span>

                                </div>


                                <!-- DZONGKHAG -->

                                <div class="info-item">

                                    <span class="info-label">
                                        Dzongkhag
                                    </span>

                                    <span class="info-value">
                                        ${person.dzongkhag || "-"}
                                    </span>

                                </div>


                                <!-- GEWOG -->

                                <div class="info-item">

                                    <span class="info-label">
                                        Gewog
                                    </span>

                                    <span class="info-value">
                                        ${person.gewog || "-"}
                                    </span>

                                </div>


                                <!-- VILLAGE -->

                                <div class="info-item">

                                    <span class="info-label">
                                        Village
                                    </span>

                                    <span class="info-value">
                                        ${person.village || "-"}
                                    </span>

                                </div>


                            </div>


                            <!-- =================================
                                 GALLERY
                            ================================== -->

                            <div class="profile-card profile-gallery">

                                <div class="card-title">

                                    <i class="fa fa-picture-o"></i>

                                    Gallery

                                </div>


                                <div class="photo-grid">

                                    ${gallery_html}

                                </div>

                            </div>


                        </aside>


                        <!-- ===================================
                             MIDDLE COLUMN
                        ==================================== -->

                        <main class="profile-middle">


                            <!-- =================================
                                 SERVICE JOURNEY
                            ================================== -->

                            <section class="profile-card">

                                <div class="card-title">
                                    Service Journey
                                </div>


                                <div class="timeline">

                                    <!-- TIMELINE LINE -->

                                    <div class="timeline-line"></div>


                                    <!-- TIMELINE ITEMS -->

                                    ${timeline_html}

                                </div>

                            </section>


                            <!-- =================================
                                 KEY POSITIONS
                            ================================== -->

                            <section class="profile-card">

                                <div class="card-title">
                                    Key Positions Held
                                </div>


                                <ul class="position-list">

                                    ${positions_html}

                                </ul>

                            </section>


                            <!-- =================================
                                 ACHIEVEMENTS
                            ================================== -->

                            <section class="profile-card">

                                <div class="card-title">
                                    Achievements & Honors
                                </div>


                                <div class="achievements-list">

                                    ${achievements_html}

                                </div>

                            </section>


                            <!-- =================================
                                 DOCUMENTS
                            ================================== -->

                            <section class="profile-card">

                                <div class="card-title">
                                    Documents & Media
                                </div>


                                <div class="document-grid">


                                    <!-- CERTIFICATE -->

                                    <div class="document">

                                        <div class="document-icon">

                                            <i class="fa fa-file-text"></i>

                                        </div>

                                        <span>
                                            Certificate
                                        </span>

                                    </div>


                                    <!-- SERVICE RECORD -->

                                    <div class="document">

                                        <div class="document-icon">

                                            <i class="fa fa-book"></i>

                                        </div>

                                        <span>
                                            Service Record
                                        </span>

                                    </div>


                                    <!-- REPORT -->

                                    <div class="document">

                                        <div class="document-icon">

                                            <i class="fa fa-file"></i>

                                        </div>

                                        <span>
                                            Report
                                        </span>

                                    </div>


                                </div>

                            </section>


                        </main>


                        <!-- ===================================
                             RIGHT COLUMN
                        ==================================== -->

                        <aside class="profile-right">


                            <!-- =================================
                                 RELATED KASHO RECORDS
                            ================================== -->

                            <div class="profile-card">

                                <div class="card-title">
                                    Related Kasho
                                </div>


                                <!-- =================================
                                     DYNAMIC RELATED KASHO
                                ================================== -->

                                ${related_kasho_html}


                            </div>


                        </aside>


                    </div>

                </div>

            `);
    }

};