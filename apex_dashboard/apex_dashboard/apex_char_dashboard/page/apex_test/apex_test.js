frappe.pages['apex-test'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'ApexCharts Test',
		single_column: true
	});
}