import * as XLSX from 'xlsx';

let activeFilterArray: Object[] = [];

export function handleApplyFilterHelper(
	event: any,
	columns: any[],
	dataSource: any[],
	fullDataSource: any[]
) {
	let filterValue = event.detail.filterValue.toLowerCase();
	let filterCondition = event.detail.selected;
	let filterColumn = event.detail.columnHeader;

	// Add the new filter to activeFilterArray
	activeFilterArray.push({
		filterValue: filterValue,
		filterCondition: filterCondition,
		filterColumn: filterColumn
	});

	columns = columns.map((column: any) => {
		if (column.field === filterColumn) {
			return { ...column, isFilterActive: true, showFilterPopup: false };
		}
		return column;
	});

	// Apply all active filters
	dataSource = fullDataSource;
	activeFilterArray.forEach((filter: any) => {
		dataSource = dataSource.filter((item: any) => {
			let columnValue = item[filter.filterColumn].toString().toLowerCase();
			switch (filter.filterCondition) {
				case 'contains':
					return columnValue.includes(filter.filterValue);
				case 'equals':
					return columnValue === filter.filterValue;
				default:
					return true;
			}
		});
	});

	return { columns, dataSource };
}

// Function For Clearing the Filter
export function clearFilterHelper(
	event: any,
	columns: any[],
	dataSource: any[],
	fullDataSource: any[]
) {
	let filterColumn = event.detail.columnHeader;

	activeFilterArray = activeFilterArray.filter(
		(filter: any) => filter.filterColumn !== filterColumn
	);

	// Reset the isFilterActive and showFilterPopup flags for the cleared filter
	columns = columns.map((column: any) => {
		if (column.field === filterColumn) {
			return { ...column, isFilterActive: false, showFilterPopup: false };
		}
		return column;
	});

	// Reapply all active filters
	dataSource = fullDataSource;
	activeFilterArray.forEach((filter: any) => {
		dataSource = dataSource.filter((item: any) => {
			let columnValue = item[filter.filterColumn].toString().toLowerCase();
			switch (filter.filterCondition) {
				case 'contains':
					return columnValue.includes(filter.filterValue);
				case 'equals':
					return columnValue === filter.filterValue;
				default:
					return true;
			}
		});
	});

	return { columns, dataSource };
}

export function exportToExcelHelper(dataSource: any[], columns: any[], excelName: string) {
	const dataToExport = dataSource.map((row) => {
		const rowData: any = {};
		columns.forEach((column: any) => {
			rowData[column.field] = row[column.field];
		});
		return rowData;
	});
	const ws = XLSX.utils.json_to_sheet(dataToExport);
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
	XLSX.writeFile(wb, `${excelName}.xlsx`);
}
