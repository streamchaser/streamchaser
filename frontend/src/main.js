import App from './App.svelte';

const app = new App({
	target: document.body,
});

export default app;

/*
// For testing the different components
import MovieDetailView from './components/MovieDetailView.svelte'
import TvDetailView from './components/TvDetailView.svelte'

const app = new TvDetailView({
	target: document.body,
});

export default app;*/
