// (function () {

//     window.ApexDashboardRenderer = {

//         render: function (container, config) {

//             console.log("========== APEX RAW INPUT ==========");
// console.log("FULL CONFIG:", JSON.stringify(config, null, 2));
// console.log("CONFIG DATA:", JSON.stringify(config.data, null, 2));
// console.log("DATASETS:", JSON.stringify(
//     config.data && config.data.datasets
//         ? config.data.datasets
//         : null,
//     null,
//     2
// ));
// console.log("SERIES:", JSON.stringify(config.series, null, 2));
// console.log("====================================");

//             // =========================================================
//             // NORMALIZE CONFIG
//             // =========================================================

//             config = config || {};

//             const chartType =
//                 String(
//                     config.type || "bar"
//                 ).toLowerCase();


//             // =========================================================
//             // CHECK CONTAINER
//             // =========================================================

//             if (!container) {

//                 console.error(
//                     "[Apex Dashboard] Container not found."
//                 );

//                 return;
//             }


//             // =========================================================
//             // CHECK APEXCHARTS
//             // =========================================================

//             if (
//                 typeof window.ApexCharts === "undefined"
//             ) {

//                 console.error(
//                     "[Apex Dashboard] ApexCharts is not loaded."
//                 );

//                 return;
//             }


//             // =========================================================
//             // CLEAR EXISTING CHART
//             // =========================================================

//             container.innerHTML = "";


//             // =========================================================
//             // CREATE CHART ELEMENT
//             // =========================================================

//             const chartElement =
//                 document.createElement("div");

//             chartElement.style.width =
//                 "100%";

//             chartElement.style.height =
//                 (config.height || 500) + "px";

//             container.appendChild(
//                 chartElement
//             );


//             // =========================================================
//             // INITIAL DATA
//             // =========================================================

//             let series = [];

//             let labels = [];


//             // =========================================================
//             // DEBUG RAW CONFIG
//             // =========================================================

//             console.log(
//                 "========================================"
//             );

//             console.log(
//                 "[Apex Dashboard] RAW CONFIG:",
//                 config
//             );

//             console.log(
//                 "[Apex Dashboard] CONFIG DATA:",
//                 config.data
//             );

//             console.log(
//                 "========================================"
//             );


//             // =========================================================
//             // GET DATA FROM FRAPPE DASHBOARD CHART
//             // =========================================================

//             if (config.data) {

//                 // =====================================================
//                 // LABELS
//                 // =====================================================

//                 if (
//                     Array.isArray(
//                         config.data.labels
//                     )
//                 ) {

//                     labels =
//                         config.data.labels.slice();

//                 }

//                 else if (
//                     Array.isArray(
//                         config.labels
//                     )
//                 ) {

//                     labels =
//                         config.labels.slice();
//                 }


//                 // =====================================================
//                 // DATASETS
//                 // =====================================================

//                 if (
//                     Array.isArray(
//                         config.data.datasets
//                     ) &&
//                     config.data.datasets.length
//                 ) {

//                     series =
//                         config.data.datasets.map(
//                             function (
//                                 dataset,
//                                 datasetIndex
//                             ) {

//                                 console.log(
//                                     "[Apex Dashboard] Dataset " +
//                                     datasetIndex +
//                                     ":",
//                                     dataset
//                                 );


//                                 let values = [];


//                                 // -------------------------------------
//                                 // Frappe format
//                                 // -------------------------------------

//                                 if (
//                                     Array.isArray(
//                                         dataset.values
//                                     )
//                                 ) {

//                                     values =
//                                         dataset.values.slice();

//                                 }


//                                 // -------------------------------------
//                                 // ApexCharts format
//                                 // -------------------------------------

//                                 else if (
//                                     Array.isArray(
//                                         dataset.data
//                                     )
//                                 ) {

//                                     values =
//                                         dataset.data.slice();

//                                 }


//                                 // -------------------------------------
//                                 // Dataset values as array-like object
//                                 // -------------------------------------

//                                 else if (
//                                     dataset.values &&
//                                     typeof dataset.values === "object"
//                                 ) {

//                                     values =
//                                         Object.values(
//                                             dataset.values
//                                         );

//                                 }


//                                 // -------------------------------------
//                                 // Dataset data as array-like object
//                                 // -------------------------------------

//                                 else if (
//                                     dataset.data &&
//                                     typeof dataset.data === "object"
//                                 ) {

//                                     values =
//                                         Object.values(
//                                             dataset.data
//                                         );

//                                 }


//                                 // -------------------------------------
//                                 // Single value
//                                 // -------------------------------------

//                                 else if (
//                                     dataset.value !== undefined &&
//                                     dataset.value !== null
//                                 ) {

//                                     values = [
//                                         dataset.value
//                                     ];
//                                 }


//                                 console.log(
//                                     "[Apex Dashboard] Extracted values:",
//                                     values
//                                 );


//                                 return {

//                                     name:
//                                         dataset.name ||
//                                         dataset.label ||
//                                         "Value",

//                                     data:
//                                         values

//                                 };

//                             }
//                         );
//                 }


//                 // =====================================================
//                 // SIMPLE VALUES FORMAT
//                 // =====================================================

//                 else if (
//                     Array.isArray(
//                         config.data.values
//                     )
//                 ) {

//                     series = [
//                         {
//                             name:
//                                 "Value",

//                             data:
//                                 config.data.values.slice()
//                         }
//                     ];

//                 }


//                 // =====================================================
//                 // SIMPLE DATA FORMAT
//                 // =====================================================

//                 else if (
//                     Array.isArray(
//                         config.data.data
//                     )
//                 ) {

//                     series = [
//                         {
//                             name:
//                                 "Value",

//                             data:
//                                 config.data.data.slice()
//                         }
//                     ];

//                 }


//                 // =====================================================
//                 // ARRAY-LIKE VALUES
//                 // =====================================================

//                 else if (
//                     config.data.values &&
//                     typeof config.data.values === "object"
//                 ) {

//                     series = [
//                         {
//                             name:
//                                 "Value",

//                             data:
//                                 Object.values(
//                                     config.data.values
//                                 )
//                         }
//                     ];

//                 }


//                 // =====================================================
//                 // ARRAY-LIKE DATA
//                 // =====================================================

//                 else if (
//                     config.data.data &&
//                     typeof config.data.data === "object"
//                 ) {

//                     series = [
//                         {
//                             name:
//                                 "Value",

//                             data:
//                                 Object.values(
//                                     config.data.data
//                                 )
//                         }
//                     ];
//                 }
//             }


//             // =========================================================
//             // FALLBACK SERIES
//             // =========================================================

//             if (
//                 !series.length &&
//                 config.series
//             ) {

//                 if (
//                     Array.isArray(
//                         config.series
//                     )
//                 ) {

//                     series =
//                         config.series.slice();
//                 }
//             }


//             // =========================================================
//             // FALLBACK LABELS
//             // =========================================================

//             if (
//                 !labels.length &&
//                 config.labels
//             ) {

//                 if (
//                     Array.isArray(
//                         config.labels
//                     )
//                 ) {

//                     labels =
//                         config.labels.slice();
//                 }
//             }


