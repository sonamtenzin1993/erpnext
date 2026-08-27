frappe.pages["leadership-profile"].on_page_load = function(wrapper) {

    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: "Profile",
        single_column: true
    });

    // Remove default padding/background from Frappe page
    $(wrapper).find(".layout-main-section").css({
        "padding": "0",
        "background": "#f7f8fa"
    });

    let route = frappe.get_route();
    let profile = route[1];
    if (!profile) {

        $(wrapper).find(".layout-main-section").html(`
            <div class="alert alert-warning">
                No profile selected.
            </div>
        `);

        return;
    }

    frappe.call({
        method: "frappe.client.get",

        args: {
            doctype: "Key Person Registry",
            name: profile
        },

        callback: function(r) {

            if (!r.message) {

                $(wrapper).find(".layout-main-section").html(`
                    <div class="alert alert-danger">
                        Leadership profile not found.
                    </div>
                `);

                return;
            }

            let person = r.message;

            /*
             * ==========================================
             * MAIN PAGE HTML
             * ==========================================
             */

            $(wrapper).find(".layout-main-section").html(`

                <div class="leadership-profile-page">
                    <!-- ==============================
                         THREE COLUMN LAYOUT
                    =============================== -->

                    <div class="profile-grid">


                        <!-- =================================
                             LEFT COLUMN
                        ================================== -->

                        <aside class="profile-left">


                            <!-- PROFILE INFORMATION -->

                            <div class="profile-card">

                                <div class="profile-photo-wrapper">

                                    ${
                                        person.profile_photo
                                        ?
                                        `<img
                                            src="${person.profile_photo}"
                                            class="profile-photo"
                                        >`
                                        :
                                        `<div class="profile-photo-placeholder">
                                            <i class="fa fa-user"></i>
                                        </div>`
                                    }

                                </div>


                                <h3>
                                    ${person.registry_name || ""}
                                </h3>

                                <p class="muted">
                                    ${person.designation || ""}
                                </p>


                                <div class="profile-divider"></div>


                                <div class="info-item">

                                    <span class="info-label">
                                        CID
                                    </span>

                                    <span class="info-value">
                                        ${person.cid || "-"}
                                    </span>

                                </div>


                                <div class="info-item">

                                    <span class="info-label">
                                        Date of Birth
                                    </span>

                                    <span class="info-value">
                                        ${person.dob || "-"}
                                    </span>

                                </div>


                                <div class="info-item">

                                    <span class="info-label">
                                        Dzongkhag
                                    </span>

                                    <span class="info-value">
                                        ${person.dzongkhag || "-"}
                                    </span>

                                </div>


                                <div class="info-item">

                                    <span class="info-label">
                                        Gewog
                                    </span>

                                    <span class="info-value">
                                        ${person.gewog || "-"}
                                    </span>

                                </div>


                                <div class="info-item">

                                    <span class="info-label">
                                        Village
                                    </span>

                                    <span class="info-value">
                                        ${person.village || "-"}
                                    </span>

                                </div>


                               <!-- <div class="info-item">

                                    <span class="info-label">
                                        Service Tags
                                    </span>

                                    <div class="tags">

                                        <span>
                                            Leadership
                                        </span>

                                        <span>
                                            Government
                                        </span>

                                    </div>

                                </div>-->

                            </div>


                            <!-- PHOTO GALLERY -->

                            <!--<div class="profile-card">

                                <div class="card-title">
                                    Photo Gallery
                                </div>

                                <div class="photo-grid">

                                    <div class="photo-placeholder">
                                        <i class="fa fa-image"></i>
                                    </div>

                                    <div class="photo-placeholder">
                                        <i class="fa fa-image"></i>
                                    </div>

                                    <div class="photo-placeholder">
                                        <i class="fa fa-image"></i>
                                    </div>

                                    <div class="photo-placeholder">
                                        <i class="fa fa-image"></i>
                                    </div>

                                </div>

                            </div>-->

                        </aside>


                        <!-- =================================
                             MIDDLE COLUMN
                        ================================== -->

                        <main class="profile-middle">


                            <!-- SERVICE JOURNEY -->

                            <section class="profile-card">

                                <div class="card-title">
                                    Service Journey
                                </div>

                                <div class="timeline">
                                    <div class="timeline-line"></div>
                                    ${
                                    (person.professional_information || []).map((row, index) => `
                                        <div class="timeline-item">
                                            <div class="timeline-dot"></div>
                                            <strong>
                                                ${row.start_term ? row.start_term.split("-")[0] : ""}
                                            </strong>
                                            <span>
                                                ${row.position || ""}
                                            </span>
                                        </div>
                                        `).join("")
                                    }
                                </div>
                            </section>


                            <!-- KEY POSITIONS -->

                            <section class="profile-card">

                                <div class="card-title">
                                    Key Positions Held
                                </div>

                                <ul class="position-list">
                                     ${
                                    (person.professional_information || []).map((row, index) => `
                                    <li>
                                        ${row.position || ""}
                                        <small>(${row.start_term || ""})-(${row.end_term || ""})</small>
                                    </li>
                                    `).join("")
                                    }

                                </ul>

                            </section>

                            <!-- ACHIEVEMENTS -->

                            <section class="profile-card">

                                <div class="card-title">
                                    Achievements & Honors
                                </div>

                                ${
                                    (person.award_recognition || []).map((row, index) => `
                                        
                                        <div class="achievement">

                                            <div class="medal">
                                                <i class="fa fa-trophy"></i>
                                            </div>

                                            <div>

                                                <strong>
                                                    ${row.title || ""}
                                                </strong>

                                                <small>
                                                     Confered by ${row.conferred_by || ""}
                                                </small>

                                            </div>

                                        </div>

                                    `).join("")
                                }

                            </section>

                            <!-- DOCUMENTS -->

                            <section class="profile-card">

                                <div class="card-title">
                                    Documents & Media
                                </div>


                                <div class="document-grid">

                                    <div class="document">

                                        <div class="document-icon">
                                            <i class="fa fa-file-text"></i>
                                        </div>

                                        <span>
                                            Certificate
                                        </span>

                                    </div>


                                    <div class="document">

                                        <div class="document-icon">
                                            <i class="fa fa-book"></i>
                                        </div>

                                        <span>
                                            Service Record
                                        </span>

                                    </div>


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


                        <!-- =================================
                             RIGHT COLUMN
                        ================================== -->

                       <aside class="profile-right">


                            <!-- SEARCH -->

                           <!-- <div class="profile-card">

                                <div class="card-title">
                                    Search Posts Across Time
                                </div>


                                <label>
                                    Year
                                </label>

                                <select class="form-control">

                                    <option>
                                        All
                                    </option>

                                    <option>
                                        2020
                                    </option>

                                    <option>
                                        2015
                                    </option>

                                    <option>
                                        2010
                                    </option>

                                </select>


                                <label>
                                    Position
                                </label>

                                <select class="form-control">

                                    <option>
                                        All
                                    </option>

                                    <option>
                                        Director
                                    </option>

                                    <option>
                                        Executive
                                    </option>

                                </select>


                                <label>
                                    Department
                                </label>

                                <select class="form-control">

                                    <option>
                                        All
                                    </option>

                                    <option>
                                        Government
                                    </option>

                                </select>


                                <label>
                                    Region
                                </label>

                                <select class="form-control">

                                    <option>
                                        All
                                    </option>

                                    <option>
                                        Central
                                    </option>

                                </select>


                                <button class="btn btn-primary btn-block">
                                    Search
                                </button>

                            </div>-->


                            <!-- RELATED RECORDS -->

                            <div class="profile-card">

                                <div class="card-title">
                                    Related Records
                                </div>


                                <div class="related-record">

                                    <i class="fa fa-user"></i>

                                    <span>
                                        Related Person 1
                                    </span>

                                    <i class="fa fa-external-link"></i>

                                </div>


                                <div class="related-record">

                                    <i class="fa fa-user"></i>

                                    <span>
                                        Related Person 2
                                    </span>

                                    <i class="fa fa-external-link"></i>

                                </div>


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