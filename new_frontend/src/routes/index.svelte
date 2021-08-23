<script>
	import Navbar from '../components/navbar.svelte';
	import Footer from '../components/footer.svelte';
	const listOfThings = ['bent', 'ib', 'børge', 'ulla', 'åse'];
</script>

<Navbar />

<div class="container mx-auto">
	<div class="grid grid-cols-3 gap-2 p-2 pt-4 bg-base-100">
		{#each listOfThings as thing}
			<div class="card bordered w-auto">
				<figure>
					<img src="./melting_ice.jpeg" alt="haha du kan ikke se" />
				</figure>
				<div class="card-body">
					<h2 class="card-title">{thing}</h2>
				</div>
			</div>
		{/each}
	</div>
</div>

<Footer />
