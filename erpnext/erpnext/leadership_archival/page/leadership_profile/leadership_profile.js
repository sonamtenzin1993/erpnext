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

            if (!r.message) {

                $(wrapper).find(".layout-main-section").html(`
                    <div class="leadership-profile-page">
                        <div class="alert alert-danger">
                            Leadership profile not found.
                        </div>
                    </div>
                `);

                return;
            }


            let person = r.message;


            // =================================================
            // CHILD TABLE DATA
            // =================================================

            let professional_information =
                person.professional_information || [];

            let award_recognition =
                person.award_recognition || [];


            // =================================================
            // SERVICE JOURNEY
            // =================================================

            let timeline_html = professional_information
                .map((row, index) => {

                    let year = "";

                    if (row.start_term) {
                        year = row.start_term.split("-")[0];
                    }

                    return `
                        <div class="timeline-item">

                            <div class="timeline-dot"></div>

                            <strong>
                                ${year}
                            </strong>

                            <span>
                                ${row.position || ""}
                            </span>

                        </div>
                    `;

                })
                .join("");


            // =================================================
            // KEY POSITIONS
            // =================================================

            let positions_html = professional_information
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


            // =================================================
            // ACHIEVEMENTS
            // =================================================

            let achievements_html = award_recognition
                .map((row) => {

                    return `
                        <div class="achievement">

                            <div class="medal">
                                <i class="fa fa-trophy"></i>
                            </div>

                            <div>

                                <strong>
                                    ${row.title || ""}
                                </strong>

                                <small>
                                    Conferred by ${row.conferred_by || ""}
                                </small>

                            </div>

                        </div>
                    `;

                })
                .join("");


            // =================================================
            // MAIN PAGE
            // =================================================

            $(wrapper).find(".layout-main-section").html(`

                <div class="leadership-profile-page">

                    <!-- =======================================
                         THREE COLUMN LAYOUT
                    ======================================== -->

                    <div class="profile-grid">


                        <!-- ===================================
                             LEFT COLUMN
                        ==================================== -->

                        <aside class="profile-left">

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
                                            alt="${person.registry_name || "Profile Photo"}"
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


                                ${achievements_html}

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
                                 RELATED RECORDS
                            ================================== -->

                            <div class="profile-card">

                                <div class="card-title">
                                    Related Records
                                </div>


                                <!-- RELATED PERSON 1 -->

                                <div class="related-record">

                                    <i class="fa fa-user"></i>

                                    <span>
                                        Related Person 1
                                    </span>

                                    <i class="fa fa-external-link"></i>

                                </div>


                                <!-- RELATED PERSON 2 -->

                                <div class="related-record">

                                    <i class="fa fa-user"></i>

                                    <span>
                                        Related Person 2
                                    </span>

                                    <i class="fa fa-external-link"></i>

                                </div>


                                <!-- RELATED DOCUMENT -->

                                <div class="related-record">

                                    <i class="fa fa-file"></i>

                                    <span>
                                        Related Document
                                    </span>

                                    <i class="fa fa-external-link"></i>

                                </div>


                            </div>

                        </aside>


                    </div>

                </div>

            `);

        }

    });

};