//             // =========================================================
//             // NORMALIZE SERIES
//             // =========================================================

//             if (
//                 !Array.isArray(series)
//             ) {

//                 series = [];
//             }


//             // =========================================================
//             // NORMALIZE CARTESIAN SERIES
//             // =========================================================

//             if (
//                 chartType !== "pie" &&
//                 chartType !== "donut"
//             ) {

//                 if (
//                     series.length &&
//                     typeof series[0] !== "object"
//                 ) {

//                     series = [
//                         {
//                             name:
//                                 "Value",

//                             data:
//                                 series.slice()
//                         }
//                     ];
//                 }
//             }


//             // =========================================================
//             // NORMALIZE CARTESIAN DATA
//             // =========================================================

//             if (
//                 chartType !== "pie" &&
//                 chartType !== "donut"
//             ) {

//                 series =
//                     series.map(
//                         function (item) {

//                             if (
//                                 typeof item === "object" &&
//                                 item !== null
//                             ) {

//                                 let itemData =
//                                     item.data;


//                                 if (
//                                     !Array.isArray(
//                                         itemData
//                                     )
//                                 ) {

//                                     if (
//                                         Array.isArray(
//                                             item.values
//                                         )
//                                     ) {

//                                         itemData =
//                                             item.values.slice();

//                                     } else {

//                                         itemData = [];
//                                     }
//                                 }


//                                 return {

//                                     name:
//                                         item.name ||
//                                         item.label ||
//                                         "Value",

//                                     data:
//                                         itemData

//                                 };

//                             }


//                             return {

//                                 name:
//                                     "Value",

//                                 data:
//                                     [item]

//                             };

//                         }
//                     );
//             }


//             // =========================================================
//             // PIE / DONUT
//             // =========================================================

//             if (
//                 chartType === "pie" ||
//                 chartType === "donut"
//             ) {

//                 let pieValues = [];


//                 // =====================================================
//                 // EXTRACT VALUES FROM SERIES
//                 // =====================================================

//                 if (
//                     Array.isArray(series) &&
//                     series.length
//                 ) {

//                     // ---------------------------------------------
//                     // Normal Apex/Frappe dataset
//                     // ---------------------------------------------

//                     if (
//                         series[0] &&
//                         typeof series[0] === "object" &&
//                         Array.isArray(
//                             series[0].data
//                         )
//                     ) {

//                         pieValues =
//                             series[0].data.slice();

//                     }


//                     // ---------------------------------------------
//                     // Direct numeric array
//                     // ---------------------------------------------

//                     else if (
//                         typeof series[0] !== "object"
//                     ) {

//                         pieValues =
//                             series.slice();
//                     }
//                 }


//                 // =====================================================
//                 // FALLBACK CONFIG.DATA.VALUES
//                 // =====================================================

//                 if (
//                     !pieValues.length &&
//                     config.data &&
//                     Array.isArray(
//                         config.data.values
//                     )
//                 ) {

//                     pieValues =
//                         config.data.values.slice();
//                 }


//                 // =====================================================
//                 // FALLBACK CONFIG.DATA.DATA
//                 // =====================================================

//                 if (
//                     !pieValues.length &&
//                     config.data &&
//                     Array.isArray(
//                         config.data.data
//                     )
//                 ) {

//                     pieValues =
//                         config.data.data.slice();
//                 }


//                 // =====================================================
//                 // FALLBACK CONFIG.SERIES
//                 // =====================================================

//                 if (
//                     !pieValues.length &&
//                     Array.isArray(
//                         config.series
//                     )
//                 ) {

//                     pieValues =
//                         config.series.slice();
//                 }


//                 // =====================================================
//                 // DEBUG PIE DATA
//                 // =====================================================

//                 console.log(
//                     "========================================"
//                 );

//                 console.log(
//                     "[Apex Dashboard] PIE LABELS:",
//                     labels
//                 );

//                 console.log(
//                     "[Apex Dashboard] PIE VALUES BEFORE GROUPING:",
//                     pieValues
//                 );

//                 console.log(
//                     "========================================"
//                 );


//                 // =====================================================
//                 // GROUP DUPLICATE LABELS
//                 // =====================================================

//                 const grouped = {};


//                 labels.forEach(
//                     function (
//                         label,
//                         index
//                     ) {

//                         if (
//                             label === undefined ||
//                             label === null ||
//                             String(label).trim() === ""
//                         ) {

//                             return;
//                         }


//                         const cleanLabel =
//                             String(label).trim();


//                         let value =
//                             pieValues[index];


//                         // ---------------------------------------------
//                         // Convert string number
//                         // ---------------------------------------------

//                         if (
//                             typeof value === "string"
//                         ) {

//                             value =
//                                 value
//                                     .replace(
//                                         /,/g,
//                                         ""
//                                     )
//                                     .trim();
//                         }


//                         value =
//                             Number(value);


//                         // ---------------------------------------------
//                         // Invalid number
//                         // ---------------------------------------------

//                         if (
//                             !Number.isFinite(
//                                 value
//                             )
//                         ) {

//                             value = 0;
//                         }


//                         // ---------------------------------------------
//                         // Create group
//                         // ---------------------------------------------

//                         if (
//                             grouped[
//                                 cleanLabel
//                             ] === undefined
//                         ) {

//                             grouped[
//                                 cleanLabel
//                             ] = 0;
//                         }


//                         // ---------------------------------------------
//                         // Add value
//                         // ---------------------------------------------

//                         grouped[
//                             cleanLabel
//                         ] += value;

//                     }
//                 );


//                 // =====================================================
//                 // FINAL PIE LABELS
//                 // =====================================================

//                 labels =
//                     Object.keys(
//                         grouped
//                     );


//                 // =====================================================
//                 // FINAL PIE VALUES
//                 // =====================================================

//                 const groupedValues =
//                     labels.map(
//                         function (
//                             label
//                         ) {

//                             return grouped[
//                                 label
//                             ];

//                         }
//                     );


//                 series =
//                     groupedValues;


//                 // =====================================================
//                 // FINAL PIE DEBUG
//                 // =====================================================

//                 console.log(
//                     "========================================"
//                 );

//                 console.log(
//                     "[Apex Dashboard] FINAL PIE LABELS:",
//                     labels
//                 );

//                 console.log(
//                     "[Apex Dashboard] FINAL PIE VALUES:",
//                     series
//                 );

//                 console.log(
//                     "========================================"
//                 );
//             }


//             // =========================================================
//             // GENERAL DEBUG
//             // =========================================================

//             console.log(
//                 "========================================"
//             );

//             console.log(
//                 "[Apex Dashboard] Renderer started."
//             );

//             console.log(
//                 "[Apex Dashboard] Chart Type:",
//                 chartType
//             );

//             console.log(
//                 "[Apex Dashboard] Labels:",
//                 labels
//             );

//             console.log(
//                 "[Apex Dashboard] Series:",
//                 series
//             );

//             console.log(
//                 "[Apex Dashboard] Click Action:",
//                 config.clickAction
//             );

//             console.log(
//                 "========================================"
//             );


//             // =========================================================
//             // GET GLOBAL CONFERRED BY
//             // =========================================================

