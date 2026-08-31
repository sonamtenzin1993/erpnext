(function () {

    "use strict";


    /* =====================================================
       CONFIGURATION
       ===================================================== */

    const WORKSPACE_NAME =
        "Leadership Archival";


    /* =====================================================
       CHECK CURRENT WORKSPACE
       ===================================================== */

    function isLeadershipWorkspace() {

        const route = frappe.get_route();

        if (!route) {
            return false;
        }

        return (
            route[0] === "Workspaces" &&
            route[1] === WORKSPACE_NAME
        );
    }


    /* =====================================================
       APPLY WORKSPACE
       ===================================================== */

    function applyWorkspace() {

        if (!isLeadershipWorkspace()) {

            document.body.classList.remove(
                "leadership-workspace"
            );

            removeCustomElements();

            return;
        }


        document.body.classList.add(
            "leadership-workspace"
        );


        setTimeout(function () {

            createHero();

            createAwardCards();

        }, 300);
    }


    /* =====================================================
       REMOVE CUSTOM ELEMENTS
       ===================================================== */

    function removeCustomElements() {

        const hero =
            document.querySelector(
                ".leadership-custom-hero"
            );

        if (hero) {
            hero.remove();
        }


        const cards =
            document.querySelector(
                ".leadership-award-section"
            );

        if (cards) {
            cards.remove();
        }
    }


    /* =====================================================
       CREATE HERO
       ===================================================== */

    function createHero() {

        if (
            document.querySelector(
                ".leadership-custom-hero"
            )
        ) {
            return;
        }


        const container =
            document.querySelector(
                ".workspace-container"
            );


        if (!container) {
            return;
        }


        const hero =
            document.createElement("div");


        hero.className =
            "leadership-custom-hero";


        hero.innerHTML = `

            <div
                class="leadership-hero-background">
            </div>


            <div
                class="leadership-hero-content">


                <div
                    class="leadership-hero-left">


                    <div
                        class="leadership-logo-wrapper">

                        <img
                            class="leadership-logo"
                            src="/assets/smart_erp/images/leadership-logo.png"
                            alt="Leadership"
                        >

                    </div>


                    <div
                        class="leadership-hero-text">

                        <h1>
                            Leadership Archival
                        </h1>

                        <p>
                            A centralized repository of Royal
                            honors, titles, and appointments
                            preserving Bhutan's legacy of service
                            and excellence.
                        </p>

                    </div>

                </div>


                <div
                    class="leadership-hero-stats">


                    <div
                        class="leadership-stat">

                        <div
                            class="leadership-stat-icon">

                            <i
                                class="fa fa-calendar">
                            </i>

                        </div>


                        <div>

                            <span>
                                Last Updated
                            </span>

                            <strong
                                id="leadership-last-updated">
                                -
                            </strong>

                        </div>

                    </div>


                    <div
                        class="leadership-stat">

                        <div
                            class="leadership-stat-icon">

                            <i
                                class="fa fa-database">
                            </i>

                        </div>


                        <div>

                            <span>
                                Total Records
                            </span>

                            <strong
                                id="leadership-total-records">
                                -
                            </strong>

                        </div>

                    </div>


                </div>

            </div>

        `;


        container.prepend(hero);


        updateLastUpdated();

        loadTotalRecords();
    }


    /* =====================================================
       CREATE AWARD CARDS
       ===================================================== */

    function createAwardCards() {

        if (
            document.querySelector(
                ".leadership-award-section"
            )
        ) {
            return;
        }


        const container =
            document.querySelector(
                ".workspace-container"
            );


        if (!container) {
            return;
        }


        const section =
            document.createElement("div");


        section.className =
            "leadership-award-section";


        section.innerHTML = `


            <!-- =========================================
                 AWARD BY TITLE
                 ========================================= -->

            <div
                class="leadership-section-title">

                Award By Title

            </div>


            <div
                class="leadership-card-grid">


                <!-- RED SCARF -->

                <div
                    class="
                        leadership-award-card
                        red-scarf-card
                    ">


                    <div
                        class="award-icon-box">

                        <img
                            src="/assets/smart_erp/images/red-scarf.png"
                            alt="Red Scarf"
                        >

                    </div>


                    <div
                        class="award-card-content">

                        <div
                            class="award-card-title">

                            RED SCARF

                        </div>


                        <div
                            class="award-card-number"
                            id="red-scarf-count">

                            31

                        </div>


                        <div
                            class="award-card-label">

                            Recipients

                        </div>

                    </div>

                </div>


                <!-- LUGMAR SCARF -->

                <div
                    class="
                        leadership-award-card
                        lugmar-scarf-card
                    ">


                    <div
                        class="award-icon-box">

                        <img
                            src="/assets/smart_erp/images/lugmar-scarf.png"
                            alt="Lugmar Scarf"
                        >

                    </div>


                    <div
                        class="award-card-content">

                        <div
                            class="award-card-title">

                            LUGMAR SCARF

                        </div>


                        <div
                            class="award-card-number"
                            id="lugmar-scarf-count">

                            2

                        </div>


                        <div
                            class="award-card-label">

                            Recipients

                        </div>

                    </div>

                </div>


                <!-- WHITE SCARF -->

                <div
                    class="
                        leadership-award-card
                        white-scarf-card
                    ">


                    <div
                        class="award-icon-box">

                        <img
                            src="/assets/smart_erp/images/white-scarf.png"
                            alt="White Scarf"
                        >

                    </div>


                    <div
                        class="award-card-content">

                        <div
                            class="award-card-title">

                            WHITE SCARF

                        </div>


                        <div
                            class="award-card-number"
                            id="white-scarf-count">

                            7

                        </div>


                        <div
                            class="award-card-label">

                            Recipients

                        </div>

                    </div>

                </div>


            </div>


            <!-- =========================================
                 AWARD BY MEDAL
                 ========================================= -->

            <div
                class="
                    leadership-section-title
                    medal-section-title
                ">

                Award By Medal

            </div>


            <div
                class="leadership-card-grid">


                <!-- GOLD -->

                <div
                    class="
                        leadership-award-card
                        gold-card
                    ">


                    <div
                        class="award-icon-box">

                        <img
                            src="/assets/smart_erp/images/nom-gold.png"
                            alt="NOM Gold"
                        >

                    </div>


                    <div
                        class="award-card-content">

                        <div
                            class="award-card-title">

                            NOM GOLD

                        </div>


                        <div
                            class="award-card-number"
                            id="nom-gold-count">

                            99

                        </div>


                        <div
                            class="award-card-label">

                            Recipients

                        </div>

                    </div>

                </div>


                <!-- SILVER -->

                <div
                    class="
                        leadership-award-card
                        silver-card
                    ">


                    <div
                        class="award-icon-box">

                        <img
                            src="/assets/smart_erp/images/nom-silver.png"
                            alt="NOM Silver"
                        >

                    </div>


                    <div
                        class="award-card-content">

                        <div
                            class="award-card-title">

                            NOM SILVER

                        </div>


                        <div
                            class="award-card-number"
                            id="nom-silver-count">

                            78

                        </div>


                        <div
                            class="award-card-label">

                            Recipients

                        </div>

                    </div>

                </div>


                <!-- BRONZE -->

                <div
                    class="
                        leadership-award-card
                        bronze-card
                    ">


                    <div
                        class="award-icon-box">

                        <img
                            src="/assets/smart_erp/images/nom-bronze.png"
                            alt="NOM Bronze"
                        >

                    </div>


                    <div
                        class="award-card-content">

                        <div
                            class="award-card-title">

                            NOM BRONZE

                        </div>


                        <div
                            class="award-card-number"
                            id="nom-bronze-count">

                            59

                        </div>


                        <div
                            class="award-card-label">

                            Recipients

                        </div>

                    </div>

                </div>


            </div>


        `;


        container.prepend(section);
    }


    /* =====================================================
       LAST UPDATED
       ===================================================== */

    function updateLastUpdated() {

        const element =
            document.querySelector(
                "#leadership-last-updated"
            );


        if (!element) {
            return;
        }


        const today =
            new Date();


        element.textContent =
            today.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );
    }


    /* =====================================================
       TOTAL RECORDS
       ===================================================== */

    function loadTotalRecords() {

        const element =
            document.querySelector(
                "#leadership-total-records"
            );


        if (!element) {
            return;
        }


        frappe.call({

            method:
                "frappe.client.get_count",

            args: {

                doctype:
                    "Key Person Registry"

            },

            callback: function (r) {

                if (
                    r.message !== undefined &&
                    r.message !== null
                ) {

                    element.textContent =
                        Number(
                            r.message
                        ).toLocaleString();

                }

            }

        });
    }


    /* =====================================================
       ROUTE CHANGE
       ===================================================== */

    if (frappe.router) {

        frappe.router.on(
            "change",
            function () {

                setTimeout(
                    applyWorkspace,
                    300
                );

            }
        );

    }


    /* =====================================================
       INITIAL LOAD
       ===================================================== */

    $(document).ready(
        function () {

            setTimeout(
                applyWorkspace,
                800
            );

        }
    );


})();