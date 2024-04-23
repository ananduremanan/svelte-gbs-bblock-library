<script lang="ts">
	import { AngleLeftOutline, AngleRightOutline } from 'flowbite-svelte-icons';

	// Props To Grid Component
	export let dataSource: Object[];
	export let columns: Object[];

	// Grid Variables
	let currentPage = 0;
	export let pageNumber = 10;
	let pageStart = 0;
	let pageEnd = 10;

	// Total Number Of Pages
	const totalPages = Math.ceil(dataSource.length / pageNumber);

	// Function For Next Page Navigation
	function nextPage() {
		if (currentPage < totalPages - 1) {
			currentPage++;
			if (currentPage >= pageEnd) {
				pageStart += 10;
				pageEnd += 10;
			}
		}
	}

	// Function For Previous Page Navigation
	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
			if (currentPage < pageStart) {
				pageStart -= 10;
				pageEnd -= 10;
			}
		}
	}

	// Function For Navigating to a Particular Page
	function goToPage(page: number): void {
		currentPage = pageStart + page;
	}
</script>

<div class="flex flex-col">
	{#if dataSource}
		{#if columns}
			<table>
				<thead>
					<tr>
						{#each columns as columnHeader}
							<th class="border p-2">{columnHeader.field}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each dataSource.slice(currentPage * pageNumber, (currentPage + 1) * pageNumber) as rowData}
						<tr>
							{#each columns as column}
								{#if column.template}
									<td class="border p-2 flex justify-center"
										><svelte:component this={column.template} {rowData} /></td
									>
								{:else}
									<td class="border p-2">{rowData[column.field]}</td>
								{/if}
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
			<div class="flex border p-2 justify-between">
				<div class="flex gap-4">
					<button on:click={prevPage}
						><AngleLeftOutline class={`${currentPage === 0 ? 'text-gray-200' : ''}`} /></button
					>
					<div class="flex flex-row gap-3 items-center">
						{#each Array(Math.min(10, Math.ceil(dataSource.length / pageNumber) - pageStart)) as _, i}
							<button
								on:click={() => goToPage(i)}
								class={`${pageStart + i === currentPage ? 'font-bold text-white p-1 w-6 h-6 bg-blue-500 flex items-center justify-center rounded-full' : ''}`}
								>{pageStart + i + 1}</button
							>
						{/each}
						{#if pageEnd < Math.ceil(dataSource.length / pageNumber)}
							<button class="p-1 w-5 h-5 flex items-center justify-center rounded-full">...</button>
						{/if}
					</div>
					<button on:click={nextPage}
						><AngleRightOutline
							class={`${currentPage === totalPages - 1 ? 'text-gray-200' : ''}`}
						/></button
					>
				</div>

				<div class="flex">
					{currentPage + 1} of {totalPages} pages ({dataSource.length} items)
				</div>
			</div>
		{/if}
	{/if}
</div>