//             function getGlobalConferredBy() {

//                 const element =
//                     document.querySelector(
//                         "#leadership-conferred-by"
//                     );


//                 if (!element) {

//                     console.log(
//                         "[Apex Dashboard] Global Conferred By element not found."
//                     );

//                     return null;
//                 }


//                 const value =
//                     element.value;


//                 if (
//                     !value ||
//                     value === "All"
//                 ) {

//                     return null;
//                 }


//                 return value;
//             }


//             // =========================================================
//             // OPEN URL IN NEW TAB
//             // =========================================================

//             function openInNewTab(url) {

//                 console.log(
//                     "[Apex Dashboard] Opening in NEW TAB:"
//                 );

//                 console.log(
//                     url
//                 );


//                 const newWindow =
//                     window.open(
//                         url,
//                         "_blank"
//                     );


//                 if (!newWindow) {

//                     console.warn(
//                         "[Apex Dashboard] Browser blocked the new tab."
//                     );

//                 } else {

//                     try {

//                         newWindow.opener =
//                             null;

//                     } catch (e) {

//                         console.log(
//                             "[Apex Dashboard] Could not clear opener."
//                         );
//                     }
//                 }
//             }


//             // =========================================================
//             // OPEN QUERY REPORT
//             // =========================================================

//             function openReport(
//                 reportName,
//                 filters
//             ) {

//                 if (!reportName) {

//                     console.error(
//                         "[Apex Dashboard] Report name is missing."
//                     );

//                     return;
//                 }


//                 const params =
//                     new URLSearchParams();


//                 Object.keys(
//                     filters || {}
//                 ).forEach(
//                     function (field) {

//                         const value =
//                             filters[field];


//                         if (
//                             value !== undefined &&
//                             value !== null &&
//                             String(value).trim() !== ""
//                         ) {

//                             params.set(
//                                 field,
//                                 value
//                             );
//                         }
//                     }
//                 );


//                 const queryString =
//                     params.toString();


//                 let reportUrl =
//                     "/app/query-report/" +
//                     encodeURIComponent(
//                         reportName
//                     );


//                 if (queryString) {

//                     reportUrl +=
//                         "?" +
//                         queryString;
//                 }


//                 console.log(
//                     "========================================"
//                 );

//                 console.log(
//                     "[Apex Dashboard] OPENING REPORT"
//                 );

//                 console.log(
//                     "Report:",
//                     reportName
//                 );

//                 console.log(
//                     "Filters:",
//                     filters
//                 );

//                 console.log(
//                     "URL:",
//                     reportUrl
//                 );

//                 console.log(
//                     "========================================"
//                 );


//                 openInNewTab(
//                     reportUrl
//                 );
//             }


//             // =========================================================
//             // OPEN LIST
//             // =========================================================

//             function openList(
//                 doctype,
//                 field,
//                 value
//             ) {

//                 if (!doctype) {

//                     console.error(
//                         "[Apex Dashboard] Doctype is missing."
//                     );

//                     return;
//                 }


//                 if (!field) {

//                     console.error(
//                         "[Apex Dashboard] List filter field is missing."
//                     );

//                     return;
//                 }


//                 const filters = {};


//                 filters[field] =
//                     value;


//                 // =====================================================
//                 // GLOBAL CONFERRED BY
//                 // =====================================================

//                 const conferredBy =
//                     getGlobalConferredBy();


//                 if (conferredBy) {

//                     filters.conferred_by =
//                         conferredBy;
//                 }


//                 const params =
//                     new URLSearchParams();


//                 Object.keys(
//                     filters
//                 ).forEach(
//                     function (key) {

//                         const filterValue =
//                             filters[key];


//                         if (
//                             filterValue !== undefined &&
//                             filterValue !== null &&
//                             String(filterValue).trim() !== ""
//                         ) {

//                             params.set(
//                                 key,
//                                 filterValue
//                             );
//                         }
//                     }
//                 );


//                 // =====================================================
//                 // DOCTYPE SLUG
//                 // =====================================================

//                 let doctypeSlug;


//                 if (
//                     window.frappe &&
//                     frappe.router &&
//                     typeof frappe.router.slug === "function"
//                 ) {

//                     doctypeSlug =
//                         frappe.router.slug(
//                             doctype
//                         );

//                 } else {

//                     doctypeSlug =
//                         String(
//                             doctype
//                         )
//                             .toLowerCase()
//                             .replace(
//                                 /[^a-z0-9]+/g,
//                                 "-"
//                             )
//                             .replace(
//                                 /^-+|-+$/g,
//                                 ""
//                             );
//                 }


//                 let listUrl =
//                     "/app/" +
//                     doctypeSlug;


//                 const queryString =
//                     params.toString();


//                 if (queryString) {

//                     listUrl +=
//                         "?" +
//                         queryString;
//                 }


//                 console.log(
//                     "========================================"
//                 );

//                 console.log(
//                     "[Apex Dashboard] OPENING LIST"
//                 );

//                 console.log(
//                     "Doctype:",
//                     doctype
//                 );

//                 console.log(
//                     "Field:",
//                     field
//                 );

//                 console.log(
//                     "Value:",
//                     value
//                 );

//                 console.log(
//                     "Conferred By:",
//                     conferredBy
//                 );

//                 console.log(
//                     "URL:",
//                     listUrl
//                 );

//                 console.log(
//                     "========================================"
//                 );


//                 openInNewTab(
//                     listUrl
//                 );
//             }


//             // =========================================================
//             // GET CLICK VALUE
//             // =========================================================

//             function getClickValue(
//                 index
//             ) {

//                 if (
//                     index === undefined ||
//                     index === null ||
//                     index < 0
//                 ) {

//                     return null;
//                 }


//                 const clickAction =
//                     config.clickAction;


//                 // =====================================================
//                 // EXPLICIT CLICK VALUES
//                 // =====================================================

//                 if (
//                     clickAction &&
//                     Array.isArray(
//                         clickAction.values
//                     ) &&
//                     clickAction.values[index] !== undefined
//                 ) {

//                     return clickAction.values[
//                         index
//                     ];
//                 }


//                 // =====================================================
//                 // LABEL
//                 // =====================================================

//                 return labels[index];
//             }


//             // =========================================================
//             // HANDLE REPORT CLICK
//             // =========================================================

//             function handleReportClick(
//                 index
//             ) {

//                 if (
//                     index === undefined ||
//                     index === null ||
//                     index < 0
//                 ) {

//                     console.log(
//                         "[Apex Dashboard] Invalid click index:",
//                         index
//                     );

//                     return;
//                 }


//                 const clickAction =
//                     config.clickAction;


//                 if (!clickAction) {

//                     console.log(
//                         "[Apex Dashboard] No clickAction configured."
//                     );

//                     return;
//                 }


//                 if (
//                     clickAction.type !== "report"
//                 ) {

//                     console.log(
//                         "[Apex Dashboard] Click action is not a report action:",
//                         clickAction.type
//                     );

//                     return;
//                 }


//                 const reportName =
//                     clickAction.report;


//                 if (!reportName) {

