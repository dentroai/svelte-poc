<script lang="ts">
    import { toast } from "svelte-sonner";
    import { Button } from "$lib/components/ui/button";
	import { Toaster } from 'svelte-sonner';
</script>

<Toaster />
<Button on:click={() => toast("Nu toată lumea poate fi cocalar.")}>Show toast</Button>

<br>
<br>
<p>Steps taken to make it work:</p>
<p>First this guide: https://www.shadcn-svelte.com/docs/installation/sveltekit</p>
<p>Then ran into some issues, and fixed it with this github issue: https://github.com/huntabyte/shadcn-svelte/issues/1729</p>
<p>Did a bunch of stuff to get it working, can't remember the exact steps anymore 🤷🏻‍♂️</p>