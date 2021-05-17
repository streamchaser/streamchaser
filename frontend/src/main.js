import HMR from '@roxi/routify/hmr'
import App from './App.svelte';

const app = HMR(App, { target: document.body }, 'routify-app')

export default app;

/*
// For testing the different components
import MovieDetailView from './components/MovieDetailView.svelte'
import TvDetailView from './components/TvDetailView.svelte'

const app = new TvDetailView({
	target: document.body,
});

export default app;*/