//                     console.error(
//                         "[Apex Dashboard] Report name missing."
//                     );

//                     return;
//                 }


//                 const filterField =
//                     clickAction.field;


//                 if (!filterField) {

//                     console.error(
//                         "[Apex Dashboard] Report filter field missing."
//                     );

//                     return;
//                 }


//                 const filterValue =
//                     getClickValue(
//                         index
//                     );


//                 if (
//                     filterValue === undefined ||
//                     filterValue === null ||
//                     String(filterValue).trim() === ""
//                 ) {

//                     console.log(
//                         "[Apex Dashboard] Click filter value is empty."
//                     );

//                     return;
//                 }


//                 const filters = {};


//                 filters[
//                     filterField
//                 ] =
//                     filterValue;


//                 // =====================================================
//                 // GLOBAL CONFERRED BY
//                 // =====================================================

//                 const conferredBy =
//                     getGlobalConferredBy();


//                 if (conferredBy) {

//                     filters.conferred_by =
//                         conferredBy;
//                 }


//                 console.log(
//                     "========================================"
//                 );

//                 console.log(
//                     "[Apex Dashboard] REPORT CLICK"
//                 );

//                 console.log(
//                     "Chart Type:",
//                     chartType
//                 );

//                 console.log(
//                     "Index:",
//                     index
//                 );

//                 console.log(
//                     "Label:",
//                     labels[index]
//                 );

//                 console.log(
//                     "Filter Field:",
//                     filterField
//                 );

//                 console.log(
//                     "Filter Value:",
//                     filterValue
//                 );

//                 console.log(
//                     "Conferred By:",
//                     conferredBy
//                 );

//                 console.log(
//                     "Report:",
//                     reportName
//                 );

//                 console.log(
//                     "Filters:",
//                     filters
//                 );

//                 console.log(
//                     "========================================"
//                 );


//                 openReport(
//                     reportName,
//                     filters
//                 );
//             }


//             // =========================================================
//             // HANDLE LIST CLICK
//             // =========================================================

//             function handleListClick(
//                 index
//             ) {

//                 const clickAction =
//                     config.clickAction;


//                 if (!clickAction) {

//                     console.log(
//                         "[Apex Dashboard] No clickAction configured."
//                     );

//                     return;
//                 }


//                 if (
//                     clickAction.type !== "list"
//                 ) {

//                     console.log(
//                         "[Apex Dashboard] Click action is not a list action."
//                     );

//                     return;
//                 }


//                 const doctype =
//                     clickAction.doctype;


//                 const field =
//                     clickAction.field;


//                 if (!doctype) {

//                     console.error(
//                         "[Apex Dashboard] List doctype missing."
//                     );

//                     return;
//                 }


//                 if (!field) {

//                     console.error(
//                         "[Apex Dashboard] List filter field missing."
//                     );

//                     return;
//                 }


//                 const filterValue =
//                     getClickValue(
//                         index
//                     );


//                 if (
//                     filterValue === undefined ||
//                     filterValue === null ||
//                     String(filterValue).trim() === ""
//                 ) {

//                     console.log(
//                         "[Apex Dashboard] List filter value is empty."
//                     );

//                     return;
//                 }


//                 openList(
//                     doctype,
//                     field,
//                     filterValue
//                 );
//             }


//             // =========================================================
//             // HANDLE ANY CLICK ACTION
//             // =========================================================

//             function handleClick(
//                 index
//             ) {

//                 const clickAction =
//                     config.clickAction;


//                 if (!clickAction) {

//                     console.log(
//                         "[Apex Dashboard] No clickAction configured."
//                     );

//                     return;
//                 }


//                 if (
//                     clickAction.type === "report"
//                 ) {

//                     handleReportClick(
//                         index
//                     );

//                     return;
//                 }


//                 if (
//                     clickAction.type === "list"
//                 ) {

//                     handleListClick(
//                         index
//                     );

//                     return;
//                 }


//                 console.log(
//                     "[Apex Dashboard] Unsupported clickAction type:",
//                     clickAction.type
//                 );
//             }


//             // =========================================================
//             // APEX CHART OPTIONS
//             // =========================================================

//             const options = {

//                 // =====================================================
//                 // CHART
//                 // =====================================================

//                 chart: {

//                     type:
//                         chartType,

//                     height:
//                         config.height || 500,

//                     toolbar: {

//                         show:
//                             false
//                     },


//                     // =================================================
//                     // EVENTS
//                     // =================================================

//                     events: {

//                         // ---------------------------------------------
//                         // DATA POINT SELECTION
//                         // ---------------------------------------------

//                         dataPointSelection:
//                             function (
//                                 event,
//                                 chartContext,
//                                 chartConfig
//                             ) {

//                                 const index =
//                                     chartConfig.dataPointIndex;


//                                 console.log(
//                                     "[Apex Dashboard] Data point selected:",
//                                     index
//                                 );


//                                 if (
//                                     index === undefined ||
//                                     index === null ||
//                                     index < 0
//                                 ) {

//                                     return;
//                                 }


//                                 handleClick(
//                                     index
//                                 );
//                             },


//                         // ---------------------------------------------
//                         // MARKER CLICK
//                         // ---------------------------------------------

//                         markerClick:
//                             function (
//                                 event,
//                                 chartContext,
//                                 data
//                             ) {

//                                 const index =
//                                     data.dataPointIndex;


//                                 if (
//                                     chartType === "line" ||
//                                     chartType === "area"
//                                 ) {

//                                     console.log(
//                                         "[Apex Dashboard] Marker clicked:",
//                                         index
//                                     );


//                                     handleClick(
//                                         index
//                                     );
//                                 }
//                             }

//                     }
//                 },


//                 // =====================================================
//                 // MARKERS
//                 // =====================================================

//                 markers: {

//                     size:
//                         (
//                             chartType === "line" ||
//                             chartType === "area"
//                         )
//                             ? 6
//                             : 0,


//                     hover: {

//                         size:
//                             (
//                                 chartType === "line" ||
//                                 chartType === "area"
//                             )
//                                 ? 9
//                                 : 0
//                     }
//                 },


//                 // =====================================================
//                 // SERIES
//                 // =====================================================

//                 series:
//                     series,


//                 // =====================================================
//                 // LABELS
//                 // =====================================================

//                 labels:
//                     labels,


//                 // =====================================================
//                 // COLORS
//                 // =====================================================

//                 colors:
//                     Array.isArray(
//                         config.colors
//                     ) &&
//                     config.colors.length

//                         ? config.colors.filter(
//                             function (color) {

//                                 return (
//                                     typeof color === "string" &&
//                                     color.trim()
//                                 );
//                             }
//                         )

//                         : [
//                             "#F683AE",
//                             "#318AD8",
//                             "#48BB74",
//                             "#FFA500",
//                             "#8B0000",
//                             "#6A5ACD",
//                             "#20B2AA",
//                             "#D2691E"
//                         ],


//                 // =====================================================
//                 // STROKE
//                 // =====================================================

//                 stroke: {

//                     show:
//                         chartType === "line" ||
//                         chartType === "area",

//                     width:
//                         (
//                             chartType === "line" ||
//                             chartType === "area"
//                         )
//                             ? 3
//                             : 0,

//                     curve:
//                         "straight"
//                 },


//                 // =====================================================
//                 // X AXIS
//                 // =====================================================

//                 xaxis: {

//                     categories:
//                         labels
//                 },


//                 // =====================================================
//                 // DATA LABELS
//                 // =====================================================

//                 dataLabels: {

//                     enabled:
//                         config.dataLabels !== false
//                 },


//                 // =====================================================
//                 // LEGEND
//                 // =====================================================

//                 legend: {

//                     show:
//                         config.legend !== false,

//                     position:
//                         config.legendPosition ||
//                         "right"
//                 },


//                 // =====================================================
//                 // TOOLTIP
//                 // =====================================================

//                 tooltip: {

//                     enabled:
//                         true
//                 }

//             };


//             // =========================================================
//             // BAR CHART
//             // =========================================================

//             if (
//                 chartType === "bar"
//             ) {

//                 options.plotOptions = {

//                     bar: {

//                         horizontal:
//                             false,

//                         columnWidth:
//                             "55%",

//                         borderRadius:
//                             1
//                     }
//                 };
//             }


//             // =========================================================
//             // PIE CHART
//             // =========================================================

//             if (
//                 chartType === "pie"
//             ) {

//                 options.chart.type =
//                     "pie";
//             }


//             // =========================================================
//             // DONUT CHART
//             // =========================================================

//             if (
//                 chartType === "donut"
//             ) {

//                 options.chart.type =
//                     "donut";
//             }


//             // =========================================================
//             // PIE/DONUT TOOLTIP
//             // =========================================================

//             if (
//                 chartType === "pie" ||
//                 chartType === "donut"
//             ) {

//                 options.tooltip = {

//                     enabled:
//                         true,

//                     y: {

//                         formatter:
//                             function (
//                                 value
//                             ) {

//                                 return value;
//                             }
//                     }
//                 };
//             }


//             // =========================================================
//             // DEBUG FINAL OPTIONS
//             // =========================================================

//             console.log(
//                 "========================================"
//             );

//             console.log(
//                 "[Apex Dashboard] FINAL OPTIONS:",
//                 options
//             );

//             console.log(
//                 "========================================"
//             );


//             // =========================================================
//             // CREATE APEX CHART
//             // =========================================================

//             const chart =
//                 new window.ApexCharts(
//                     chartElement,
//                     options
//                 );


//             // =========================================================
//             // RENDER
//             // =========================================================

//             chart.render();


//             // =========================================================
//             // RETURN CHART
//             // =========================================================

//             return chart;
//         }
//     };

// })();

(function () {

    "use strict";


    // =============================================================
    // APEX DASHBOARD RENDERER
    // ERPNext / Frappe v15
    // =============================================================

    window.ApexDashboardRenderer = {

        render: function (container, config) {

            // =========================================================
            // NORMALIZE CONFIG FIRST
            // =========================================================

            config = config || {};


            // =========================================================
            // RAW INPUT DEBUG
            // =========================================================

            console.log(
                "========== APEX RAW INPUT =========="
            );

            console.log(
                "FULL CONFIG:",
                JSON.stringify(config, null, 2)
            );

            console.log(
                "CONFIG DATA:",
                JSON.stringify(config.data, null, 2)
            );

            console.log(
                "DATASETS:",
                JSON.stringify(
                    config.data &&
                    config.data.datasets
                        ? config.data.datasets
                        : null,
                    null,
                    2
                )
            );

            console.log(
                "SERIES:",
                JSON.stringify(
                    config.series,
                    null,
                    2
                )
            );

            console.log(
                "===================================="
            );


            // =========================================================
            // CHART TYPE
            // =========================================================

            const chartType =
                String(
                    config.type || "bar"
                ).toLowerCase();


            // =========================================================
            // CHECK CONTAINER
            // =========================================================

            if (!container) {

                console.error(
                    "[Apex Dashboard] Container not found."
                );

                return;
            }


            // =========================================================
            // CHECK APEXCHARTS
            // =========================================================

            if (
                typeof window.ApexCharts === "undefined"
            ) {

                console.error(
                    "[Apex Dashboard] ApexCharts is not loaded."
                );

                return;
            }


            // =========================================================
            // CLEAR EXISTING CONTENT
            // =========================================================

            container.innerHTML = "";


            // =========================================================
            // CREATE CHART ELEMENT
            // =========================================================

            const chartElement =
                document.createElement("div");

            chartElement.style.width =
                "100%";

            chartElement.style.height =
                String(
                    config.height || 500
                ) + "px";

            container.appendChild(
                chartElement
            );


            // =========================================================
            // INITIAL DATA
            // =========================================================

            let series = [];

            let labels = [];


            // =========================================================
            // READ LABELS
            // =========================================================

            if (
                config.data &&
                Array.isArray(
                    config.data.labels
                )
            ) {

                labels =
                    config.data.labels.slice();

            }
            else if (
                Array.isArray(
                    config.labels
                )
            ) {

                labels =
                    config.labels.slice();
            }


            // =========================================================
            // READ DATASETS
            // =========================================================

            if (
                config.data &&
                Array.isArray(
                    config.data.datasets
                ) &&
                config.data.datasets.length
            ) {

                series =
                    config.data.datasets.map(
                        function (
                            dataset,
                            datasetIndex
                        ) {

                            dataset =
                                dataset || {};


                            console.log(
                                "[Apex Dashboard] Dataset " +
                                datasetIndex +
                                ":",
                                dataset
                            );


                            let values = [];


                            // =================================================
                            // FRAPPE FORMAT
                            // =================================================

                            if (
                                Array.isArray(
                                    dataset.values
                                )
                            ) {

                                values =
                                    dataset.values.slice();
                            }


                            // =================================================
                            // APEX FORMAT
                            // =================================================

                            else if (
                                Array.isArray(
                                    dataset.data
                                )
                            ) {

                                values =
                                    dataset.data.slice();
                            }


                            // =================================================
                            // OBJECT VALUES
                            // =================================================

                            else if (
                                dataset.values &&
                                typeof dataset.values === "object"
                            ) {

                                values =
                                    Object.values(
                                        dataset.values
                                    );
                            }


                            // =================================================
                            // OBJECT DATA
                            // =================================================

                            else if (
                                dataset.data &&
                                typeof dataset.data === "object"
                            ) {

                                values =
                                    Object.values(
                                        dataset.data
                                    );
                            }


                            // =================================================
                            // SINGLE VALUE
                            // =================================================

                            else if (
                                dataset.value !== undefined &&
                                dataset.value !== null
                            ) {

                                values = [
                                    dataset.value
                                ];
                            }


                            console.log(
                                "[Apex Dashboard] Extracted values:",
                                values
                            );


                            return {

                                name:
                                    dataset.name ||
                                    dataset.label ||
                                    "Value",

                                data:
                                    values

                            };

                        }
                    );
            }


            // =========================================================
            // SIMPLE DATA.VALUES
            // =========================================================

            else if (
                config.data &&
                Array.isArray(
                    config.data.values
                )
            ) {

                series = [
                    {
                        name:
                            "Value",

                        data:
                            config.data.values.slice()
                    }
                ];
            }


            // =========================================================
            // SIMPLE DATA.DATA
            // =========================================================

            else if (
                config.data &&
                Array.isArray(
                    config.data.data
                )
            ) {

                series = [
                    {
                        name:
                            "Value",

                        data:
                            config.data.data.slice()
                    }
                ];
            }


            // =========================================================
            // FALLBACK SERIES
            // =========================================================

            if (
                !series.length &&
                Array.isArray(
                    config.series
                )
            ) {

                series =
                    config.series.slice();
            }


            // =========================================================
            // FALLBACK LABELS
            // =========================================================

            if (
                !labels.length &&
                Array.isArray(
                    config.labels
                )
            ) {

                labels =
                    config.labels.slice();
            }


            // =========================================================
            // NORMALIZE SERIES
            // =========================================================

            if (
                !Array.isArray(series)
            ) {

                series = [];
            }


            // =========================================================
            // CARTESIAN CHARTS
            // bar / line / area
            // =========================================================

            if (
                chartType !== "pie" &&
                chartType !== "donut"
            ) {

                // -----------------------------------------------------
                // Convert simple numeric array
                // -----------------------------------------------------

                if (
                    series.length &&
                    typeof series[0] !== "object"
                ) {

                    series = [
                        {
                            name:
                                "Value",

                            data:
                                series.slice()
                        }
                    ];
                }


                // -----------------------------------------------------
                // Normalize each dataset
                // -----------------------------------------------------

                series =
                    series.map(
                        function (item) {

                            if (
                                item &&
                                typeof item === "object"
                            ) {

                                let itemData =
                                    item.data;


                                if (
                                    !Array.isArray(
                                        itemData
                                    )
                                ) {

                                    if (
                                        Array.isArray(
                                            item.values
                                        )
                                    ) {

                                        itemData =
                                            item.values.slice();

                                    }
                                    else {

                                        itemData = [];
                                    }
                                }


                                return {

                                    name:
                                        item.name ||
                                        item.label ||
                                        "Value",

                                    data:
                                        itemData

                                };
                            }


                            return {

                                name:
                                    "Value",

                                data:
                                    [item]

                            };

                        }
                    );
            }


            // =========================================================
            // PIE / DONUT
            //
            // IMPORTANT:
            //
            // Your reports return RAW RECORDS.
            //
            // Example:
            //
            // labels:
            //
            // Gold
            // Gold
            // Gold
            // Silver
            // Silver
            //
            // We therefore COUNT labels.
            //
            // We DO NOT use the supplied values for grouping because
            // those values are not aligned with the raw labels.
            // =========================================================

            if (
                chartType === "pie" ||
                chartType === "donut"
            ) {

                console.log(
                    "========================================"
                );

                console.log(
                    "[Apex Dashboard] PROCESSING PIE/DONUT"
                );

                console.log(
                    "[Apex Dashboard] RAW LABEL COUNT:",
                    labels.length
                );


                // =====================================================
                // COUNT EACH LABEL
                // =====================================================

                const counts =
                    Object.create(null);


                labels.forEach(
                    function (label) {

                        if (
                            label === undefined ||
                            label === null
                        ) {

                            return;
                        }


                        const cleanLabel =
                            String(label).trim();


                        if (!cleanLabel) {

                            return;
                        }


                        if (
                            counts[cleanLabel] === undefined
                        ) {

                            counts[cleanLabel] = 0;
                        }


                        counts[cleanLabel] += 1;

                    }
                );


                // =====================================================
                // UNIQUE LABELS
                // =====================================================

                const uniqueLabels =
                    Object.keys(counts);


                // =====================================================
                // GROUPED VALUES
                // =====================================================

                let groupedLabels =
                    uniqueLabels.slice();


                let groupedValues =
                    groupedLabels.map(
                        function (label) {

                            return counts[label];

                        }
                    );


                console.log(
                    "[Apex Dashboard] UNIQUE LABELS:",
                    groupedLabels
                );

                console.log(
                    "[Apex Dashboard] COUNT VALUES:",
                    groupedValues
                );


                // =====================================================
                // REMOVE ZERO VALUES
                //
                // Normally count values cannot be zero, but this keeps
                // the chart clean.
                // =====================================================

                const filteredLabels = [];

                const filteredValues = [];


                groupedLabels.forEach(
                    function (
                        label,
                        index
                    ) {

                        const value =
                            Number(
                                groupedValues[index]
                            );


                        if (
                            Number.isFinite(value) &&
                            value > 0
                        ) {

                            filteredLabels.push(
                                label
                            );

                            filteredValues.push(
                                value
                            );
                        }

                    }
                );


                groupedLabels =
                    filteredLabels;

                groupedValues =
                    filteredValues;


                // =====================================================
                // MAX SLICES
                //
                // If maxSlices is 6 and there are 8 categories:
                //
                // first 6 are shown
                // remaining 2 become "Other"
                // =====================================================

                const maxSlices =
                    Number(
                        config.maxSlices
                    );


                if (
                    Number.isFinite(maxSlices) &&
                    maxSlices > 0 &&
                    groupedLabels.length > maxSlices
                ) {

                    const limitedLabels =
                        groupedLabels.slice(
                            0,
                            maxSlices
                        );

                    const limitedValues =
                        groupedValues.slice(
                            0,
                            maxSlices
                        );


                    const otherValue =
                        groupedValues
                            .slice(maxSlices)
                            .reduce(
                                function (
                                    total,
                                    value
                                ) {

                                    return (
                                        total +
                                        Number(value || 0)
                                    );

                                },
                                0
                            );


                    if (
                        otherValue > 0
                    ) {

                        limitedLabels.push(
                            "Other"
                        );

                        limitedValues.push(
                            otherValue
                        );
                    }


                    groupedLabels =
                        limitedLabels;

                    groupedValues =
                        limitedValues;
                }


                // =====================================================
                // ASSIGN FINAL PIE DATA
                // =====================================================

                labels =
                    groupedLabels;

                series =
                    groupedValues;


                // =====================================================
                // FINAL PIE DEBUG
                // =====================================================

                console.log(
                    "[Apex Dashboard] FINAL PIE LABELS:",
                    labels
                );

                console.log(
                    "[Apex Dashboard] FINAL PIE VALUES:",
                    series
                );

                console.log(
                    "========================================"
                );
            }


            // =========================================================
            // GENERAL DEBUG
            // =========================================================

            console.log(
                "========================================"
            );

            console.log(
                "[Apex Dashboard] Renderer started."
            );

            console.log(
                "[Apex Dashboard] Chart Type:",
                chartType
            );

            console.log(
                "[Apex Dashboard] Labels:",
                labels
            );

            console.log(
                "[Apex Dashboard] Series:",
                series
            );

            console.log(
                "[Apex Dashboard] Click Action:",
                config.clickAction
            );

            console.log(
                "========================================"
            );


            // =========================================================
            // GLOBAL CONFERRED BY
            // =========================================================

            function getGlobalConferredBy() {

                const element =
                    document.querySelector(
                        "#leadership-conferred-by"
                    );


                if (!element) {

                    return null;
                }


                const value =
                    element.value;


                if (
                    !value ||
                    value === "All"
                ) {

                    return null;
                }


                return value;
            }


            // =========================================================
            // OPEN NEW TAB
            // =========================================================

            function openInNewTab(url) {

                console.log(
                    "========================================"
                );

                console.log(
                    "[Apex Dashboard] OPENING NEW TAB:"
                );

                console.log(
                    url
                );

                console.log(
                    "========================================"
                );


                const newWindow =
                    window.open(
                        url,
                        "_blank"
                    );


                if (!newWindow) {

                    console.warn(
                        "[Apex Dashboard] Browser blocked the new tab."
                    );

                    return;
                }


                try {

                    newWindow.opener =
                        null;

                }
                catch (e) {

                    console.warn(
                        "[Apex Dashboard] Could not clear opener.",
                        e
                    );
                }
            }


            // =========================================================
            // OPEN REPORT
            // =========================================================

            function openReport(
                reportName,
                filters
            ) {

                if (!reportName) {

                    console.error(
                        "[Apex Dashboard] Report name is missing."
                    );

                    return;
                }


                const params =
                    new URLSearchParams();


                Object.keys(
                    filters || {}
                ).forEach(
                    function (field) {

                        const value =
                            filters[field];


                        if (
                            value !== undefined &&
                            value !== null &&
                            String(value).trim() !== ""
                        ) {

                            params.set(
                                field,
                                String(value)
                            );
                        }

                    }
                );


                let reportUrl =
                    "/app/query-report/" +
                    encodeURIComponent(
                        reportName
                    );


                const queryString =
                    params.toString();


                if (queryString) {

                    reportUrl +=
                        "?" +
                        queryString;
                }


                console.log(
                    "[Apex Dashboard] REPORT:",
                    reportName
                );

                console.log(
                    "[Apex Dashboard] FILTERS:",
                    filters
                );

                console.log(
                    "[Apex Dashboard] REPORT URL:",
                    reportUrl
                );


                openInNewTab(
                    reportUrl
                );
            }


            // =========================================================
            // OPEN LIST
            // =========================================================

            function openList(
                doctype,
                field,
                value
            ) {

                if (!doctype) {

                    console.error(
                        "[Apex Dashboard] Doctype is missing."
                    );

                    return;
                }


                if (!field) {

                    console.error(
                        "[Apex Dashboard] List field is missing."
                    );

                    return;
                }


                const filters = {};


                filters[field] =
                    value;


                // -----------------------------------------------------
                // GLOBAL CONFERRED BY
                // -----------------------------------------------------

                const conferredBy =
                    getGlobalConferredBy();


                if (conferredBy) {

                    filters.conferred_by =
                        conferredBy;
                }


                const params =
                    new URLSearchParams();


                Object.keys(
                    filters
                ).forEach(
                    function (key) {

                        const filterValue =
                            filters[key];


                        if (
                            filterValue !== undefined &&
                            filterValue !== null &&
                            String(filterValue).trim() !== ""
                        ) {

                            params.set(
                                key,
                                String(filterValue)
                            );
                        }

                    }
                );


                // =====================================================
                // DOCTYPE SLUG
                // =====================================================

                let doctypeSlug;


                if (
                    window.frappe &&
                    frappe.router &&
                    typeof frappe.router.slug === "function"
                ) {

                    doctypeSlug =
                        frappe.router.slug(
                            doctype
                        );

                }
                else {

                    doctypeSlug =
                        String(
                            doctype
                        )
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            )
                            .replace(
                                /^-+|-+$/g,
                                ""
                            );
                }


                let listUrl =
                    "/app/" +
                    doctypeSlug;


                const queryString =
                    params.toString();


                if (queryString) {

                    listUrl +=
                        "?" +
                        queryString;
                }


                console.log(
                    "[Apex Dashboard] LIST DOCTYPE:",
                    doctype
                );

                console.log(
                    "[Apex Dashboard] LIST FIELD:",
                    field
                );

                console.log(
                    "[Apex Dashboard] LIST VALUE:",
                    value
                );

                console.log(
                    "[Apex Dashboard] LIST URL:",
                    listUrl
                );


                openInNewTab(
                    listUrl
                );
            }


            // =========================================================
            // GET CLICK VALUE
            // =========================================================

            function getClickValue(
                index
            ) {

                if (
                    index === undefined ||
                    index === null ||
                    index < 0
                ) {

                    return null;
                }


                const clickAction =
                    config.clickAction;


                // -----------------------------------------------------
                // Explicit click values
                // -----------------------------------------------------

                if (
                    clickAction &&
                    Array.isArray(
                        clickAction.values
                    ) &&
                    clickAction.values[index] !== undefined
                ) {

                    return clickAction.values[index];
                }


                // -----------------------------------------------------
                // Pie / donut
                //
                // After grouping, labels[index] is the actual category.
                // -----------------------------------------------------

                if (
                    chartType === "pie" ||
                    chartType === "donut"
                ) {

                    return labels[index];
                }


                // -----------------------------------------------------
                // Normal chart
                // -----------------------------------------------------

                return labels[index];
            }


            // =========================================================
            // REPORT CLICK
            // =========================================================

            function handleReportClick(
                index
            ) {

                const clickAction =
                    config.clickAction;


                if (!clickAction) {

                    console.log(
                        "[Apex Dashboard] No clickAction configured."
                    );

                    return;
                }


                if (
                    clickAction.type !== "report"
                ) {

                    return;
                }


                const reportName =
                    clickAction.report;


                const filterField =
                    clickAction.field;


                if (!reportName) {

                    console.error(
                        "[Apex Dashboard] Report name missing."
                    );

                    return;
                }


                if (!filterField) {

                    console.error(
                        "[Apex Dashboard] Report filter field missing."
                    );

                    return;
                }


                const filterValue =
                    getClickValue(
                        index
                    );


                if (
                    filterValue === undefined ||
                    filterValue === null ||
                    String(filterValue).trim() === ""
                ) {

                    console.warn(
                        "[Apex Dashboard] Click value is empty."
                    );

                    return;
                }


                const filters = {};


                filters[
                    filterField
                ] =
                    filterValue;


                // -----------------------------------------------------
                // Global Conferred By
                // -----------------------------------------------------

                const conferredBy =
                    getGlobalConferredBy();


                if (conferredBy) {

                    filters.conferred_by =
                        conferredBy;
                }


                console.log(
                    "========================================"
                );

                console.log(
                    "[Apex Dashboard] REPORT CLICK"
                );

                console.log(
                    "Index:",
                    index
                );

                console.log(
                    "Label:",
                    labels[index]
                );

                console.log(
                    "Filter Field:",
                    filterField
                );

                console.log(
                    "Filter Value:",
                    filterValue
                );

                console.log(
                    "Report:",
                    reportName
                );

                console.log(
                    "Filters:",
                    filters
                );

                console.log(
                    "========================================"
                );


                openReport(
                    reportName,
                    filters
                );
            }


            // =========================================================
            // LIST CLICK
            // =========================================================

            function handleListClick(
                index
            ) {

                const clickAction =
                    config.clickAction;


                if (!clickAction) {

                    console.log(
                        "[Apex Dashboard] No clickAction configured."
                    );

                    return;
                }


                if (
                    clickAction.type !== "list"
                ) {

                    return;
                }


                const doctype =
                    clickAction.doctype;


                const field =
                    clickAction.field;


                if (!doctype) {

                    console.error(
                        "[Apex Dashboard] List doctype missing."
                    );

                    return;
                }


                if (!field) {

                    console.error(
                        "[Apex Dashboard] List field missing."
                    );

                    return;
                }


                const filterValue =
                    getClickValue(
                        index
                    );


                if (
                    filterValue === undefined ||
                    filterValue === null ||
                    String(filterValue).trim() === ""
                ) {

                    console.warn(
                        "[Apex Dashboard] List click value is empty."
                    );

                    return;
                }


                openList(
                    doctype,
                    field,
                    filterValue
                );
            }


            // =========================================================
            // HANDLE CLICK
            // =========================================================

            function handleClick(
                index
            ) {

                const clickAction =
                    config.clickAction;


                if (!clickAction) {

                    console.log(
                        "[Apex Dashboard] No clickAction configured."
                    );

                    return;
                }


                if (
                    clickAction.type === "report"
                ) {

                    handleReportClick(
                        index
                    );

                    return;
                }


                if (
                    clickAction.type === "list"
                ) {

                    handleListClick(
                        index
                    );

                    return;
                }


                console.warn(
                    "[Apex Dashboard] Unsupported clickAction:",
                    clickAction.type
                );
            }


            // =========================================================
            // BUILD APEX OPTIONS
            // =========================================================

            const options = {

                chart: {

                    type:
                        chartType,

                    height:
                        config.height || 500,

                    toolbar: {

                        show:
                            false
                    },

                    events: {

                        // =================================================
                        // DATA POINT CLICK
                        // =================================================

                        dataPointSelection:
                            function (
                                event,
                                chartContext,
                                chartConfig
                            ) {

                                const index =
                                    chartConfig.dataPointIndex;


                                console.log(
                                    "[Apex Dashboard] Data point selected:",
                                    index
                                );


                                if (
                                    index === undefined ||
                                    index === null ||
                                    index < 0
                                ) {

                                    return;
                                }


                                handleClick(
                                    index
                                );
                            },


                        // =================================================
                        // MARKER CLICK
                        // =================================================

                        markerClick:
                            function (
                                event,
                                chartContext,
                                data
                            ) {

                                const index =
                                    data.dataPointIndex;


                                if (
                                    chartType === "line" ||
                                    chartType === "area"
                                ) {

                                    console.log(
                                        "[Apex Dashboard] Marker clicked:",
                                        index
                                    );


                                    handleClick(
                                        index
                                    );
                                }
                            }

                    }
                },


                // =====================================================
                // MARKERS
                // =====================================================

                markers: {

                    size:
                        (
                            chartType === "line" ||
                            chartType === "area"
                        )
                            ? 6
                            : 0,

                    hover: {

                        size:
                            (
                                chartType === "line" ||
                                chartType === "area"
                            )
                                ? 9
                                : 0
                    }
                },


                // =====================================================
                // SERIES
                // =====================================================

                series:
                    series,


                // =====================================================
                // LABELS
                // =====================================================

                labels:
                    labels,


                // =====================================================
                // COLORS
                //
                // IMPORTANT:
                // If config.colors contains [null], do NOT use it.
                // Use the default colors instead.
                // =====================================================

                colors:
                    (
                        Array.isArray(
                            config.colors
                        )
                            ? config.colors.filter(
                                function (color) {

                                    return (
                                        typeof color === "string" &&
                                        color.trim() !== ""
                                    );
                                }
                            )
                            : []
                    ).length > 0

                        ? config.colors.filter(
                            function (color) {

                                return (
                                    typeof color === "string" &&
                                    color.trim() !== ""
                                );
                            }
                        )

                        : [
                            "#F683AE",
                            "#318AD8",
                            "#48BB74",
                            "#FFA500",
                            "#8B0000",
                            "#6A5ACD",
                            "#20B2AA",
                            "#D2691E"
                        ],


                // =====================================================
                // STROKE
                // =====================================================

                stroke: {

                    show:
                        chartType === "line" ||
                        chartType === "area",

                    width:
                        (
                            chartType === "line" ||
                            chartType === "area"
                        )
                            ? 3
                            : 0,

                    curve:
                        "straight"
                },


                // =====================================================
                // X AXIS
                // =====================================================

                xaxis: {

                    categories:
                        labels
                },


                // =====================================================
                // DATA LABELS
                // =====================================================

                dataLabels: {

                    enabled:
                        config.dataLabels !== false
                },


                // =====================================================
                // LEGEND
                // =====================================================

                legend: {

                    show:
                        config.legend !== false,

                    position:
                        config.legendPosition ||
                        "right"
                },


                // =====================================================
                // TOOLTIP
                // =====================================================

                tooltip: {

                    enabled:
                        true
                }

            };


            // =========================================================
            // BAR CHART
            // =========================================================

            if (
                chartType === "bar"
            ) {

                options.plotOptions = {

                    bar: {

                        horizontal:
                            false,

                        columnWidth:
                            "55%",

                        borderRadius:
                            1
                    }
                };
            }


            // =========================================================
            // PIE
            // =========================================================

            if (
                chartType === "pie"
            ) {

                options.chart.type =
                    "pie";
            }


            // =========================================================
            // DONUT
            // =========================================================

            if (
                chartType === "donut"
            ) {

                options.chart.type =
                    "donut";


                options.plotOptions = {

                    pie: {

                        donut: {

                            size:
                                "60%"
                        }
                    }
                };
            }


            // =========================================================
            // PIE / DONUT TOOLTIP
            // =========================================================

            if (
                chartType === "pie" ||
                chartType === "donut"
            ) {

                options.tooltip = {

                    enabled:
                        true,

                    y: {

                        formatter:
                            function (
                                value
                            ) {

                                return String(
                                    value
                                );
                            }
                    }
                };
            }


            // =========================================================
            // FINAL DEBUG
            // =========================================================

            console.log(
                "========================================"
            );

            console.log(
                "[Apex Dashboard] FINAL OPTIONS:",
                options
            );

            console.log(
                "[Apex Dashboard] FINAL LABELS:",
                labels
            );

            console.log(
                "[Apex Dashboard] FINAL SERIES:",
                series
            );

            console.log(
                "========================================"
            );


            // =========================================================
            // CREATE CHART
            // =========================================================

            let chart;


            try {

                chart =
                    new window.ApexCharts(
                        chartElement,
                        options
                    );

            }
            catch (error) {

                console.error(
                    "[Apex Dashboard] Failed to create ApexCharts:",
                    error
                );

                return;
            }


            // =========================================================
            // RENDER CHART
            // =========================================================

            try {

                chart.render();

            }
            catch (error) {

                console.error(
                    "[Apex Dashboard] Failed to render chart:",
                    error
                );

                return;
            }


            // =========================================================
            // RETURN CHART
            // =========================================================

            return chart;
        }
    };
})();